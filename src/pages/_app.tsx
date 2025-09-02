import React, { useEffect } from 'react';
import Head from 'next/head';
import type { AppContext, AppProps } from 'next/app';
import { useRouter } from 'next/router';
import absoluteUrl from 'next-absolute-url';
import querystring from 'querystring';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { END } from 'redux-saga';
import reduxWrapper, { SagaStore } from 'redux/store';
import theme from 'styles/theme';
import moment from 'moment';
import mixpanel from 'mixpanel-browser';
import { commontPageView } from 'utils/tracking';
import { SEOTags } from 'components';
import GlobalRedux from 'redux/global';
import 'nprogress/nprogress.css';
import 'styles/styles.scss';

moment.locale('vi');

function MyApp({
  Component,
  pageProps,
  pageUrl,
}: AppProps & { pageUrl: string }) {
  const router = useRouter();
  const headStr = useSelector((state) => state.global.appConfig?.head);
  useEffect(() => {
    mixpanel.init('8c34af65315672ff3057143e886e65c4');
  }, []);
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      commontPageView(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="canonical" href={pageUrl} />
        <meta
          key="ogUrl"
          property="og:url"
          content={pageUrl || 'https://www.traderhub.vn'}
        />
        <meta
          name="keywords"
          content="diễn đầu đầu tư, diễn đàn đầu tư tài chính, kênh đầu tư, đầu tư forex"
        />
        <meta property="og:site_name" content="TraderHub" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="TraderHub" />
        <meta key="ogType" name="og:type" content="website" />
      </Head>
      {headStr && <Head>{parse(headStr)}</Head>}
      <SEOTags />
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  //  Wait for all page actions to dispatch
  const pageProps = {
    ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
  };

  try {
    // get app config
    if (!ctx.store.getState().global?.appConfig) {
      ctx.store.dispatch(GlobalRedux.actions.getAppConfig());
    }

    // Stop the saga if on server
    if (ctx.req) {
      ctx.store.dispatch(END);
      await (ctx.store as SagaStore).sagaTask.toPromise();
    }
  } catch (error) {
    console.log('=====>');
    console.log(error);
  }

  const { page, q, vertical } = ctx.query;

  console.log('query.page: ', page);
  console.log('query.q: ', q);
  console.log('query.vertical: ', vertical);

  const queryParam: {
    page?: string;
    q?: string;
    vertical?: string;
  } = {};
  if (q) queryParam.q = q as string;
  if (page) queryParam.page = page as string;
  if (vertical) queryParam.vertical = vertical as string;

  const queryParamStr = querystring.stringify(queryParam);

  const { protocol, host } = absoluteUrl(ctx.req, 'localhost:3000');
  let pageUrl = `${protocol}//${host}${ctx.asPath?.split('?')[0]}`;
  if (queryParamStr) pageUrl = `${pageUrl}?${queryParamStr}`;

  // 3. Return props
  return {
    pageUrl,
    pageProps,
  };
};

export default reduxWrapper.withRedux(MyApp);
