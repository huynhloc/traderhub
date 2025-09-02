import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Paper, Box, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { ForumItemSkeleton, SEOTags, PaginationNextLink } from 'components';
import ChatOutlineIcon from 'assets/icons/chat-outline-icon.svg';
import { PAGE_SIZE } from 'constants/app';
import QuestionItem from './QuestionItem';

const QuestionFormModal = dynamic(async () => import('./QuestionFormModal'), {
  ssr: false,
});

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

const AllHotForumQuestions: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const page = parseInt(router.query?.page as string) || 1;
  const data = useSelector((state) => state.hotForumQuestion.data);
  const isLoading = useSelector((state) => state.hotForumQuestion.isLoading);

  const pageTitle =
    page === 1
      ? 'Chủ đề hot nhất | TraderHub'
      : `Chủ đề hot nhất | Page ${page} | TraderHub`;

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
            Chủ đề hot nhất
          </Typography>
        </Box>
        <Box display="flex" flexDirection="row" alignItems="center">
          <QuestionFormModal />
        </Box>
      </Box>
      {isLoading && !data && <ForumItemSkeleton showAvatar />}
      {data?.questions?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
      <Pagination
        variant="outlined"
        shape="rounded"
        color="primary"
        classes={{
          root: classes.pagination,
        }}
        page={page}
        count={Math.ceil((data?.totalQuestion || 0) / PAGE_SIZE)}
        renderItem={(item) => (
          <PaginationItem
            component={PaginationNextLink}
            rel={item.page === page ? '' : item.page > page ? 'next' : 'prev'}
            href={`/forum/hot-topics${
              item.page === 1 ? '' : `?page=${item.page}`
            }`}
            {...item}
          />
        )}
      />
    </Paper>
  );
};

export default AllHotForumQuestions;
