import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import CategoryContainer from 'containers/Forum/Category';
import ForumCategoryRedux from 'redux/forumCategory';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const CategoryPage = () => (
  <Layout title="Traderhub | Forum">
    <CategoryContainer />
  </Layout>
);

CategoryPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  const url = `/forum/category/${query?.slug}`;
  redirectNotFoundPageIfInValidPage(url, query?.page as string, res);
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(
    ForumCategoryRedux.actions.getForumCategory({
      slug: query?.slug as string,
      page,
      res,
    })
  );
};

export default CategoryPage;
