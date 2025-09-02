import React from 'react';
import HomePageContainer from 'containers/HomePage';
import { Layout } from 'components';
import AcademyRedux from 'redux/academy';
import { Article } from 'interfaces';
import { getNewsDataHomePageApi } from 'api/articleApis';
import ForumRedux from 'redux/forum';
import { NextPageContext } from 'next';

const IndexPage = ({ articles }: { articles: Article[] }) => (
  <Layout
    title="TraderHub | Kênh thông tin Kinh tế - Tài chính - Chứng khoán Việt Nam"
    contentStyles={{ paddingBottom: 0 }}
  >
    <HomePageContainer articles={articles} />
  </Layout>
);

IndexPage.getInitialProps = async ({ store, res }: NextPageContext) => {
  try {
    store.dispatch(AcademyRedux.actions.getAcademyData({ page: 1, res }));
    store.dispatch(ForumRedux.actions.getForumData());
    const { articles } = await getNewsDataHomePageApi();
    return { articles };
  } catch (error) {
    return { articles: [] };
  }
};

export default IndexPage;
