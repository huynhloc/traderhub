import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import NewsContainer from 'containers/News';
import NewsRedux from 'redux/news';
import HotNewsArticleRedux from 'redux/hotNewsArticle';
import HotNewsCategoryRedux from 'redux/hotNewsCategory';

const Page = () => (
  <Layout title="Tin tức thị trường tài chính, chứng khoán, Forex, tiền tệ Việt Nam & thế giới | TraderHub">
    <NewsContainer />
  </Layout>
);

Page.getInitialProps = async ({ store, res }: NextPageContext) => {
  store.dispatch(HotNewsArticleRedux.actions.getArticles({ page: 1, res }));
  store.dispatch(HotNewsCategoryRedux.actions.getArticleCategories());
  store.dispatch(NewsRedux.actions.getNewsCategories());
  store.dispatch(NewsRedux.actions.getNewsData());
};

export default Page;
