import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize, isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Avatar,
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Badge,
  IconButton,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { useTheme } from '@material-ui/core/styles';
import GodlikeTraderIcon from 'assets/icons/godlike-trader-icon.svg';
import ProfessionalTraderIcon from 'assets/icons/professional-trader-icon.svg';
import ExperiencedTraderIcon from 'assets/icons/experienced-trader-icon.svg';
import {
  TBox,
  CircularProgress,
  CollapseAlert,
  ConfirmDialog,
} from 'components';
import { Handle } from 'components/ConfirmDialog';
import {
  getMemberLabel,
  formatDate,
  formatNumber,
  getServerErrorMessage,
} from 'utils';
import UserRedux from 'redux/user';
import { ServerError, TFile, User } from 'interfaces';
import { AUTHEN_PROVIDER, PASSWORD_PATTERN } from 'constants/app';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Color } from '@material-ui/lab/Alert';
import AuthConnect from './AuthConnect';
import { ROUTES } from 'constants/routes';

const ImageOptimizer = dynamic(
  async () => import('components/ImageOptimizer'),
  {
    ssr: false,
  }
);

const MEMBER_LABEL_ICONS = {
  master: GodlikeTraderIcon,
  professional: ProfessionalTraderIcon,
  experienced: ExperiencedTraderIcon,
  beginner: '',
};

type ProfileFormInputs = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  intro: string;
};

type PasswordFormInputs = {
  password: string;
  confirmPassword: string;
};

type AlertPayload = {
  severity: Color | undefined;
  message: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: 70,
      height: 70,
      marginRight: theme.spacing(1.5),
    },
    divider1: {
      margin: `0 ${-theme.spacing(1)}px`,
      [theme.breakpoints.down('xs')]: {
        margin: `0 ${-theme.spacing(0.75)}px`,
      },
    },
    divider2: {
      margin: `0 ${-theme.spacing(1.5)}px`,
      [theme.breakpoints.down('xs')]: {
        margin: `0 ${-theme.spacing(1)}px`,
      },
    },
    fallbackIcon: {
      color: theme.palette.common.white,
    },
    name: {
      fontWeight: theme.typography.fontWeightMedium,
      marginBottom: theme.spacing(0.25),
    },
    email: {
      marginBottom: theme.spacing(0.5),
    },
    logoutBtn: {
      marginBottom: '-6px',
      marginLeft: '-8px',
      marginTop: theme.spacing(2),
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
    numPostIcon: {
      width: '18px',
      height: '18px',
      marginLeft: theme.spacing(1),
      marginRight: '4px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      paddingTop: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        paddingTop: theme.spacing(1),
      },
    },
    input: {
      marginBottom: theme.spacing(1),
    },
    actionBtn: {
      marginTop: theme.spacing(1.5),
      alignSelf: 'flex-end',
      [theme.breakpoints.down('xs')]: {
        marginTop: theme.spacing(1),
      },
    },
    cameraBadge: {
      right: '28%',
      bottom: '20',
    },
    cameraBtn: {
      padding: 5,
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    alert: {
      marginBottom: 0,
    },
  })
);

