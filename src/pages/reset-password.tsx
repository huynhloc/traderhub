import React from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { AuthLayout } from 'components';
import ResetPasswordContainer from 'containers/ResetPassword';
import { REDIRECT_STATUS_CODE, ROUTES } from 'constants/routes';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Reset Password">
    <ResetPasswordContainer />
  </AuthLayout>
);

IndexPage.getInitialProps = async (ctx: NextPageContext) => {
  if (!ctx.query.code) {
    if (typeof window === 'undefined' && ctx.res) {
      ctx.res.writeHead(REDIRECT_STATUS_CODE, {
        Location: ROUTES.FORGOT_PASSWORD,
      });
      ctx.res.end();
    } else {
      Router.replace(ROUTES.FORGOT_PASSWORD);
    }
  }
  return {};
};

export default IndexPage;
