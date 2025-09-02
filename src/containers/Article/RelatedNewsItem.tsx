import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from '@material-ui/core';
import { Article } from 'interfaces';

type ItemSize = 'small' | 'medium';

type StyleProps = {
  size?: ItemSize;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    root: {
      width: '100%',
      borderRadius: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
      // marginRight: ({ size }) =>
      //   size === 'medium' ? theme.spacing(1.5) : theme.spacing(0.75),
      backgroundColor: theme.palette.common.white,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    mediaContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: '75%',
    },
    media: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1.5) : theme.spacing(1),
    },
    title: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.h5.fontWeight,
      fontSize: ({ size }) =>
        size === 'medium'
          ? theme.typography.body1.fontSize
          : theme.typography.fontSize,
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    footer: {
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1.5) : theme.spacing(1),
      paddingTop: '0 !important',
      display: 'flex',
      alignItems: 'center',
      fontFamily: theme.typography.fontFamily,
      fontSize: ({ size }) =>
        size === 'medium'
          ? theme.typography.body2.fontSize
          : theme.typography.caption.fontSize,
    },
  })
);

type Props = {
  article: Article;
  size?: ItemSize;
};

const RelatedNewsItem: React.FC<Props> = ({ size = 'medium', article }) => {
  const classes = useStyles({ size });
  return (
    <Card className={classes.root} elevation={2}>
      <Link href={`/${article.type}/article/${article.slug}`}>
        <a>
          <CardActionArea className={classes.container}>
            <div className={classes.mediaContainer}>
              <CardMedia
                className={classes.media}
                component="img"
                src={article.thumbnail}
                alt={article.seoTitle || article.title}
              />
            </div>
            <CardContent className={classes.content}>
              <Typography className={`${classes.title} truncate truncate--2`}>
                {article.title}
              </Typography>
            </CardContent>
            <CardActions className={classes.footer}>
              <Box component="span" color="text.disabled">
                {moment(article.createdAt).fromNow()}
              </Box>
            </CardActions>
          </CardActionArea>
        </a>
      </Link>
    </Card>
  );
};

export default RelatedNewsItem;
