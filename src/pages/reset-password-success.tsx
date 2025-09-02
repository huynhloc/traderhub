import React from 'react';
import { AuthLayout } from 'components';
import ResetPasswordSuccessContainer from 'containers/ResetPasswordSuccess';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Reset Password Success">
    <ResetPasswordSuccessContainer />
  </AuthLayout>
);

export default IndexPage;
