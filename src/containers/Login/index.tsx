import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { TextField, Box, Typography, Button, Divider } from '@material-ui/core';
import { CollapseAlert, CircularProgress } from 'components';
import { AUTHEN_PROVIDER, EMAIL_PATTERN } from 'constants/app';
import UserRedux from 'redux/user';
import { getServerErrorMessage } from 'utils';
import { ServerError } from 'interfaces';
import FaceBookIcon from 'assets/images/fb-icon.svg';
import GoogleIcon from 'assets/images/google-icon.svg';

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
    forgotPass: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },
    loginBtn: {
      height: '54px',
      borderRadius: '27px',
      [theme.breakpoints.down('xs')]: {
        height: '46px',
        borderRadius: '23px',
        fontSize: theme.typography.caption.fontSize,
      },
      color: theme.palette.common.white,
      '&.facebook-btn': {
        backgroundColor: '#5C79FF !important',
        marginBottom: theme.spacing(1),
      },
      '&.google-btn': {
        backgroundColor: '#FE4D4D !important',
      },
    },
    startIcon: {
      position: 'absolute',
      left: '20px',
      [theme.breakpoints.down('xs')]: {
        left: '16px',
      },
    },
    orLine: {
      display: 'flex',
      alignItems: 'center',
      margin: `${theme.spacing(2.5)}px 0px ${theme.spacing(1.5)}px`,
      [theme.breakpoints.down('xs')]: {
        margin: `${theme.spacing(1.5)}px 0px`,
      },
      color: theme.palette.text.disabled,
      '& .or': {
        margin: '0 8px',
      },
    },
    divider: {
      height: 2,
      flex: 1,
    },
    actionBtn: {
      marginTop: theme.spacing(1.5),
    },
  })
);

type FormInputs = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const serverError = useSelector((state) => state.user.error as ServerError[]);
  const serverErrorMessage = getServerErrorMessage(serverError);
  const { register, handleSubmit, errors, getValues } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    dispatch(
      UserRedux.actions.login({
        identifier: data.email,
        password: data.password,
        callback: (error, data) => {
          !error && data && router.replace('/forum');
        },
      })
    );
  };

  useEffect(() => {
    const { provider, access_token } = router.query;
    if (provider && access_token) {
      const payload = {
        accessToken: access_token as string,
        callback: (error: unknown, data: unknown) => {
          !error && data && router.replace('/forum');
        },
      };
      switch (provider) {
        case AUTHEN_PROVIDER.FACEBOOK:
          dispatch(UserRedux.actions.loginWithFacebook(payload));
          break;
        case AUTHEN_PROVIDER.GOOGLE:
          dispatch(UserRedux.actions.loginWithGoogle(payload));
          break;
        default:
          break;
      }
    }

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
          Bạn chưa đăng ký?
          <Link href="/signup">
            <a>
              <Typography
                variant="body2"
                color="primary"
                component="span"
              >{` Đăng ký tại đây.`}</Typography>
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
          Đăng nhập vào TraderHub
        </Typography>
      </Box>
      <Button
        disableElevation
        size="large"
        variant="contained"
        className="facebook-btn"
        classes={{ root: classes.loginBtn, startIcon: classes.startIcon }}
        startIcon={
          !!router.query?.access_token &&
          router.query?.provider === AUTHEN_PROVIDER.FACEBOOK &&
          isProcessing ? (
            <CircularProgress />
          ) : (
            <FaceBookIcon />
          )
        }
        disabled={isProcessing}
        onClick={() => {
          router.push(`${process.env.NEXT_PUBLIC_API_URL}/connect/facebook`);
        }}
      >
        Đăng nhập với Facebook
      </Button>
      <Button
        disableElevation
        size="large"
        variant="contained"
        className="google-btn"
        classes={{ root: classes.loginBtn, startIcon: classes.startIcon }}
        disabled={isProcessing}
        startIcon={
          !!router.query?.access_token &&
          router.query?.provider === AUTHEN_PROVIDER.GOOGLE &&
          isProcessing ? (
            <CircularProgress />
          ) : (
            <GoogleIcon />
          )
        }
        onClick={() => {
          router.push(`${process.env.NEXT_PUBLIC_API_URL}/connect/google`);
        }}
      >
        Đăng nhập với Google
      </Button>
      <div className={classes.orLine}>
        <Divider className={classes.divider} />
        <Typography className="or" variant="body2" color="inherit">
          Hoặc
        </Typography>
        <Divider className={classes.divider} />
      </div>
      <CollapseAlert
        severity="error"
        onClose={() => dispatch(UserRedux.actions.resetError())}
        message={serverErrorMessage}
      />
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <TextField
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
        <TextField
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          variant="outlined"
          margin="normal"
          inputRef={register({
            required: 'Hãy nhập nội dung',
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Typography
          variant="body2"
          classes={{ root: classes.forgotPass }}
          component="div"
        >
          Quên mật khẩu?
          <Button
            variant="text"
            onClick={() => {
              router.push({
                pathname: '/forgot-password',
                query: {
                  email: getValues('email'),
                },
              });
            }}
          >
            <Typography component="span" color="primary" variant="body2">
              {` Khôi phục.`}
            </Typography>
          </Button>
        </Typography>
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
          {isProcessing &&
            !router.query?.access_token &&
            !router.query?.provider && <CircularProgress />}
          Đăng nhập
        </Button>
      </form>
    </Box>
  );
};

export default Login;
