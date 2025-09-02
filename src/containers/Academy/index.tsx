import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, Box, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NewsIcon from 'assets/icons/news-icon.svg';
import ReactPlayer from 'react-player/lazy';
import { ArticleSkeleton, SEOTags, PaginationNextLink } from 'components';
import FeaturedNewsItem from 'containers/Article/FeaturedNewsItem';
import NewsItem from 'containers/Article/NewsItem';
import TopArticles from 'containers/Article/TopArticles';
import TopWebinars from './TopWebinars';
import { navigateToAcademy } from 'utils/tracking';
import { Webinar } from 'interfaces';
import { PAGE_SIZE } from 'constants/app';

const RegisterWebinarModal = dynamic(
  async () => import('./RegisterWebinarModal'),
  {
    ssr: false,
  }
);

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
    videoContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: '56.25%',
    },
    pagination: {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: theme.spacing(1),
    },
  })
);

const Academy: React.FC = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const page = parseInt(router.query?.page as string) || 1;
  const classes = useStyles();
  const registeredWebinars = useSelector(
    (state) => state.academy.registeredWebinars
  );
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const academyData = useSelector((state) => state.academy.data);
  const isLoading = useSelector((state) => state.academy.isLoading);
  const allArticles = academyData?.articles || [];
  const featuredVideo = academyData?.featuredVideo;
  const topArticles = allArticles.slice(0, featuredVideo ? 3 : 5);
  const restArticles = allArticles.slice(featuredVideo ? 3 : 5);
  const categories = academyData?.categories || [];
  const featuredArticles = academyData.featuredArticles;

  const openRegisterWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setIsOpen(true);
  };

  const closeRegisterWebinar = () => {
    setSelectedWebinar(null);
    setIsOpen(false);
  };

  useEffect(() => {
    navigateToAcademy();
  }, []);

  const pageTitle =
    page === 1 ? 'Academy | TraderHub' : `Academy | Page ${page} | TraderHub`;

  return (
    <React.Fragment>
      <SEOTags seoTitle={pageTitle} />
      <RegisterWebinarModal
        isOpen={isOpen}
        webinar={selectedWebinar as Webinar}
        requestClose={closeRegisterWebinar}
      />
      <Grid container spacing={isMobile ? 0 : 2}>
        <Grid item xs={12} sm={12} md={8}>
          <Paper elevation={0} style={{ paddingBottom: 24 }}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              mb={1.5}
            >
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
                ACADEMY
              </Typography>
            </Box>
            <Grid container spacing={1}>
              {!!featuredVideo && (
                <Grid item xs={12}>
                  <div className={classes.videoContainer}>
                    <ReactPlayer
                      url={featuredVideo}
                      playing
                      controls
                      loop={false}
                      width="100%"
                      height="100%"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                    />
                  </div>
                </Grid>
              )}
              {!!featuredVideo && (
                <React.Fragment>
                  {topArticles[0] && (
                    <Grid item xs={12} sm={4}>
                      <FeaturedNewsItem size="small" article={topArticles[0]} />
                    </Grid>
                  )}
                  {topArticles[1] && (
                    <Grid item xs={12} sm={4}>
                      <FeaturedNewsItem size="small" article={topArticles[1]} />
                    </Grid>
                  )}
                  {topArticles[2] && (
                    <Grid item xs={12} sm={4}>
                      <FeaturedNewsItem size="small" article={topArticles[2]} />
                    </Grid>
                  )}
                </React.Fragment>
              )}
              {!featuredVideo && (
                <React.Fragment>
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
                </React.Fragment>
              )}
            </Grid>
            {!isEmpty(restArticles) && (
              <Box
                color="text.secondary"
                fontWeight="fontWeightBold"
                fontSize="h5.fontSize"
                pt={2.5}
                pb={1.5}
              >
                Tin mới nhất
              </Box>
            )}
            {restArticles.map((article) => (
              <NewsItem
                key={article.id}
                size={isMobile ? 'small' : 'medium'}
                article={article}
              />
            ))}
            {isLoading && (
              <ArticleSkeleton size={isMobile ? 'small' : 'medium'} />
            )}
            <Pagination
              variant="outlined"
              shape="rounded"
              color="primary"
              classes={{
                root: classes.pagination,
              }}
              page={page}
              count={Math.ceil((academyData.totalArticle || 0) / PAGE_SIZE)}
              renderItem={(item) => (
                <PaginationItem
                  component={PaginationNextLink}
                  rel={
                    item.page === page ? '' : item.page > page ? 'next' : 'prev'
                  }
                  href={`/academy${
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
            <TopWebinars
              webinars={academyData.topWebinars || []}
              onRegister={openRegisterWebinar}
              registeredWebinars={registeredWebinars}
            />
            <TopArticles
              title="Tài liệu nổi bật"
              articles={featuredArticles || []}
              buttonLink="/academy/article/featured"
            />
            {categories
              .filter((category) => !isEmpty(category.articles))
              .map((category) => (
                <TopArticles
                  key={category.id}
                  title={category.name}
                  articles={category.articles || []}
                  buttonLink={`/academy/category/${category.slug}`}
                />
              ))}
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Academy;
