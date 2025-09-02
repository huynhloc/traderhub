import React from 'react';
import { NextPageContext } from 'next';
import { Layout } from 'components';
import HashtagContainer from 'containers/Forum/Hashtag';
import { ForumHashtag, ForumQuestion } from 'interfaces';
import {
  getForumHashtagApi,
  getForumQuestionsByHashtagApi,
} from 'api/forumApis';
import {
  redirectNotFoundPageIfInValidPage,
  redirectNotFoundPage,
  redirectNotFoundPageIfExccedRange,
} from 'utils';

const HashtagPage = ({
  questions,
  totalQuestion,
  hashtag,
}: {
  questions: ForumQuestion[];
  totalQuestion: number;
  hashtag: ForumHashtag;
}) => (
  <Layout title="Traderhub | Forum">
    <HashtagContainer
      questions={questions}
      totalQuestion={totalQuestion}
      hashtag={hashtag}
    />
  </Layout>
);

HashtagPage.getInitialProps = async ({ query, res }: NextPageContext) => {
  try {
    redirectNotFoundPageIfInValidPage(
      `/forum/hashtag/${query?.slug}`,
      query?.page as string,
      res
    );
    const page = parseInt(query?.page as string) || 1;
    const hashtag = await getForumHashtagApi(query?.slug as string);
    const { questions, totalQuestion } = await getForumQuestionsByHashtagApi(
      page,
      hashtag.id
    );
    redirectNotFoundPageIfExccedRange(page, totalQuestion, res);
    return { hashtag, questions, totalQuestion };
  } catch (error) {
    redirectNotFoundPage(res);
  }
};

export default HashtagPage;
