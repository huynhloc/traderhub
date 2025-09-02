import React, { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Paper, Grid, Box } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import LoginPattern from 'assets/images/login-pattern.svg';

type Props = {
  children?: ReactNode;
  title?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
    },
    leftContent: {
      position: 'relative',
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      background: 'linear-gradient(282.34deg, #FAC011 0%, #4CA1AF 97.76%)',
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(1),
      },
    },
    backgroundImg: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    leftFooter: {
      marginTop: theme.spacing(0.5),
      fontSize: theme.typography.body1.fontSize,
      color: theme.palette.common.white,
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
      },
    },
    rightContent: {
      display: 'flex',
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
  })
);

const AuthLayout: React.FC<Props> = ({ children, title = 'Traderhub' }) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  return (
    <Paper elevation={0}>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Grid container classes={{ root: classes.root }}>
        <Grid
          item
          xs={12}
          sm={6}
          classes={{
            root: classes.leftContent,
          }}
        >
          <LoginPattern className={classes.backgroundImg} />
          <Link href="/forum">
            <a>
              <Image
                objectFit="contain"
                quality={100}
                width={isMobile ? 75 : 217}
                height={isMobile ? 40 : 115}
                src="/images/white-logo.png"
                alt="traderhub"
              />
            </a>
          </Link>
          <div className={classes.leftFooter}>
            <p>© 2021 Trader Hub</p>
            <p>All rights reserved.</p>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          classes={{
            root: classes.rightContent,
          }}
        >
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AuthLayout;
