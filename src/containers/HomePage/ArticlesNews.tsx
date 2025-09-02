import React from 'react';
import { Grid, Box } from '@material-ui/core';
import NewItem from '../Article/NewsItem';
import { Article } from 'interfaces';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

type Props = {
  isMobile: boolean;
  articles: Article[];
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    boxNewsItem: {
      paddingRight: theme.spacing(1.5),
    },
    boxItem: {
      marginBottom: theme.spacing(1.8),
    },
  })
);

const ArticleNews: React.FC<Props> = ({ articles, isMobile }) => {
  const classes = useStyles();
  const allArticlesNews = articles.slice(0, 6) || [];
  return (
    <Grid item xs={12} sm={7}>
      <Box className={isMobile ? '' : classes.boxNewsItem}>
        {allArticlesNews.map((article) => (
          <Box className={classes.boxItem} key={article.id}>
            <NewItem size={isMobile ? 'small' : 'medium'} article={article} />
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export default ArticleNews;
