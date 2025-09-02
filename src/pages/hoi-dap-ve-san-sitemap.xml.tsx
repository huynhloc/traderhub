// import React from 'react';
import { NextPageContext } from 'next';
import { generateSitemap } from 'utils';
import { getForumQuestionSlugsByTopicApi } from 'api/forumApis';

const Sitemp = () => null;

export const getServerSideProps = async ({ res }: NextPageContext) => {
  const topicSlug = 'Hoi-Dap-Ve-San';

  const slugs = await getForumQuestionSlugsByTopicApi(topicSlug);

  const sitemap = generateSitemap(slugs);

  res?.setHeader('Content-Type', 'text/xml');
  res?.write(sitemap);
  res?.end();

  return {
    props: {},
  };
};

export default Sitemp;
