import React from 'react';
import { Article } from 'interfaces';

import { useTheme } from '@material-ui/core/styles';
import { Grid, Divider } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ArticlesNews from './ArticlesNews';
import ArticlesAcademy from './ArticlesAcademy';
import CategoryItem from './CategoryItem';
import Title from './Title';
import Carousel from './Carousel';
import ForumTopics from './ForumTopics';
import BannerAdvertisement from './BannerAdvertisement';
import { SEOTags } from 'components';
import FeaturedNewsItem from 'containers/Article/FeaturedNewsItem';

type Props = {
  articles: Article[];
};

type StyleProps = {
  isMobile: boolean;
};

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    borderBottomDivider: {
      marginBottom: theme.spacing(2),
      height: theme.spacing(0.125),
      backgroundColor: theme.palette.primary.main,
    },
    boxBanner: {
      marginTop: ({ isMobile }) => (isMobile ? theme.spacing(1.8) : 0),
    },
    imageBannerDynamic: {
      width: '100%',
    },
  })
);

const HomePage: React.FC<Props> = ({ articles }) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ isMobile });

  const featuredArticles = articles?.slice(0, 4);

  return (
    <>
      <SEOTags
        seoTitle="TraderHub | Kênh thông tin Kinh tế - Tài chính - Chứng khoán Việt Nam"
        seoDescription="TraderHub là nơi giao lưu, chia sẻ kiến thức kinh tế, tài chính, vàng, CFDs, forex, tiền điện tử, chứng khoán quốc tế và chứng khoán phái sinh."
      />
      <Grid container>
        <Carousel size={isMobile ? 'small' : 'medium'} />
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <Title title=" Tin Tức Nổi Bật" spacingTop={0.5} />
          <Divider className={classes.borderBottomDivider} />
          <Grid container spacing={2}>
            <Grid item md={3}>
              <FeaturedNewsItem
                size={isMobile ? 'small' : 'medium'}
                article={featuredArticles[0]}
              />
            </Grid>
            <Grid item md={3}>
              <FeaturedNewsItem
                size={isMobile ? 'small' : 'medium'}
                article={featuredArticles[1]}
              />
            </Grid>
            <Grid item md={3}>
              <FeaturedNewsItem
                size={isMobile ? 'small' : 'medium'}
                article={featuredArticles[2]}
              />
            </Grid>
            <Grid item md={3}>
              <FeaturedNewsItem
                size={isMobile ? 'small' : 'medium'}
                article={featuredArticles[3]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <BannerAdvertisement
            href="https://lophocdautu.asxlophocdatu.club"
            imageUrl="https://s3.ap-southeast-1.amazonaws.com/files.gigantecmedia.com/ForumTradehub/home_banner_8b13ea032c.jpg"
            altImage="banner-trading"
            isMobile={isMobile}
          />
        </Grid>
      </Grid>
      <Grid container spacing={isMobile ? 0 : 2}>
        <CategoryItem isMobile={isMobile} />
        <Grid item xs={12} sm={12}>
          <BannerAdvertisement
            href="/"
            imageUrl="https://vtradebucket.s3.ap-southeast-1.amazonaws.com/banner_Dk-Trade.jpg"
            altImage="banner-trading"
            isMobile={isMobile}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12}>
          <Title title=" Tin Tức Hot Nhất" />
          <Divider className={classes.borderBottomDivider} />

          <Grid container spacing={1}>
            <ArticlesNews articles={articles?.slice(4)} isMobile={isMobile} />
            <ArticlesAcademy isMobile={isMobile} />
          </Grid>

          <Title title=" Chủ đề mới nhất" />
          <Divider className={classes.borderBottomDivider} />

          <Grid container spacing={1}>
            <ForumTopics />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default HomePage;
