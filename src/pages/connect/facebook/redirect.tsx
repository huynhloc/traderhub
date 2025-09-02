import Router from 'next/router';
import { ROUTES, REDIRECT_STATUS_CODE } from 'constants/routes';
import { NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import { TOKEN_KEY } from 'storageKeys';

const LoginRedirect = () => null;

LoginRedirect.getInitialProps = async (ctx: NextPageContext) => {
  const { [TOKEN_KEY]: token } = nextCookie(ctx || {});
  let redirectUrl = ROUTES.HOME;
  if (ctx.query.access_token) {
    if (token) redirectUrl = ROUTES.PROFILE;
    else redirectUrl = ROUTES.LOGIN;
  }
  if (typeof window === 'undefined' && ctx.res) {
    ctx.res.writeHead(REDIRECT_STATUS_CODE, {
      Location: `${redirectUrl}?access_token=${ctx.query.access_token}&provider=facebook`,
    });
    ctx.res.end();
  } else {
    Router.replace({
      pathname: redirectUrl,
      query: {
        ...ctx.query,
        provider: 'facebook',
      },
    });
  }
  return {};
};

export default LoginRedirect;
