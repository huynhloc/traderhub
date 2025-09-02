import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import AllHotNewsCategoriesContainer from 'containers/News/AllHotNewsCategories';
import HotNewsCategoryRedux from 'redux/hotNewsCategory';

const Page = () => (
  <Layout title="Traderhub | Tin Tức">
    <AllHotNewsCategoriesContainer />
  </Layout>
);

Page.getInitialProps = async ({ store }: NextPageContext) => {
  store.dispatch(HotNewsCategoryRedux.actions.getArticleCategories());
};

export default Page;
