import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import { CollapseAlert } from 'components';
import UserRedux from 'redux/user';
import { getServerErrorMessage } from 'utils';
import { ServerError } from 'interfaces';

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
    boldText: {
      fontWeight: theme.typography.fontWeightMedium,
    },
    resend: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

const EmailConfirmation: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const dispatch = useDispatch();
  const [sendCounter, setSendCounter] = useState(0);
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const serverError = useSelector((state) => state.user.error as ServerError[]);
  const serverErrorMessage = getServerErrorMessage(serverError);
  const sendEmail = () => {
    if (sendCounter < 5) {
      dispatch(
        UserRedux.actions.sendEmailConfirmation({
          email: router.query.email as string,
          callback: (err) => {
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
          className={classes.title}
          component="h1"
        >
          Đăng ký
        </Typography>
        {isProcessing ? (
          <Typography
            color="textPrimary"
            variant="body1"
            className={classes.des}
            component="span"
          >
            Đang gửi...
          </Typography>
        ) : (
          <Typography
            color="textPrimary"
            variant="body1"
            className={classes.des}
          >
            Chúng tôi đã gửi hướng dẫn xác thực vào địa chỉ
            <Typography
              color="primary"
              variant="body1"
              component="span"
              className={classes.boldText}
            >
              {` ${router.query?.email}. `}
            </Typography>
            Vui lòng kiểm tra!
          </Typography>
        )}
      </Box>
      <CollapseAlert
        severity="error"
        onClose={() => dispatch(UserRedux.actions.resetError())}
        message={serverErrorMessage}
      />
      <Typography
        variant="body2"
        classes={{ root: classes.resend }}
        component="div"
      >
        Không nhận được email?
        <Button
          disableElevation
          disableFocusRipple
          disableTouchRipple
          variant="text"
          type="submit"
          disabled={isProcessing}
          onClick={sendEmail}
        >
          <Typography
            component="span"
            color="primary"
            variant="body2"
            className={classes.boldText}
          >
            {` Gửi lại.`}
          </Typography>
        </Button>
      </Typography>
    </Box>
  );
};

export default EmailConfirmation;
