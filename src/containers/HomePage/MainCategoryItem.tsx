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

type ItemSize = 'small' | 'medium';

type PropsItem = {
  slug: string;
  imageUrl: string | undefined;
  title: string;
  description: string;
};

type StyleProps = {
  size?: ItemSize;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      borderRadius: ({ size }) => (size === 'medium' ? '16px' : '8px'),
      backgroundColor: theme.palette.common.white,
    },
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    mediaContainer: {
      position: 'relative',
      width: '100%',
      paddingTop: ({ size }) => (size === 'medium' ? '40%' : '20%'),
    },
    media: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50% , -50%)',
      width: ({ size }) => (size === 'medium' ? '25%' : '10%'),
    },
    content: {
      flex: 1,
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1.5) : theme.spacing(1),
    },
    title: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.h5.fontWeight,
      textAlign: 'center',
      fontSize: ({ size }) => (size === 'medium' ? '22px' : '18px'),
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    description: {
      color: theme.palette.text.secondary,
      textAlign: 'center',
      fontSize: ({ size }) =>
        size === 'medium'
          ? theme.typography.body2.fontSize
          : theme.typography.caption.fontSize,
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
  size?: ItemSize;
  propsItem: PropsItem;
};

const MainCategoryItem: React.FC<Props> = ({ size, propsItem }) => {
  const classes = useStyles({ size });
  return (
    <Card className={classes.root} elevation={2}>
      <Link href={`/${propsItem.slug}`}>
        <a>
          <CardActionArea className={classes.container}>
            <div className={classes.mediaContainer}>
              <CardMedia
                className={classes.media}
                component="img"
                src={propsItem.imageUrl}
                alt="111"
              />
            </div>
            <CardContent className={classes.content}>
              <Typography className={`${classes.title} truncate truncate--2`}>
                {propsItem.title}
              </Typography>
              <Typography className={`${classes.description}`}>
                {propsItem.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </a>
      </Link>
    </Card>
  );
};

export default MainCategoryItem;
