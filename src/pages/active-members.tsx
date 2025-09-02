import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import AllActiveMembersContainer from 'containers/Forum/AllActiveMembers';
import ActiveMemberRedux from 'redux/activeMember';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const ActiveMembersPage = () => (
  <Layout title="Traderhub | Active Member">
    <AllActiveMembersContainer />
  </Layout>
);

ActiveMembersPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  redirectNotFoundPageIfInValidPage(
    '/active-members',
    query?.page as string,
    res
  );
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(ActiveMemberRedux.actions.getMembers({ page, res }));
};

export default ActiveMembersPage;
