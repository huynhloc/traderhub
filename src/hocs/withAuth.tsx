/**
 * this hoc will disable static optimization feature
 */

import React, { useEffect } from 'react';
import { NextPage, NextPageContext } from 'next';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import { LOGOUT_KEY, TOKEN_KEY } from 'storageKeys';
import { ROUTES, REDIRECT_STATUS_CODE } from 'constants/routes';
import { setRequesetAuthorizationHeader } from 'api/base';

export type WithAuthProps = {
  isAuthenticated: boolean;
};

export interface WithAuthPageContext extends NextPageContext {
  isAuthenticated: boolean;
}

const requireAuth = (ctx: WithAuthPageContext, token: Nullable<string>) => {
  if (!token) {
    if (typeof window === 'undefined' && ctx.res) {
      ctx.res.writeHead(REDIRECT_STATUS_CODE, { Location: ROUTES.LOGIN });
      ctx.res.end();
    } else {
      Router.replace(ROUTES.LOGIN);
    }
    return { isAuthenticated: false };
  } else {
    setRequesetAuthorizationHeader(token);
    return { isAuthenticated: true };
  }
};

const requireUnAuth = (ctx: WithAuthPageContext, token: Nullable<string>) => {
  if (token) {
    setRequesetAuthorizationHeader(token);
    if (typeof window === 'undefined' && ctx.res) {
      ctx.res.writeHead(REDIRECT_STATUS_CODE, { Location: ROUTES.HOME });
      ctx.res.end();
    } else {
      Router.replace(ROUTES.HOME);
    }
    return { isAuthenticated: true };
  }
  return { isAuthenticated: false };
};

const auth = (ctx: WithAuthPageContext) => {
  const { [TOKEN_KEY]: token } = nextCookie(ctx || {});
  switch (ctx.pathname) {
    case ROUTES.LOGIN:
    case ROUTES.SIGNUP:
    case ROUTES.SIGNUP_SUCCESS:
    case ROUTES.FORGOT_PASSWORD:
    case ROUTES.EMAIL_CONFIRMATION:
      return requireUnAuth(ctx, token);
    case ROUTES.PROFILE:
      return requireAuth(ctx, token);
    default:
      return { isAuthenticated: !!token };
  }
};

const withAuth = <P extends WithAuthProps>(C: NextPage<unknown>) => {
  const displayName = `withAuth(${C.displayName || C.name || 'Component'})`;
  const Wrapper = (props: P) => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === LOGOUT_KEY) {
        Router.push(ROUTES.LOGIN);
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem(LOGOUT_KEY);
      };
    }, []);

    return <C {...props} />;
  };

  Wrapper.displayName = displayName;

  Wrapper.getInitialProps = async (ctx: WithAuthPageContext) => {
    const authProps = auth(ctx);
    const componentProps = C.getInitialProps
      ? await C.getInitialProps(ctx)
      : {};
    ctx.isAuthenticated = authProps.isAuthenticated;
    return { ...(componentProps as Map<string, unknown>), ...authProps };
  };
  return Wrapper;
};

export default withAuth;