const Profile: React.FC = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const deleteConfirmRef = useRef<Handle>();
  const user = useSelector((state) => state.user.currentUser) as User;
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [
    updateProfileStatus,
    setUpdateProfileStatus,
  ] = useState<AlertPayload | null>(null);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [updatePassStatus, setUpdatePassStatus] = useState<AlertPayload | null>(
    null
  );
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>();

  const label = getMemberLabel(user.point);
  const Icon = MEMBER_LABEL_ICONS[label];
  const labelIcon = Icon ? <Icon width="100%" /> : capitalize(label);

  const {
    register,
    handleSubmit: handleSubmitProfile,
    errors,
    // getValues,
    setValue,
  } = useForm<ProfileFormInputs>({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      intro: user.intro,
    },
  });
  const onSubmitProfile = (data: ProfileFormInputs) => {
    setIsUpdatingProfile(true);
    setUpdateProfileStatus(null);
    dispatch(
      UserRedux.actions.updateMe({
        id: user.id,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        intro: data.intro,
        callback: (error, data) => {
          setIsUpdatingProfile(false);
          if (!error && data) {
            setUpdateProfileStatus({
              severity: 'success',
              message: 'Cập nhật thành công.',
            });
          } else {
            setUpdateProfileStatus({
              severity: 'error',
              message: getServerErrorMessage(error as ServerError[]),
            });
          }
        },
      })
    );
  };
  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    errors: errorsPass,
    getValues: getValuesPass,
  } = useForm<PasswordFormInputs>();

  const onSubmitPass = (data: PasswordFormInputs) => {
    setIsUpdatingPass(true);
    dispatch(
      UserRedux.actions.changePass({
        id: user.id,
        password: data.password,
        callback: (error, data) => {
          setIsUpdatingPass(false);
          if (!error && data) {
            setUpdatePassStatus({
              severity: 'success',
              message: 'Đổi mật khẩu thành công.',
            });
          } else {
            setUpdatePassStatus({
              severity: 'error',
              message: getServerErrorMessage(error as ServerError[]),
            });
          }
        },
      })
    );
  };

  const handleLogout = () => {
    dispatch(UserRedux.actions.logout());
    router.push('/login');
  };

  const handleOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (isEmpty(target.files)) {
      return;
    }
    setAvatarFile((target.files || [])[0]);
  };

  const onFileResized = (tFile: TFile) => {
    setIsUpdatingAvatar(true);
    dispatch(
      UserRedux.actions.updateAvatar({
        oldAvatarId: user.avatar?.id,
        userId: user.id,
        image: tFile,
        callback: (error) => {
          setIsUpdatingAvatar(false);
          setAvatarFile(null);
          if (error) {
            toast.error(getServerErrorMessage(error as ServerError[]));
          }
        },
      })
    );
  };

  const connect = (provier: string) => () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/connect/${provier}`);
  };

  const disconnect = (provier: string) => () => {
    const updatedConnect = (user.connect || []).filter(
      (p) => p.provider !== provier
    );

    setUpdateProfileStatus(null);
    dispatch(
      UserRedux.actions.updateMe({
        id: user.id,
        connect: updatedConnect,
        callback: (error) => {
          deleteConfirmRef?.current?.handleClose();
          if (error) {
            setUpdateProfileStatus({
              severity: 'error',
              message: getServerErrorMessage(error as ServerError[]),
            });
          }
        },
      })
    );
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setValue('fullName', user.fullName);
        setValue('email', user.email);
        setValue('phone', user.phone);
        setValue('address', user.address);
        setValue('intro', user.intro);
      }, 0);
    }
  }, [user]);

  useEffect(() => {
    const { provider, access_token } = router.query;
    if (provider && access_token) {
      setUpdateProfileStatus(null);
      const payload = {
        accessToken: access_token as string,
        callback: (error: unknown, data: unknown) => {
          if (!error && data) {
            router.replace(ROUTES.PROFILE, ROUTES.PROFILE, {
              shallow: true,
            });
          } else {
            setUpdateProfileStatus({
              severity: 'error',
              message: getServerErrorMessage(error as ServerError[]),
            });
          }
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
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4}>
          <TBox mb={0}>
            <Box display="flex" alignItems="center" p={1}>
              <Badge
                classes={{
                  badge: classes.cameraBadge,
                }}
                overlap="circle"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={
                  <React.Fragment>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="upload-avatar"
                      type="file"
                      onChange={handleOpenFile}
                    />
                    <label htmlFor="upload-avatar">
                      <IconButton
                        component="span"
                        className={classes.cameraBtn}
                        disabled={isProcessing}
                      >
                        {isUpdatingAvatar ? (
                          <CircularProgress
                            style={{ marginRight: 0, color: 'white' }}
                          />
                        ) : (
                          <CameraAltIcon fontSize="small" />
                        )}
                      </IconButton>
                    </label>
                  </React.Fragment>
                }
              >
                {avatarFile ? (
                  <Box width={70} height={70} mr={1.5}>
                    <ImageOptimizer
                      file={avatarFile}
                      onResized={onFileResized}
                      width={70}
                      height={70}
                      borderRadius="50%"
                    />
                  </Box>
                ) : (
                  <Avatar
                    classes={{
                      root: classes.avatar,
                      fallback: classes.fallbackIcon,
                    }}
                    src={user.avatar?.url}
                    alt={user.fullName}
                  />
                )}
              </Badge>
              <Box flex={1}>
                <Typography variant="body1" className={classes.name}>
                  {user.fullName}
                </Typography>
                <Typography variant="body2" className={classes.email}>
                  {user.email}
                </Typography>
                <Box width={1} color="primary.dark">
                  {labelIcon}
                </Box>
              </Box>
            </Box>
            <Divider className={classes.divider1} />
            <Box p={1}>
              <Box
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={0.25}
              >
                <Typography variant="subtitle1">Tham gia ngày</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  color="text.primary"
                  fontSize="body2.fontSize"
                  fontWeight="fontWeightMedium"
                >
                  <QuestionAnswerIcon className={classes.numPostIcon} />
                  {formatNumber(user.totalAnswer + user.totalComment)}
                  <DescriptionRoundedIcon className={classes.numPostIcon} />
                  {formatNumber(user.totalQuestion)}
                </Box>
              </Box>
              <Typography variant="body2">
                {formatDate(user.createdAt)}
              </Typography>
              <Button
                className={classes.logoutBtn}
                variant="text"
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Box>
          </TBox>
        </Grid>
        <Grid item xs={12} sm={12} md={7}>
          <TBox p={isMobile ? 1 : 1.5}>
            <Box
              fontSize="body1.fontSize"
              fontWeight="subtitle1.fontWeight"
              color="text.disabled"
              pb={isMobile ? 0.75 : 1}
            >
              Thông tin
            </Box>
            <Divider className={classes.divider2} />
            <form
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmitProfile(onSubmitProfile)}
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
              <Grid container spacing={isMobile ? 0 : 1}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    disabled
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
                    })}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    name="phone"
                    label="Số điện thoại"
                    type="text"
                    variant="outlined"
                    margin="none"
                    className={classes.input}
                    inputRef={register({})}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                name="address"
                label="Địa chỉ"
                variant="outlined"
                margin="none"
                className={classes.input}
                inputRef={register({})}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
              <TextField
                fullWidth
                name="intro"
                label="Về bản thân"
                variant="outlined"
                margin="none"
                className={classes.input}
                inputRef={register({})}
                error={!!errors.intro}
                helperText={errors.intro?.message}
              />
              <CollapseAlert
                className={classes.alert}
                severity={updateProfileStatus?.severity}
                onClose={() => setUpdateProfileStatus(null)}
                message={updateProfileStatus?.message}
              />
              <Grid container spacing={isMobile ? 0 : 1}>
                <Grid item xs={12} sm={12} md={6}>
                  <AuthConnect
                    canNotDisconnect={
                      user.provider === AUTHEN_PROVIDER.FACEBOOK &&
                      !user.hasPass
                    }
                    disabled={isProcessing}
                    isProcessing={
                      !!router.query?.access_token &&
                      router.query?.provider === AUTHEN_PROVIDER.FACEBOOK &&
                      isProcessing
                    }
                    provider="facebook"
                    isConnected={
                      !isEmpty(
                        (user.connect || []).find(
                          (p) => p.provider === AUTHEN_PROVIDER.FACEBOOK
                        )
                      )
                    }
                    connect={connect(AUTHEN_PROVIDER.FACEBOOK)}
                    disconnect={() => {
                      deleteConfirmRef?.current?.confirm({
                        content: 'Bạn muốn xoá liên kết facebook?',
                        action: disconnect(AUTHEN_PROVIDER.FACEBOOK),
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <AuthConnect
                    canNotDisconnect={
                      user.provider === AUTHEN_PROVIDER.GOOGLE && !user.hasPass
                    }
                    disabled={isProcessing}
                    isProcessing={
                      !!router.query?.access_token &&
                      router.query?.provider === AUTHEN_PROVIDER.GOOGLE &&
                      isProcessing
                    }
                    provider="google"
                    isConnected={
                      !isEmpty(
                        (user.connect || []).find(
                          (p) => p.provider === AUTHEN_PROVIDER.GOOGLE
                        )
                      )
                    }
                    connect={connect(AUTHEN_PROVIDER.GOOGLE)}
                    disconnect={() => {
                      deleteConfirmRef?.current?.confirm({
                        content: 'Bạn muốn xoá liên kết google?',
                        action: disconnect(AUTHEN_PROVIDER.GOOGLE),
                      });
                    }}
                  />
                </Grid>
              </Grid>
              <Divider
                className={classes.divider2}
                style={{ marginTop: theme.spacing(0.5) }}
              />
              <Button
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
                {isUpdatingProfile && <CircularProgress />}
                Lưu thay đổi
              </Button>
            </form>
          </TBox>
          <TBox p={isMobile ? 1 : 1.5}>
            <Box
              fontSize="body1.fontSize"
              fontWeight="subtitle1.fontWeight"
              color="text.disabled"
              pb={isMobile ? 0.75 : 1}
            >
              Đổi mật khẩu
            </Box>
            <Divider className={classes.divider2} />
            <form
              className={classes.form}
              noValidate
              autoComplete="off"
              onSubmit={handleSubmitPass(onSubmitPass)}
            >
              <Grid container spacing={isMobile ? 0 : 1}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Mật khẩu mới"
                    type="password"
                    variant="outlined"
                    margin="none"
                    className={classes.input}
                    inputRef={registerPass({
                      required: 'Hãy nhập nội dung',
                      pattern: {
                        value: PASSWORD_PATTERN,
                        message: 'Tối thiểu 8 ký tự',
                      },
                    })}
                    error={!!errorsPass.password}
                    helperText={errorsPass.password?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Nhập Lại Mật khẩu"
                    type="password"
                    variant="outlined"
                    margin="none"
                    className={classes.input}
                    inputRef={registerPass({
                      required: 'Hãy nhập nội dung',
                      validate: (value) =>
                        getValuesPass('password') !== value
                          ? 'Mật khẩu không đúng'
                          : undefined,
                    })}
                    error={!!errorsPass.confirmPassword}
                    helperText={errorsPass.confirmPassword?.message}
                  />
                </Grid>
              </Grid>
              <CollapseAlert
                className={classes.alert}
                severity={updatePassStatus?.severity}
                onClose={() => setUpdatePassStatus(null)}
                message={updatePassStatus?.message}
              />
              <Divider
                className={classes.divider2}
                style={{ marginTop: theme.spacing(0.5) }}
              />
              <Button
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
                {isUpdatingPass && <CircularProgress />}
                Lưu thay đổi
              </Button>
            </form>
          </TBox>
        </Grid>
      </Grid>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ConfirmDialog ref={deleteConfirmRef} isProcessing={isProcessing} />
    </React.Fragment>
  );
};

export default Profile;
