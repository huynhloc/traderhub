import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import CategoryContainer from 'containers/News/Category';
import HotNewsArticleRedux from 'redux/hotNewsArticle';
import { getArticleCategoryApi, getArticlesApi } from 'api/articleApis';
import { Article, ArticleCategory } from 'interfaces';
import { ARTICLE_TYPE } from 'constants/app';
import {
  redirectNotFoundPageIfInValidPage,
  redirectNotFoundPage,
  redirectNotFoundPageIfExccedRange,
} from 'utils';

const CategoryPage = ({
  articles,
  totalArticle,
  category,
}: {
  articles: Article[];
  totalArticle: number;
  category: ArticleCategory;
}) => (
  <Layout title="Traderhub | Tin Tức">
    <CategoryContainer
      articles={articles}
      totalArticle={totalArticle}
      category={category}
    />
  </Layout>
);

CategoryPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  try {
    redirectNotFoundPageIfInValidPage(
      `/news/category/${query?.slug}`,
      query?.page as string,
      res
    );
    const page = parseInt(query?.page as string) || 1;
    const category = await getArticleCategoryApi(query?.slug as string);
    const { articles, totalArticle } = await getArticlesApi(
      page,
      ARTICLE_TYPE.NEWS,
      category.id
    );
    redirectNotFoundPageIfExccedRange(page, totalArticle, res);
    store.dispatch(HotNewsArticleRedux.actions.getArticles({ page: 1, res }));
    return { articles, totalArticle, category };
  } catch (error) {
    redirectNotFoundPage(res);
  }
};

export default CategoryPage;
