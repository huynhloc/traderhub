import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from '@material-ui/core';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player/lazy';
import { useForm } from 'react-hook-form';
import UserRedux from 'redux/user';
import { useRouter } from 'next/router';
import { ROUTES } from 'constants/routes';
import { User } from 'interfaces';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'constants/app';

type ItemSize = 'medium' | 'small';

type StyleProps = {
  size?: ItemSize;
};
type Props = {
  size?: ItemSize;
};
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    carousel: {
      position: 'relative',
      marginBottom: theme.spacing(2),
    },
    carouselContent: {
      position: 'absolute',
      width: '90%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50% , -50%)',
      zIndex: theme.spacing(0.125),
      textAlign: 'center',
      color: '#ffff',
    },
    carouselLink: {
      position: 'absolute',
      bottom: ({ size }) => (size === 'medium' ? '20%' : '10%'),
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: theme.spacing(0.125),
    },
    showMoreBtn: {
      fontSize: ({ size }) => (size === 'medium' ? '20px' : '10px'),
      boxShadow: 'none',
    },
    carouselSocial: {
      position: 'absolute',
      right: '1%',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: theme.spacing(0.125),
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    carouselTitle: {
      fontWeight: theme.typography.h5.fontWeight,
      textAlign: 'center',
      fontSize: ({ size }) => (size === 'medium' ? '46px' : '30px'),
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
      textShadow: ` 4px 7px 10px  rgba(0,0,0,0.2)`,
    },

    carouselDescription: {
      textAlign: 'center',
      fontSize: ({ size }) => (size === 'medium' ? '34px' : '14px'),
      textShadow: ` 4px 7px 10px  rgba(0,0,0,0.2)`,
    },
    carouselLinkHome: {
      color: '#ffff',
      marginRight: theme.spacing(0.5),
      marginTop: theme.spacing(0.2),
      textAlign: 'center',

      fontSize: ({ size }) => (size === 'medium' ? '12px' : '10px'),
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    carouselLinkIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: ({ size }) =>
        size !== 'medium' ? theme.spacing(0.5) : theme.spacing(0.7),
    },
    carouselLinkPage: {
      color: '#ffff',
      marginLeft: theme.spacing(0.5),
      marginTop: theme.spacing(0.25),
      textAlign: 'center',
      fontSize: ({ size }) => (size === 'medium' ? '12px' : '10px'),
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.6),
    },
    videoContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: '56.25%',
    },
    layerBox: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      // backgroundColor: 'rgba(0, 0, 0, 0.3)',

      // backgroundColor: theme.palette.common.white,
    },
    input: {
      marginBottom: theme.spacing(1),
      // backgroundColor: 'white',
    },
    boxSignup: {
      position: 'relative',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
    },
    formInput: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    titleInput: {
      marginBottom: theme.spacing(0.8),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(0.5),
        fontSize: theme.typography.h5.fontSize,
      },
    },
  })
);
type FormInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkPrivacy?: boolean;
};

const Carousel: React.FC<Props> = ({ size = 'medium' }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles({ size });
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const academyData = useSelector((state) => state.academy.data);
  const featuredVideo = academyData?.featuredVideo;
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
  return (
    <Grid item xs={12}>
      <Box className={classes.carousel}>
        <Image
          layout="responsive"
          width={322}
          height={size === 'medium' ? 140 : 210}
          // https://s3.ap-southeast-1.amazonaws.com/files.gigantecmedia.com/ForumTradehub/banner_1248_x_465_ec02feedc1.gif
          src="/images/banner-hero.png"
          alt="carousel-trading"
        />

        <Box className={classes.carouselContent}>
          <Grid container spacing={2}>
            <Grid item md={8}>
              <div className={classes.videoContainer}>
                <ReactPlayer
                  url={featuredVideo}
                  playing
                  controls
                  loop={false}
                  width="100%"
                  height="100%"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
            </Grid>
            <Grid item md={4}>
              <Box className={classes.boxSignup}>
                <Box className={classes.layerBox}></Box>
                <Box className={classes.formInput}>
                  <Typography
                    color="textSecondary"
                    variant="h4"
                    component="h1"
                    className={classes.titleInput}
                  >
                    Đăng Ký
                  </Typography>
                  <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit(onSubmit)}
                  >
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
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Grid>
  );
};

export default Carousel;
