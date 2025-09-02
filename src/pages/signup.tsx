import React from 'react';
import { AuthLayout } from 'components';
import SignupContainer from 'containers/Signup';
import withAuth from 'hocs/withAuth';

const IndexPage = () => (
  <AuthLayout title="Traderhub | Signup">
    <SignupContainer />
  </AuthLayout>
);

export default withAuth(IndexPage);
