import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { TextField, Box, Typography, Button } from '@material-ui/core';
import { CollapseAlert, CircularProgress } from 'components';
import UserRedux from 'redux/user';
import { getServerErrorMessage } from 'utils';
import { ServerError } from 'interfaces';
import { EMAIL_PATTERN } from 'constants/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '80%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    title: {
      marginBottom: theme.spacing(2.5),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(1.5),
        fontSize: theme.typography.h6.fontSize,
      },
    },
    des: {
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(0.5),
        fontSize: theme.typography.body2.fontSize,
      },
    },
    actionBtn: {
      marginTop: theme.spacing(2.5),
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1.5),
      },
    },
    resend: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(2.5),
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1.5),
      },
    },
  })
);

type FormInputs = {
  email: string;
};

const ForgottenPassword: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [sendCounter, setSendCounter] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const serverError = useSelector((state) => state.user.error as ServerError[]);
  const serverErrorMessage = getServerErrorMessage(serverError);
  const { register, handleSubmit, errors } = useForm<FormInputs>({
    defaultValues: {
      email: (router.query?.email as string) || '',
    },
  });
  const onSubmit = (data: FormInputs) => {
    if (sendCounter < 5) {
      setIsSent(false);
      dispatch(
        UserRedux.actions.forgotPassword({
          email: data.email,
          callback: (err) => {
            !err && setIsSent(true);
            !err && setSendCounter(sendCounter + 1);
          },
        })
      );
    }
  };

  useEffect(() => {
    return () => {
      dispatch(UserRedux.actions.resetError());
    };
  }, []);

  return (
    <Box
      pt={3}
      pb={3}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      className={classes.root}
    >
      <Box
        position="absolute"
        top={0}
        right={0}
        display="flex"
        flexDirection="row"
      >
        <Typography variant="body2">
          Bạn đã có tài khoản?
          <Link href="/login">
            <a>
              <Typography
                variant="body2"
                color="primary"
                component="span"
              >{` Đăng nhập.`}</Typography>
            </a>
          </Link>
        </Typography>
      </Box>
      <Box>
        <Typography
          color="textSecondary"
          variant="h4"
          component="h1"
          className={classes.title}
        >
          Khôi phục lại mật khẩu
        </Typography>
        <Typography color="textPrimary" variant="body1" className={classes.des}>
          {!isSent
            ? 'Chúng tôi sẽ gửi liên kết đến email của bạn để khôi phục mật khẩu. Bạn sẽ nhận được trong vòng 5 phút.'
            : 'Chúng tôi đã gửi liên kết đến email của bạn. Xin vui lòng kiểm tra.'}
        </Typography>
      </Box>
      <CollapseAlert
        severity="error"
        onClose={() => dispatch(UserRedux.actions.resetError())}
        message={serverErrorMessage}
      />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          autoFocus
          required
          fullWidth
          name="email"
          label="Email"
          type="email"
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
        {sendCounter === 0 ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disableElevation
            size="large"
            type="submit"
            disabled={isProcessing}
            classes={{
              root: classes.actionBtn,
            }}
          >
            {isProcessing && <CircularProgress />}
            Xác nhận
          </Button>
        ) : (
          <Typography
            variant="body2"
            classes={{ root: classes.resend }}
            component="div"
          >
            Chưa nhận được email?
            <Button
              disableElevation
              disableFocusRipple
              disableTouchRipple
              variant="text"
              type="submit"
              // disabled
              disabled={isProcessing}
            >
              <Typography component="span" color="primary" variant="body2">
                {` Gửi lại.`}
              </Typography>
            </Button>
          </Typography>
        )}
      </form>
    </Box>
  );
};

export default ForgottenPassword;
