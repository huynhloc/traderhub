import React from 'react';
import { Layout } from 'components';
import AcademyContainer from 'containers/Academy';
import AcademyRedux from 'redux/academy';
import { NextPageContext } from 'next';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const Page = () => (
  <Layout title="Traderhub | Academy">
    <AcademyContainer />
  </Layout>
);

Page.getInitialProps = async ({ store, query, res }: NextPageContext) => {
  redirectNotFoundPageIfInValidPage('/academy', query?.page as string, res);
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(AcademyRedux.actions.getAcademyData({ page, res }));
};

export default Page;
