import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useTheme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Grid,
  useMediaQuery,
  CircularProgress,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { Webinar } from 'interfaces';
import { CollapseAlert } from 'components';
import AcademyRedux from 'redux/academy';
import { getServerErrorMessage } from 'utils';
import { EMAIL_PATTERN, PHONE_PATTERN } from 'constants/app';
import { createRegisterWebinar } from 'api/webinarApis';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.common.white,
    },
    editor: {
      fontSize: `${theme.typography.fontSize} !important`,
      fontFamily: theme.typography.fontFamily,
    },
    editorPreview: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      '& *': {
        maxWidth: '100%',
      },
      '& ul': {
        whiteSpace: 'normal',
        padding: 0,
        listStylePosition: 'inside',
      },
    },
    circularProgress: {
      color: theme.palette.common.white,
      marginRight: theme.spacing(1),
    },
    fabBtn: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
    },
  })
);

type Props = {
  isOpen: boolean;
  requestClose: () => void;
  webinar: Webinar;
};

type FormInputs = {
  name: string;
  email: string;
  phone: string;
};

const RegisterWebinarModal: React.FC<Props> = ({
  isOpen,
  requestClose,
  webinar,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const currentUser = useSelector((state) => state.user.currentUser);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const { register, handleSubmit, errors, setValue } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: FormInputs) => {
    try {
      setIsProcessing(true);
      const forumData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        webinar: webinar.id,
      };
      console.log(forumData);
      await createRegisterWebinar(forumData);
      dispatch(AcademyRedux.actions.registerWebinars(webinar.id));
      setIsProcessing(false);
      requestClose();
    } catch (error) {
      setIsProcessing(false);
      setServerErrorMessage(getServerErrorMessage(error));
    }
  };

  let timer = 0;

  useEffect(() => {
    if (isOpen) {
      timer = setTimeout(() => {
        setServerErrorMessage('');
        setValue('name', currentUser?.fullName || '');
        setValue('email', currentUser?.email || '');
        setValue('phone', currentUser?.phone || '');
      });
    } else {
      timer && clearTimeout(timer);
    }
  }, [isOpen]);

  const ActionIcon = AddIcon;
  return (
    <Dialog
      disableEnforceFocus
      fullScreen={fullScreen}
      fullWidth
      maxWidth="md"
      open={isOpen}
      PaperProps={{
        classes: { root: classes.root },
      }}
      onClose={requestClose}
    >
      <DialogTitle>Đăng ký sự kiện</DialogTitle>
      <DialogContent>
        <CollapseAlert
          severity="error"
          onClose={() => setServerErrorMessage('')}
          message={serverErrorMessage}
        />
        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                fullWidth
                name="name"
                label="Tên"
                variant="outlined"
                margin="none"
                inputRef={register({
                  required: 'Hãy nhập nội dung',
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="email"
                label="Email"
                variant="outlined"
                margin="none"
                inputRef={register({
                  required: 'Hãy nhập nội dung',
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: 'Email không đúng',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="phone"
                label="Số điện thoại"
                variant="outlined"
                margin="none"
                inputRef={register({
                  required: 'Hãy nhập nội dung',
                  pattern: {
                    value: PHONE_PATTERN,
                    message: 'SDT không đúng',
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={requestClose} color="primary" variant="outlined">
          Huỷ
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isProcessing}
          startIcon={
            !isProcessing ? (
              <ActionIcon />
            ) : (
              <CircularProgress
                size={20}
                classes={{
                  root: classes.circularProgress,
                }}
              />
            )
          }
          onClick={handleSubmit(onSubmit)}
        >
          Đăng Ký
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterWebinarModal;
