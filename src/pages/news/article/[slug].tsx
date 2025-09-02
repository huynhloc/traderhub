import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import ArticleDetailContainer from 'containers/Article';
import ArticleRedux from 'redux/article';
import { ARTICLE_TYPE } from 'constants/app';

const ArticlePage = () => (
  <Layout title="Traderhub | Tin Tức">
    <ArticleDetailContainer />
  </Layout>
);

ArticlePage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  store.dispatch(
    ArticleRedux.actions.getArticle({
      slug: query?.slug as string,
      res,
      type: ARTICLE_TYPE.NEWS,
    })
  );
};

export default ArticlePage;
