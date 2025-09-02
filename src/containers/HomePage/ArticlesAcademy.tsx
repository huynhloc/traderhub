import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FeaturedNewsItem from 'containers/Article/FeaturedNewsItem';

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    imageBanner: {
      marginTop: theme.spacing(1.8),
    },
  })
);

type Props = {
  isMobile: boolean;
};

const ArticlesAcademy: React.FC<Props> = ({ isMobile }) => {
  const classes = useStyles();
  const academyData = useSelector((state) => state.academy.data);
  const allArticlesAcademy = academyData?.articles || [];
  return (
    <Grid item xs={12} sm={5}>
      <Grid container spacing={1}>
        {allArticlesAcademy.slice(0, 4).map((academy) => (
          <Grid key={`allArticlesAcademy-${academy.id}`} item xs={12} sm={6}>
            <FeaturedNewsItem size="small" article={academy} />
          </Grid>
        ))}
      </Grid>
      <Grid xs={12} sm={12} className={classes.imageBanner}>
        <Link href="/forum">
          <a>
            <Image
              layout="responsive"
              width={322}
              height={!isMobile ? 190 : 210}
              quality={100}
              src="https://s3.ap-southeast-1.amazonaws.com/files.gigantecmedia.com/ForumTradehub/ads_banner_f26ad06ee1.jpg"
              alt="ads-banner"
            />
          </a>
        </Link>
      </Grid>
    </Grid>
  );
};

export default ArticlesAcademy;
