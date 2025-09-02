import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Paper, Box, Typography, useMediaQuery } from '@material-ui/core';
import { ArticleSkeleton, PaginationNextLink, SEOTags } from 'components';
import ChatOutlineIcon from 'assets/icons/chat-outline-icon.svg';
import { PAGE_SIZE } from 'constants/app';
import NewsItem from '../Article/NewsItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
      flex: 1,
    },
    pagination: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: theme.spacing(1),
    },
  })
);

const AllHotNewsArticles: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const page = parseInt(router.query?.page as string) || 1;
  const theme = useTheme<Theme>();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const data = useSelector((state) => state.hotNewsArticle.data);
  const isLoading = useSelector((state) => state.hotNewsArticle.isLoading);

  const pageTitle =
    page === 1
      ? 'Bài viết được quan tâm | TraderHub'
      : `Bài viết được quan tâm | Page ${page} | TraderHub`;

  return (
    <Paper elevation={0}>
      <SEOTags seoTitle={pageTitle} />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" flexDirection="row">
          <Box
            width={30}
            height={30}
            borderRadius="50%"
            bgcolor="primary.main"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mr={3 / 4}
            mt={1 / 6}
          >
            <ChatOutlineIcon />
          </Box>
          <Typography
            component="h1"
            variant="h5"
            color="textSecondary"
            classes={{ root: classes.pageTitle }}
          >
            Bài viết được quan tâm
          </Typography>
        </Box>
      </Box>
      {isLoading && !data && <ArticleSkeleton />}
      {data?.articles?.map((article) => (
        <NewsItem
          key={article.id}
          article={article}
          size={isXs ? 'small' : 'medium'}
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
        count={Math.ceil((data?.totalArticle || 0) / PAGE_SIZE)}
        renderItem={(item) => (
          <PaginationItem
            component={PaginationNextLink}
            rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
            href={`/news/hot-articles${
              item.page === 1 ? '' : `?page=${item.page}`
            }`}
            {...item}
          />
        )}
      />
    </Paper>
  );
};

export default AllHotNewsArticles;
