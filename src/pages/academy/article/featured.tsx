import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import FeaturedArticlesContainer from 'containers/Academy/FeaturedArticles';
import { getFeaturedArticlesApi } from 'api/articleApis';
import { Article } from 'interfaces';
import { ARTICLE_TYPE } from 'constants/app';
import {
  redirectNotFoundPageIfInValidPage,
  redirectNotFoundPageIfExccedRange,
} from 'utils';

const FeaturedArticlesPage = ({
  articles,
  totalArticle,
}: {
  articles: Article[];
  totalArticle: number;
}) => (
  <Layout title="Traderhub | Tài liệu nổi bật">
    <FeaturedArticlesContainer
      articles={articles}
      totalArticle={totalArticle}
    />
  </Layout>
);

FeaturedArticlesPage.getInitialProps = async ({
  query,
  res,
}: NextPageContext) => {
  redirectNotFoundPageIfInValidPage(
    '/academy/article/featured',
    query?.page as string,
    res
  );
  const page = parseInt(query?.page as string) || 1;
  const { articles, totalArticle } = await getFeaturedArticlesApi(
    page,
    ARTICLE_TYPE.ACADEMY
  );
  redirectNotFoundPageIfExccedRange(page, totalArticle, res);
  return { articles, totalArticle };
};

export default FeaturedArticlesPage;
