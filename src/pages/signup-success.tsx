import React from 'react';
import { AuthLayout } from 'components';
import SignupSuccessContainer from 'containers/SignupSuccess';
import withAuth from 'hocs/withAuth';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Signup">
    <SignupSuccessContainer />
  </AuthLayout>
);

export default withAuth(IndexPage);
