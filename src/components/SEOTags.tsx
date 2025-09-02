import React from 'react';
import Head from 'next/head';
import {
  PAGE_SEO_DESCRIPTION,
  PAGE_SEO_IMG,
  PAGE_SEO_TITLE,
} from 'constants/app';

type Props = {
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
};

const SEOTags: React.FC<Props> = ({ seoTitle, seoDescription, seoImg }) => {
  return (
    <Head>
      <title key="title">{seoTitle || PAGE_SEO_TITLE}</title>
      <meta
        key="ogSiteName"
        property="og:site_name"
        content={seoTitle || PAGE_SEO_TITLE}
      />
      <meta key="twitterCard" name="twitter:card" content="summary" />
      <meta
        key="twitterSite"
        name="twitter:site"
        content={seoTitle || PAGE_SEO_TITLE}
      />
      <meta key="ogType" name="og:type" content="website" />
      <meta
        key="ogTitle"
        property="og:title"
        content={seoTitle || PAGE_SEO_TITLE}
      />
      <meta
        key="twitterTitle"
        name="twitter:title"
        content={seoTitle || PAGE_SEO_TITLE}
      />

      <meta
        key="description"
        name="description"
        content={seoDescription || PAGE_SEO_DESCRIPTION}
      />
      <meta
        key="ogDescription"
        property="og:description"
        content={seoDescription || PAGE_SEO_DESCRIPTION}
      />
      <meta
        key="twitterDescription"
        name="twitter:description"
        content={seoDescription || PAGE_SEO_DESCRIPTION}
      />
      <meta
        key="ogImage"
        property="og:image"
        content={seoImg || PAGE_SEO_IMG}
      />
      <meta
        key="twitterImage"
        name="twitter:image"
        content={seoImg || PAGE_SEO_IMG}
      />
    </Head>
  );
};

export default SEOTags;
