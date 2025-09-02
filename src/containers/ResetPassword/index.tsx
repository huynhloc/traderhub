import React, { useEffect } from 'react';
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
import { PASSWORD_PATTERN } from 'constants/app';

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
    input: {
      marginBottom: theme.spacing(1),
    },
    actionBtn: {
      marginTop: theme.spacing(2.5),
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1.5),
      },
    },
  })
);

type FormInputs = {
  password: string;
  passwordConfirmation: string;
};

const ResetPassword: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const serverError = useSelector((state) => state.user.error as ServerError[]);
  const serverErrorMessage = getServerErrorMessage(serverError);
  const { register, handleSubmit, errors, getValues } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    dispatch(
      UserRedux.actions.resetPassword({
        ...data,
        code: router.query?.code as string,
        callback: (error) => {
          !error && router.replace('/reset-password-success');
        },
      })
    );
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
          Tạo mật khẩu mới
        </Typography>
        <Typography color="textPrimary" variant="body1" className={classes.des}>
          Mật khẩu mới phải khác mật khẩu cũ và trên 8 ký tự.
        </Typography>
      </Box>
      <CollapseAlert
        severity="error"
        onClose={() => dispatch(UserRedux.actions.resetError())}
        message={serverErrorMessage}
      />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          required
          fullWidth
          autoFocus
          name="password"
          label="Mật khẩu mới"
          type="password"
          variant="outlined"
          margin="none"
          className={classes.input}
          inputRef={register({
            required: 'Hãy nhập nội dung',
            pattern: {
              value: PASSWORD_PATTERN,
              message: 'Tối thiểu 8 ký tự, ít nhất một chữ cái và một chữ số',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          required
          fullWidth
          name="passwordConfirmation"
          label="Xác nhận mật khẩu mới"
          type="password"
          variant="outlined"
          margin="none"
          className={classes.input}
          inputRef={register({
            required: 'Hãy nhập nội dung',
            validate: (value) =>
              getValues('password') !== value
                ? 'Mật khẩu không đúng'
                : undefined,
          })}
          error={!!errors.passwordConfirmation}
          helperText={errors.passwordConfirmation?.message}
        />
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
      </form>
    </Box>
  );
};

export default ResetPassword;
