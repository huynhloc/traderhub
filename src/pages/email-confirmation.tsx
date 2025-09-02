import React from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { AuthLayout } from 'components';
import EmailConfirmationContainer from 'containers/EmailConfirmation';
import { REDIRECT_STATUS_CODE, ROUTES } from 'constants/routes';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Xác Nhận Email">
    <EmailConfirmationContainer />
  </AuthLayout>
);

IndexPage.getInitialProps = async (ctx: NextPageContext) => {
  if (!ctx.query.email) {
    if (typeof window === 'undefined' && ctx.res) {
      ctx.res.writeHead(REDIRECT_STATUS_CODE, {
        Location: ROUTES.LOGIN,
      });
      ctx.res.end();
    } else {
      Router.replace(ROUTES.LOGIN);
    }
  }
  return {};
};

export default IndexPage;
