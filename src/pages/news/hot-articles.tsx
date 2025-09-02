import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import AllHotNewsArticlesContainer from 'containers/News/AllHotNewsArticles';
import HotNewsArticleRedux from 'redux/hotNewsArticle';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const HotTopicsPage = () => (
  <Layout title="Traderhub | Tin Tức">
    <AllHotNewsArticlesContainer />
  </Layout>
);

HotTopicsPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  redirectNotFoundPageIfInValidPage(
    '/news/hot-articles',
    query?.page as string,
    res
  );
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(HotNewsArticleRedux.actions.getArticles({ page, res }));
};

export default HotTopicsPage;
