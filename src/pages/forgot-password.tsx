import React from 'react';
import { AuthLayout } from 'components';
import ForgotPasswordContainer from 'containers/ForgotPassword';
import withAuth from 'hocs/withAuth';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Forgotten Password">
    <ForgotPasswordContainer />
  </AuthLayout>
);

export default withAuth(IndexPage);
