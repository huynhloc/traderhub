import React from 'react';
import { Layout } from 'components';
import ForumContainer from 'containers/Forum';
import ForumRedux from 'redux/forum';
import HotForumQuestionRedux from 'redux/hotForumQuestion';
import ActiveMemeberRedux from 'redux/activeMember';
import { NextPageContext } from 'next';

const Page = () => (
  <Layout
    title="TraderHub | Diễn đàn chứng khoán uy tín hàng đầu Việt Nam"
    description="Traderhub là diễn đàn tài chính hàng đầu để các trader có thể thảo luận về các lĩnh vực đầu tư tài chính như forex, chứng khoán cơ sở, chứng khoán phái sinh, cryptocurrency, hàng hoá,... để tìm ra chiến lược giao dịch thành công cho bản thân."
  >
    <ForumContainer />
  </Layout>
);

Page.getInitialProps = async ({ store, res }: NextPageContext) => {
  store.dispatch(HotForumQuestionRedux.actions.getQuestions({ page: 1, res }));
  store.dispatch(ActiveMemeberRedux.actions.getMembers({ page: 1, res }));
  store.dispatch(ForumRedux.actions.getForumData());
  store.dispatch(ForumRedux.actions.getTopForumHashtags());
};

export default Page;
