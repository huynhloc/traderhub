import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';

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

const ResetPasswordSuccess: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();

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
        Đổi mật khẩu thành công
      </Typography>
      <Box mt={1.5}>
        <Image
          objectFit="contain"
          quality={100}
          width={500}
          height={380}
          src="/images/reset-password.png"
          alt="traderhub reset password"
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
        onClick={async () => router.push('/login')}
      >
        Đăng nhập
      </Button>
    </Box>
  );
};

export default ResetPasswordSuccess;
