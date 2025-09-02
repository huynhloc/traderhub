import React from 'react';
import { Layout } from 'components';
import QuestionContainer from 'containers/Forum/Question';
import ForumQuestionRedux from 'redux/forumQuestion';
import HotForumQuestionRedux from 'redux/hotForumQuestion';
import ActiveMemeberRedux from 'redux/activeMember';
import { NextPageContext } from 'next';

const QuestionPage = () => (
  <Layout title="Traderhub | Forum">
    <QuestionContainer />
  </Layout>
);

QuestionPage.getInitialProps = async ({
  store,
  query,
  res,
}: NextPageContext) => {
  store.dispatch(HotForumQuestionRedux.actions.getQuestions({ page: 1, res }));
  store.dispatch(ActiveMemeberRedux.actions.getMembers({ page: 1, res }));
  store.dispatch(
    ForumQuestionRedux.actions.getForumQuestion(query?.slug as string)
  );
};

export default QuestionPage;
