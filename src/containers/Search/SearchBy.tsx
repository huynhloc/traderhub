/**
 * Searchr result
 */
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { ForumItemSkeleton, PaginationNextLink, SEOTags } from 'components';
import { Paper, Box, Typography } from '@material-ui/core';
import QuestionItem from '../Forum/QuestionItem';
import { Article, ForumQuestion } from 'interfaces';
import NewsItem from 'containers/Article/NewsItem';
import { PAGE_SIZE, APP_VERTICAL } from 'constants/app';

const SearchBy: React.FC = () => {
  const router = useRouter();
  const { q, vertical } = router.query;
  const data = useSelector((state) => state.search.data);
  const page = parseInt(router.query?.page as string) || 1;
  const isLoading = useSelector((state) => state.search.isLoading);

  const searchData = useMemo(() => {
    switch (vertical) {
      case APP_VERTICAL.FORUM:
        return {
          posts: data?.forumQuestions,
          totalPost: data?.totalForumQuestion,
        };
      case APP_VERTICAL.NEWS:
        return {
          posts: data?.news,
          totalPost: data?.totalNews,
        };
      case APP_VERTICAL.ACADEMY:
        return {
          posts: data?.academy,
          totalPost: data?.totalAcademy,
        };
      default:
        return {
          posts: [],
          totalPost: 0,
        };
    }
  }, [data, vertical]);

  const pageTitle =
    page === 1 ? 'Search | TraderHub' : `Search | Page ${page} | TraderHub`;

  return (
    <Paper elevation={0}>
      <SEOTags seoTitle={pageTitle} />
      <Box pb={1}>
        <Typography variant="h5" component="h1" color="textSecondary">
          {!isLoading && isEmpty(searchData.posts)
            ? `Không có kết quả tìm kiếm "${router.query.q}"`
            : `Kết quả tìm kiếm "${router.query.q}"`}
        </Typography>
      </Box>
      {isLoading && !searchData.posts && <ForumItemSkeleton showAvatar />}
      {(searchData.posts as unknown[])?.map((post, index) => {
        return router.query.vertical === 'forum' ? (
          <QuestionItem
            key={`search_${index}`}
            question={post as ForumQuestion}
          />
        ) : (
          <NewsItem key={`search_${index}`} article={post as Article} />
        );
      })}
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
        count={Math.ceil((searchData.totalPost || 0) / PAGE_SIZE)}
        renderItem={(item) => (
          <PaginationItem
            component={PaginationNextLink}
            rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
            href={`/search?q=${q}&vertical=${vertical}${
              item.page === 1 ? '' : `&page=${item.page}`
            }`}
            {...item}
          />
        )}
      />
    </Paper>
  );
};

export default SearchBy;
