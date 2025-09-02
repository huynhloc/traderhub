import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import {
  TextField,
  Box,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { CollapseAlert, CircularProgress } from 'components';
import UserRedux from 'redux/user';
import { getServerErrorMessage } from 'utils';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'constants/app';
import { ServerError, User } from 'interfaces';
import { ROUTES } from 'constants/routes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '80%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    title: {
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(0.5),
        fontSize: theme.typography.h5.fontSize,
      },
    },
    input: {
      marginBottom: theme.spacing(1),
    },
    privacyCheckbox: {
      marginTop: theme.spacing(0.5),
    },
    actionBtn: {
      marginTop: theme.spacing(1.4),
    },
  })
);

type FormInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkPrivacy: boolean;
};

const Signup: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const serverError = useSelector((state) => state.user.error as ServerError[]);
  const serverErrorMessage = getServerErrorMessage(serverError);
  const { register, handleSubmit, errors, getValues } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    dispatch(
      UserRedux.actions.signup({
        fullName: data.fullName,
        username: data.fullName,
        email: data.email,
        password: data.password,
        callback: (error, data) => {
          !error &&
            data &&
            router.push({
              pathname: ROUTES.EMAIL_CONFIRMATION,
              query: {
                email: (data as User).email,
              },
            });
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
          Đăng Ký
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
          name="fullName"
          label="Họ Và Tên"
          variant="outlined"
          margin="none"
          className={classes.input}
          inputRef={register({
            required: 'Hãy nhập nội dung',
          })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
        <TextField
          required
          fullWidth
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          margin="none"
          className={classes.input}
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
        <TextField
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          variant="outlined"
          margin="none"
          className={classes.input}
          inputRef={register({
            required: 'Hãy nhập nội dung',
            pattern: {
              value: PASSWORD_PATTERN,
              message: 'Tối thiểu 8 ký tự',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          required
          fullWidth
          name="confirmPassword"
          label="Nhập Lại Mật khẩu"
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
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
        />
        <FormControlLabel
          classes={{
            root: classes.privacyCheckbox,
          }}
          control={
            <Checkbox
              name="checkedPrivacy"
              inputRef={register({
                required: 'Hãy nhập nội dung',
              })}
            />
          }
          label={
            <Typography variant="body2">
              Tạo tài khoản có nghĩa là bạn đồng ý với chính sách
              <Link href="/">
                <a>
                  <Typography component="span" color="primary" variant="body2">
                    {` Quyền riêng tư và Bảo mật `}
                  </Typography>
                </a>
              </Link>
              của chúng tôi.
            </Typography>
          }
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
          Đăng Ký
        </Button>
      </form>
    </Box>
  );
};

export default Signup;
