import React from 'react';
import { AuthLayout } from 'components';
import LoginContainer from 'containers/Login';
import withAuth from 'hocs/withAuth';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Login">
    <LoginContainer />
  </AuthLayout>
);

export default withAuth(IndexPage);
