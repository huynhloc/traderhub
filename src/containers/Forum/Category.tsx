/**
 * List topics
 */
import React, { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  TBreadcrumbs,
  ForumItemSkeleton,
  SEOTags,
  TagCloud,
  PaginationNextLink,
} from 'components';
import { Paper, Box, Typography, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { navigateToForumCategory } from 'utils/tracking';
import TopicItem from './TopicItem';
import { PAGE_SIZE } from 'constants/app';

const QuestionFormModal = dynamic(async () => import('./QuestionFormModal'), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbs: {
      marginBottom: theme.spacing(2),
    },
    cateImg: {
      marginTop: '8px',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: theme.spacing(1),
    },
  })
);

const Category: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const page = parseInt(router.query?.page as string) || 1;
  const category = useSelector((state) => state.forumCategory.data);
  const isLoading = useSelector((state) => state.forumCategory.isLoading);
  const breadcrumbs = useMemo(
    () =>
      category
        ? [
            { text: 'Diễn đàn', url: '/forum' },
            { text: category?.name, url: `/forum/category/${category?.slug}` },
          ]
        : [],
    [category]
  );

  useEffect(() => {
    category &&
      navigateToForumCategory({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });
  }, [category]);

  useEffect(() => {
    if ((!category || !category.id) && !isLoading) {
      router.replace('/404');
    }
  }, []);

  const pageTitle =
    page === 1
      ? `${category?.seoTitle || category?.name} | TraderHub`
      : `${category?.seoTitle || category?.name} | Page ${page} | TraderHub`;
  return (
    <Grid container spacing={isMobile ? 0 : 2}>
      <Grid item xs={12} sm={12} md={9}>
        <Paper elevation={0}>
          {category && (
            <SEOTags
              seoTitle={pageTitle}
              seoDescription={category.seoDescription || category.description}
              seoImg={category.seoImg || category.icon?.url}
            />
          )}
          <TBreadcrumbs className={classes.breadcrumbs} links={breadcrumbs} />
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box display="flex" flex={1} alignItems="flex-start">
              {category?.icon?.url && (
                <div className={classes.cateImg}>
                  <Image
                    width={58}
                    height={58}
                    objectFit="contain"
                    quality={100}
                    src={category?.icon.url}
                    alt={category?.seoTitle || category?.name}
                  />
                </div>
              )}
              <Box px={1} flex={1}>
                <Typography variant="h6" component="h1">
                  {category?.name}
                </Typography>
                <Typography variant="body2">{category?.description}</Typography>
              </Box>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <QuestionFormModal forumCategory={category} />
            </Box>
          </Box>
          {isLoading && !category && <ForumItemSkeleton />}
          {category?.forumTopics?.map((topic) => (
            <TopicItem
              topic={topic}
              key={topic.id}
              bgcolor="common.white"
              borderColor="grey.100"
              boxShadow={2}
            />
          ))}
          <Pagination
            variant="outlined"
            shape="rounded"
            color="primary"
            classes={{
              root: classes.pagination,
            }}
            page={page}
            count={Math.ceil((category?.totalTopic || 0) / PAGE_SIZE)}
            renderItem={(item) => (
              <PaginationItem
                component={PaginationNextLink}
                rel={
                  item.page === page ? '' : item.page > page ? 'next' : 'prev'
                }
                href={`/forum/category/${category?.slug}${
                  item.page === 1 ? '' : `?page=${item.page}`
                }`}
                {...item}
              />
            )}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <TagCloud tags={category?.tagcloud} />
      </Grid>
    </Grid>
  );
};

export default Category;
