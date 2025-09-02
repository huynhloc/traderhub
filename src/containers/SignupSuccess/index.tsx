import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import { ROUTES } from 'constants/routes';
import { setToken } from 'utils';
import { setRequesetAuthorizationHeader } from 'api/base';

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
  })
);

const SignupSuccess: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

  const handleGetStart = () => {
    const token = router.query?.access_token as string;
    if (token) {
      setToken(token);
      setRequesetAuthorizationHeader(token);
      router.push(ROUTES.HOME);
    } else {
      router.push(ROUTES.LOGIN);
    }
  };

  return (
    <Box
      py={3}
      px={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      className={classes.root}
    >
      <Typography
        color="textSecondary"
        variant="h4"
        component="h1"
        className={classes.title}
      >
        Đăng ký thành công
      </Typography>
      <Typography variant="body1" classes={{ root: classes.des }}>
        Chúc mừng bạn đã gia nhập thành công vào Trader Hub.
      </Typography>
      <Box mt={1.5}>
        <Image
          objectFit="contain"
          quality={100}
          width={500}
          height={380}
          src="/images/hero-employee.png"
          alt="traderhub đăng kí thành công"
        />
      </Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disableElevation
        size="large"
        classes={{
          root: classes.actionBtn,
        }}
        onClick={handleGetStart}
      >
        Khám phá ngay
      </Button>
    </Box>
  );
};

export default SignupSuccess;
