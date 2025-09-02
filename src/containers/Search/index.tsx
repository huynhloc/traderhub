/**
 * Searchr result
 */
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { ForumItemSkeleton } from 'components';
import { Paper, Box, Typography } from '@material-ui/core';
import {
  Theme,
  useTheme,
  createStyles,
  makeStyles,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { APP_VERTICAL } from 'constants/app';
import NewsItem from 'containers/Article/NewsItem';
import QuestionItem from 'containers/Forum/QuestionItem';
import SearchBy from './SearchBy';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      fontSize: theme.typography.body1.fontSize,
      color: theme.palette.secondary.main,
      fontWeight: theme.typography.fontWeightBold,
    },
  })
);

const Search: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const overallSearchResult = useSelector((state) => state.search.data);
  const isLoading = useSelector((state) => state.search.isLoading);
  const vertical = router.query.vertical;
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  return !vertical ? (
    <Paper elevation={0}>
      <Box pb={1}>
        <Typography variant="h5" component="h1" color="textSecondary">
          {!isLoading &&
          overallSearchResult &&
          isEmpty(overallSearchResult.forumQuestions) &&
          isEmpty(overallSearchResult.news) &&
          isEmpty(overallSearchResult.academy)
            ? `Không có kết quả tìm kiếm "${router.query.q}"`
            : `Kết quả tìm kiếm "${router.query.q}"`}
        </Typography>
      </Box>
      <Box pb={0.5}>
        <Link
          href={`${router.pathname}?q=${router.query.q}&vertical=${APP_VERTICAL.FORUM}`}
        >
          <a className={classes.link}>{`Diễn Đàn ${
            overallSearchResult?.totalForumQuestion || 0
          } bài`}</a>
        </Link>
      </Box>
      {isLoading && !overallSearchResult && <ForumItemSkeleton />}
      {overallSearchResult?.forumQuestions?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
      <Box pb={0.5} pt={overallSearchResult?.totalForumQuestion ? 2 : 0}>
        <Link
          href={`${router.pathname}?q=${router.query.q}&vertical=${APP_VERTICAL.NEWS}`}
        >
          <a className={classes.link}>{`Tin Tức ${
            overallSearchResult?.totalNews || 0
          } bài`}</a>
        </Link>
      </Box>
      {isLoading && !overallSearchResult && <ForumItemSkeleton />}
      {overallSearchResult?.news?.map((article) => (
        <NewsItem
          key={article.id}
          article={article}
          size={isMobile ? 'small' : 'medium'}
        />
      ))}
      <Box pb={0.5} pt={overallSearchResult?.totalNews ? 2 : 0}>
        <Link
          href={`${router.pathname}?q=${router.query.q}&vertical=${APP_VERTICAL.ACADEMY}`}
        >
          <a className={classes.link}>{`Academy ${
            overallSearchResult?.totalAcademy || 0
          } bài`}</a>
        </Link>
      </Box>
      {isLoading && !overallSearchResult && <ForumItemSkeleton />}
      {overallSearchResult?.academy?.map((article) => (
        <NewsItem
          key={article.id}
          article={article}
          size={isMobile ? 'small' : 'medium'}
        />
      ))}
    </Paper>
  ) : (
    <SearchBy />
  );
};

export default Search;
