import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import TopicContainer from 'containers/Forum/Topic';
import ForumTopicRedux from 'redux/forumTopic';
import { redirectNotFoundPageIfInValidPage } from 'utils';

const TopicPage = () => (
  <Layout title="Traderhub | Forum">
    <TopicContainer />
  </Layout>
);

TopicPage.getInitialProps = async ({ store, query, res }: NextPageContext) => {
  redirectNotFoundPageIfInValidPage(
    `/forum/topic/${query?.slug}`,
    query?.page as string,
    res
  );
  const page = parseInt(query?.page as string) || 1;
  store.dispatch(
    ForumTopicRedux.actions.getForumTopic({
      slug: query?.slug as string,
      page,
      res,
    })
  );
};

export default TopicPage;
