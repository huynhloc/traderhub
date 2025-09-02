import React from 'react';
import { Layout } from 'components';
import ProfileContainer from 'containers/Profile';
import withAuth from 'hocs/withAuth';

const IndexPage = () => (
  <Layout title="Traderhub | Hồ Sơ">
    <ProfileContainer />
  </Layout>
);

export default withAuth(IndexPage);
