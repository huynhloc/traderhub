import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import AllHotForumQuestionsContainer from 'containers/Forum/AllHotForumQuestions';
import HotForumQuestionRedux from 'redux/hotForumQuestion';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const HotTopicsPage = () => (
  <Layout title="Traderhub | Forum">
    <AllHotForumQuestionsContainer />
  </Layout>
);

HotTopicsPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  redirectNotFoundPageIfInValidPage(
    '/forum/hot-topics',
    query?.page as string,
    res
  );
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(HotForumQuestionRedux.actions.getQuestions({ page, res }));
};

export default HotTopicsPage;
