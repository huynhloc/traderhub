// import React from 'react';
import { NextPageContext } from 'next';
import { ARTICLE_TYPE } from 'constants/app';
import { getArticleSlugsByCategoryApi } from 'api/articleApis';
import { generateSitemap } from 'utils';

const Sitemp = () => null;

export const getServerSideProps = async ({ res }: NextPageContext) => {
  const categorySlug = 'blog-trading';
  const type = ARTICLE_TYPE.ACADEMY;

  const slugs = await getArticleSlugsByCategoryApi(categorySlug, type);

  const sitemap = generateSitemap(slugs);

  res?.setHeader('Content-Type', 'text/xml');
  res?.write(sitemap);
  res?.end();

  return {
    props: {},
  };
};

export default Sitemp;
