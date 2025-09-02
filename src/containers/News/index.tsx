import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, Box, Typography } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NewsIcon from 'assets/icons/news-icon.svg';
import { ArticleSkeleton } from 'components';
import FeaturedNewsItem from 'containers/Article/FeaturedNewsItem';
import CategoryItem from 'containers/Article/CategoryItem';
import { navigateToNews } from 'utils/tracking';
import HotNewsArticles from './HotNewsArticles';
import HotNewsCategories from './HotNewsCategories';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
    },
    loadMoreBtn: {
      marginBottom: theme.spacing(1.5),
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  })
);

const News: React.FC = () => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const newsData = useSelector((state) => state.news.data);
  const allCategories = useSelector((state) => state.news.allCategories);
  const isLoading = useSelector((state) => state.news.isLoading);
  const allArticles = newsData?.articles || [];
  const featuredArticles = allArticles.slice(0, 5);

  console.log({ allArticles });
  useEffect(() => {
    navigateToNews();
  }, []);

  return (
    <Grid container spacing={isMobile ? 0 : 2}>
      <Grid item xs={12} sm={12} md={8}>
        <Paper elevation={0} style={{ paddingBottom: 24 }}>
          <Box display="flex" flexDirection="row" alignItems="center" mb={1.5}>
            <Box
              width={30}
              height={30}
              borderRadius="50%"
              bgcolor="primary.main"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mr={3 / 4}
            >
              <NewsIcon />
            </Box>
            <Typography
              variant="h5"
              color="textSecondary"
              classes={{ root: classes.pageTitle }}
            >
              Tin Mới Nhất
            </Typography>
          </Box>
          <Grid container spacing={1}>
            {featuredArticles[0] && (
              <Grid item xs={12} sm={6}>
                <FeaturedNewsItem
                  size={isMobile ? 'small' : 'medium'}
                  article={featuredArticles[0]}
                />
              </Grid>
            )}
            {featuredArticles[1] && (
              <Grid item xs={12} sm={6}>
                <FeaturedNewsItem
                  size={isMobile ? 'small' : 'medium'}
                  article={featuredArticles[1]}
                />
              </Grid>
            )}
            {featuredArticles[2] && (
              <Grid item xs={12} sm={4}>
                <FeaturedNewsItem size="small" article={featuredArticles[2]} />
              </Grid>
            )}
            {featuredArticles[3] && (
              <Grid item xs={12} sm={4}>
                <FeaturedNewsItem size="small" article={featuredArticles[3]} />
              </Grid>
            )}
            {featuredArticles[4] && (
              <Grid item xs={12} sm={4}>
                <FeaturedNewsItem size="small" article={featuredArticles[4]} />
              </Grid>
            )}
          </Grid>
          <Box
            color="text.secondary"
            fontWeight="fontWeightBold"
            fontSize="h5.fontSize"
            pt={2.5}
            pb={1.5}
          >
            Chuyên Mục
          </Box>
          {allCategories?.map((category) => (
            <CategoryItem
              key={category.id}
              size={isMobile ? 'small' : 'medium'}
              category={category}
            />
          ))}
          {isLoading && (
            <ArticleSkeleton size={isMobile ? 'small' : 'medium'} />
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Paper elevation={0}>
          <HotNewsArticles />
          <HotNewsCategories />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default News;
