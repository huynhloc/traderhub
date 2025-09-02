import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { Paper, Box, Typography, useMediaQuery } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';
import HotNewsCategoryRedux from 'redux/hotNewsCategory';
import { ArticleSkeleton, SEOTags } from 'components';
import ChatOutlineIcon from 'assets/icons/chat-outline-icon.svg';
import CategoryItem from '../Article/CategoryItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
      flex: 1,
    },
    categorySumText: {
      marginLeft: '5px',
      marginRight: theme.spacing(1),
      marginBottom: '2px',
      fontWeight: 500,
    },
    categoryIcon: {
      overflow: 'visible',
      width: '58px',
      height: '58px',
    },
  })
);

const AllHotNewsCategories: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme<Theme>();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const categories = useSelector((state) => state.hotNewsCategory.data);
  const isLoading = useSelector((state) => state.hotNewsCategory.isLoading);
  const hasMore = useSelector((state) => state.hotNewsCategory.hasMore);

  const loadMoreCategories = useCallback(() => {
    dispatch(HotNewsCategoryRedux.actions.getArticleCategories());
  }, [categories]);

  return (
    <Paper elevation={0}>
      <SEOTags seoTitle="Chuyên mục được quan tâm | Traderhub" />
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
            Chuyên mục được quan tâm
          </Typography>
        </Box>
      </Box>
      {isLoading && !categories && <ArticleSkeleton />}
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadMoreCategories}
        hasMore={hasMore && !isLoading}
        loader={<ArticleSkeleton key={0} />}
      >
        {categories ? (
          categories.map((category) => (
            <CategoryItem
              key={category.id || category._id}
              category={category}
              size={isXs ? 'small' : 'medium'}
            />
          ))
        ) : (
          <div />
        )}
      </InfiniteScroll>
    </Paper>
  );
};

export default AllHotNewsCategories;
