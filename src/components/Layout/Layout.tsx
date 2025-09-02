import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, useMediaQuery } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import Lightbox from 'react-image-lightbox';
import { setRequesetAuthorizationHeader } from 'api/base';
import UserRedux from 'redux/user';
import GlobalRedux from 'redux/global';
import { getToken } from 'utils';
import 'react-image-lightbox/style.css';
import { CSSProperties } from '@material-ui/styles';
import Header from './Header';
import Footer from './Footer';
import { SEOTags } from 'components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageContent: {
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(10),
      [theme.breakpoints.down('sm')]: {
        paddingTop: `${theme.spacing(2) + 64}px`,
      },
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(0.625),
        paddingRight: theme.spacing(0.625),
      },
    },
    ticketTapeWidget: {
      paddingTop: '78px',
      paddingBottom: theme.spacing(2),
    },
  })
);

type Props = {
  children: NonNullable<ReactNode>;
  title?: string;
  description?: string;
  contentStyles?: CSSProperties;
  disablePadding?: boolean;
};

const Layout: React.FC<Props> = ({
  children,
  title = 'TraderHub',
  description = '',
  disablePadding,
  contentStyles,
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const imageLightBox = useSelector((state) => state.global.imageLightBox);
  const closeImageLightBox = () => dispatch(GlobalRedux.actions.hideImage());
  const containerStyle = disablePadding
    ? { padding: 0, paddingTop: isMobile ? 63 : 120, ...contentStyles }
    : contentStyles;
  useEffect(() => {
    const token = getToken();
    if (token && !currentUser) {
      setRequesetAuthorizationHeader(token);
      dispatch(UserRedux.actions.fetchCurrentUser());
    }
  }, [currentUser]);

  return (
    <Paper elevation={0} style={{ height: '100%' }}>
      <SEOTags seoTitle={title} seoDescription={description} />
      <Header />
      {/* <Box className={classes.ticketTapeWidget}>
        <TickersTapeWidget />
      </Box> */}
      <Container
        maxWidth="lg"
        classes={{ root: classes.pageContent }}
        style={containerStyle}
      >
        {children}
      </Container>
      <Footer />
      {!!imageLightBox && (
        <Lightbox
          mainSrc={imageLightBox}
          onCloseRequest={closeImageLightBox}
          reactModalStyle={{
            overlay: {
              zIndex: 1100,
            },
          }}
        />
      )}
    </Paper>
  );
};

export default Layout;
