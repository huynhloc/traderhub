/**
 * List questions
 */
import React, { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  TBreadcrumbs,
  ForumItemSkeleton,
  SEOTags,
  TagCloud,
  PaginationNextLink,
} from 'components';
import { Paper, Box, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ForumTopic } from 'interfaces';
import { navigateToForumTopic } from 'utils/tracking';
import { PAGE_SIZE } from 'constants/app';
import QuestionItem from './QuestionItem';

const QuestionFormModal = dynamic(async () => import('./QuestionFormModal'), {
  ssr: false,
});

const Topic: React.FC = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const page = parseInt(router.query?.page as string) || 1;
  const topic = useSelector((state) => state.forumTopic.data);
  const isLoading = useSelector((state) => state.forumTopic.isLoading);
  const breadcrumbs = useMemo(
    () =>
      topic
        ? [
            { text: 'Diễn đàn', url: '/forum' },
            {
              text: topic?.forumCategory?.name,
              url: `/forum/category/${topic?.forumCategory?.slug}`,
            },
            { text: topic?.name, url: `/forum/topic/${topic?.slug}` },
          ]
        : [],
    [topic]
  );

  const renderPagination = () => (
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
      count={Math.ceil((topic?.totalQuestion || 0) / PAGE_SIZE)}
      renderItem={(item) => (
        <PaginationItem
          component={PaginationNextLink}
          rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
          href={`/forum/topic/${topic?.slug}${
            item.page === 1 ? '' : `?page=${item.page}`
          }`}
          {...item}
        />
      )}
    />
  );

  useEffect(() => {
    topic &&
      navigateToForumTopic({
        id: topic.id,
        name: topic.name,
        slug: topic.slug,
      });
  }, [topic]);

  useEffect(() => {
    if ((!topic || !topic.id) && !isLoading) {
      router.replace('/404');
    }
  }, []);

  const pageTitle =
    page === 1
      ? `${topic?.seoTitle || topic?.name} | TraderHub`
      : `${topic?.seoTitle || topic?.name} | Page ${page} | TraderHub`;
  return (
    <Grid container spacing={isMobile ? 0 : 2}>
      <Grid item xs={12} sm={12} md={9}>
        <Paper elevation={0}>
          {topic && (
            <SEOTags
              seoTitle={pageTitle}
              seoDescription={topic.seoDescription || topic.description}
              seoImg={topic.seoImg}
            />
          )}
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
            pb={2}
          >
            <Box display="flex" alignItems="center" flex={1}>
              <TBreadcrumbs links={breadcrumbs} />
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <QuestionFormModal forumTopic={topic} />
            </Box>
          </Box>
          {isLoading && !topic && <ForumItemSkeleton showAvatar />}
          {topic?.forumQuestions?.map((question) => (
            <QuestionItem
              key={question.id}
              question={{
                ...question,
                forumTopic: { name: topic.name } as ForumTopic,
              }}
            />
          ))}
          {renderPagination()}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <TagCloud tags={topic?.tagcloud} />
      </Grid>
    </Grid>
  );
};

export default Topic;
