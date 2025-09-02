import React from 'react';
import Link from 'next/link';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
} from '@material-ui/core';
import { ArticleCategory } from 'interfaces';

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
  })
);

type Props = {
  category: ArticleCategory;
  size?: ItemSize;
  hideDescription?: boolean;
};

const CategoryItem: React.FC<Props> = ({
  size = 'medium',
  hideDescription,
  category,
}) => {
  const classes = useStyles({ size });
  return (
    <Card className={classes.root} elevation={2}>
      <Link href={`/${category.type}/category/${category.slug}`}>
        <a>
          <CardActionArea className={classes.container}>
            <CardMedia
              className={classes.media}
              component="img"
              src={
                category.thumbnail?.formats?.thumbnail?.url ||
                category.thumbnail?.url
              }
              alt={category.seoTitle || category.name}
            />
            <CardContent className={classes.details}>
              <Typography
                className={`${classes.title} truncate ${
                  hideDescription ? 'truncate--2' : 'truncate--1'
                }`}
              >
                {category.name}
              </Typography>
              {!hideDescription && (
                <Typography
                  className={`${classes.description} truncate truncate--2`}
                >
                  {category.description}
                </Typography>
              )}
            </CardContent>
          </CardActionArea>
        </a>
      </Link>
    </Card>
  );
};

export default CategoryItem;
