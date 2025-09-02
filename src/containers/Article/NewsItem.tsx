import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
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
      borderRadius: '8px',
      backgroundColor: theme.palette.common.white,
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    container: {
      width: '100%',
      display: 'flex',
      alignItems: 'stretch',
      borderRadius: '8px',
    },
    media: {
      width: ({ size }) => (size === 'medium' ? '200px' : '100px'),
      height: ({ size }) => (size === 'medium' ? '150px' : '75px'),
    },
    details: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    title: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.h5.fontWeight,
      fontSize: ({ size }) => (size === 'medium' ? '18px' : '14px'),
    },
    description: {
      color: theme.palette.text.secondary,
      fontSize: ({ size }) =>
        size === 'medium' ? theme.typography.body2.fontSize : '12px',
      marginTop: theme.spacing(0.25),
    },
    footer: {
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
  hideDescription?: boolean | undefined;
};

const NewsItem: React.FC<Props> = ({
  size = 'medium',
  hideDescription,
  article,
}) => {
  const classes = useStyles({ size });
  return (
    <Card className={classes.root} elevation={2}>
      <Link href={`/${article.type}/article/${article.slug}`}>
        <a>
          <CardActionArea className={classes.container}>
            <CardMedia
              className={classes.media}
              component="img"
              src={article.thumbnail}
              alt={article.seoTitle || article.title}
            />
            <CardContent className={classes.details}>
              <Typography
                className={`${classes.title} truncate 
                ${hideDescription ? 'truncate--2' : 'truncate--1'}`}
              >
                {article.title}
              </Typography>
              {!hideDescription && (
                <Typography
                  className={`${classes.description} truncate truncate--2`}
                >
                  {article.description}
                </Typography>
              )}
              <div className={classes.footer}>
                <Box
                  component="span"
                  color="text.disabled"
                  whiteSpace="pre-wrap"
                >
                  {moment(article.createdAt).fromNow()}
                </Box>
              </div>
            </CardContent>
          </CardActionArea>
        </a>
      </Link>
    </Card>
  );
};

export default NewsItem;
