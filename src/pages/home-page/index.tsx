import React from 'react';
import HomePageContainer from 'containers/HomePage';
import { Layout } from 'components';
import AcademyRedux from 'redux/academy';
import { Article } from 'interfaces';
import { getNewsDataHomePageApi } from 'api/articleApis';
import ForumRedux from 'redux/forum';

import { NextPageContext } from 'next';

const Page = ({ articles }: { articles: Article[] }) => {
  return (
    <Layout title="Traderhub | Academy">
      <HomePageContainer articles={articles} />
    </Layout>
  );
};
Page.getInitialProps = async ({ store, res }: NextPageContext) => {
  store.dispatch(AcademyRedux.actions.getAcademyData({ page: 1, res }));
  store.dispatch(ForumRedux.actions.getForumData());
  const articles = await getNewsDataHomePageApi();
  return { articles };
};
export default Page;
