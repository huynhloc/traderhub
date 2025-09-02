import React, { useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Grid, Paper } from '@material-ui/core';
import { useTheme, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { PaginationNextLink, SEOTags, TBreadcrumbs } from 'components';
import { Article, ArticleCategory } from 'interfaces';
import NewsItem from 'containers/Article/NewsItem';
import { ARTICLE_TYPE, PAGE_SIZE } from 'constants/app';
import { navigateToNewsCategory } from 'utils/tracking';
import HotNewsArticles from './HotNewsArticles';

type Props = {
  articles: Article[];
  totalArticle: number;
  category: ArticleCategory;
};

const Category: React.FC<Props> = ({ articles, totalArticle, category }) => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const page = parseInt(router.query?.page as string) || 1;

  const breadcrumbs = useMemo(
    () =>
      category
        ? [
            {
              text: 'Tin tức',
              url: '/news',
            },
            {
              text: category?.name,
              url: `/${ARTICLE_TYPE.NEWS}/category/${category?.slug}`,
            },
          ]
        : [],
    [category]
  );

  useEffect(() => {
    category &&
      navigateToNewsCategory({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
  }, [category]);

  const pageTitle =
    page === 1
      ? `${category?.seoTitle || category?.name} | TraderHub`
      : `${category?.seoTitle || category?.name} | Page ${page} | TraderHub`;

  return (
    <React.Fragment>
      {category && (
        <SEOTags
          seoTitle={pageTitle}
          seoDescription={category.seoDescription || category.description}
          seoImg={category.seoImg || category.thumbnail?.url}
        />
      )}
      <Grid container spacing={isMobile ? 0 : 2}>
        <Grid item xs={12} sm={12} md={8}>
          <Paper elevation={0} style={{ paddingBottom: 24 }}>
            <TBreadcrumbs
              style={{ marginBottom: theme.spacing(2) }}
              links={breadcrumbs}
            />
            {articles?.map((article) => (
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
                  rel={
                    item.page === page ? '' : item.page > page ? 'next' : 'prev'
                  }
                  href={`/news/category/${category?.slug}${
                    item.page === 1 ? '' : `?page=${item.page}`
                  }`}
                  {...item}
                />
              )}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Paper elevation={0}>
            <HotNewsArticles />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Category;
