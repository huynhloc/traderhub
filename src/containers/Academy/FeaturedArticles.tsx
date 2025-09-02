import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Grid } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { TBreadcrumbs, SEOTags, PaginationNextLink } from 'components';
import { Article } from 'interfaces';
import NewsItem from 'containers/Article/NewsItem';
import FeaturedNewsItem from 'containers/Article/FeaturedNewsItem';
import { PAGE_SIZE } from 'constants/app';

type Props = {
  articles: Article[];
  totalArticle: number;
};

const FeaturedArticles: React.FC<Props> = ({ articles, totalArticle }) => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const page = parseInt(router.query?.page as string) || 1;

  const topArticles = articles.slice(0, 5);
  const restArticles = articles.slice(5);

  const breadcrumbs = useMemo(
    () => [
      {
        text: 'Academy',
        url: '/academy',
      },
      {
        text: 'Tài liệu nổi bật',
        url: '/academy/article/featured',
      },
    ],
    []
  );

  const pageTitle =
    page === 1
      ? 'Tài liệu nổi bật | TraderHub'
      : `Tài liệu nổi bật | Page ${page} | TraderHub`;

  return (
    <React.Fragment>
      <SEOTags seoTitle={pageTitle} />
      <TBreadcrumbs
        style={{ marginBottom: theme.spacing(2) }}
        links={breadcrumbs}
      />
      <Grid container spacing={1} style={{ marginBottom: theme.spacing(1) }}>
        {topArticles[0] && (
          <Grid item xs={12} sm={6}>
            <FeaturedNewsItem
              size={isMobile ? 'small' : 'medium'}
              article={topArticles[0]}
            />
          </Grid>
        )}
        {topArticles[1] && (
          <Grid item xs={12} sm={6}>
            <FeaturedNewsItem
              size={isMobile ? 'small' : 'medium'}
              article={topArticles[1]}
            />
          </Grid>
        )}
        {topArticles[2] && (
          <Grid item xs={12} sm={4}>
            <FeaturedNewsItem size="small" article={topArticles[2]} />
          </Grid>
        )}
        {topArticles[3] && (
          <Grid item xs={12} sm={4}>
            <FeaturedNewsItem size="small" article={topArticles[3]} />
          </Grid>
        )}
        {topArticles[4] && (
          <Grid item xs={12} sm={4}>
            <FeaturedNewsItem size="small" article={topArticles[4]} />
          </Grid>
        )}
      </Grid>
      {restArticles?.map((article) => (
        <NewsItem
          key={article.id}
          article={article}
          size={isMobile ? 'small' : 'medium'}
        />
      ))}
      <Pagination
        variant="outlined"
        shape="rounded"
        color="primary"
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: 16,
        }}
        page={page}
        count={Math.ceil((totalArticle || 0) / PAGE_SIZE)}
        renderItem={(item) => (
          <PaginationItem
            component={PaginationNextLink}
            rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
            href={`/academy/article/featured${
              item.page === 1 ? '' : `?page=${item.page}`
            }`}
            {...item}
          />
        )}
      />
    </React.Fragment>
  );
};

export default FeaturedArticles;
