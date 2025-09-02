import React from 'react';
import { useRouter } from 'next/router';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import { Box, Typography, Button } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArticleCategory } from 'interfaces';
import CategoryItem from './CategoryItem';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    showMoreBtn: {
      borderRadius: 18,
      marginTop: theme.spacing(1),
    },
  })
);

type Props = {
  title: string;
  categories: ArticleCategory[];
  buttonLink: string;
};

const TopArticleCategories: React.FC<Props> = ({
  title,
  categories,
  buttonLink,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Box pb={2} display="flex" flexDirection="column" alignItems="center">
      <Box mb={1.5} width={1}>
        <Typography variant="h5" color="textSecondary">
          {title}
        </Typography>
      </Box>
      {categories?.map((category) => (
        <CategoryItem
          key={category.id || category._id}
          size={isXs || isMd ? 'small' : 'medium'}
          category={category}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        classes={{
          root: classes.showMoreBtn,
        }}
        onClick={async () => router.push(buttonLink)}
      >
        Xem tất cả
      </Button>
    </Box>
  );
};

export default TopArticleCategories;
