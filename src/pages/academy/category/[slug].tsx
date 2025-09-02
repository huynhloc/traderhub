import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import CategoryContainer from 'containers/Academy/Category';
import { getArticleCategoryApi, getArticlesApi } from 'api/articleApis';
import { Article, ArticleCategory } from 'interfaces';
import { ARTICLE_TYPE } from 'constants/app';
import {
  redirectNotFoundPage,
  redirectNotFoundPageIfExccedRange,
  redirectNotFoundPageIfInValidPage,
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
  <Layout title="Traderhub | Academy">
    <CategoryContainer
      articles={articles}
      totalArticle={totalArticle}
      category={category}
    />
  </Layout>
);

CategoryPage.getInitialProps = async ({ query, res }: NextPageContext) => {
  try {
    redirectNotFoundPageIfInValidPage(
      `/academy/category/${query?.slug}`,
      query?.page as string,
      res
    );
    const page = parseInt(query?.page as string) || 1;
    const category = await getArticleCategoryApi(query?.slug as string);
    const { articles, totalArticle } = await getArticlesApi(
      page,
      ARTICLE_TYPE.ACADEMY,
      category.id
    );
    redirectNotFoundPageIfExccedRange(page, totalArticle, res);
    return { articles, totalArticle, category };
  } catch (error) {
    redirectNotFoundPage(res);
  }
};

export default CategoryPage;
