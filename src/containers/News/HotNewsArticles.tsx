import React from 'react';
import { useSelector } from 'react-redux';
import { ArticleSkeleton } from 'components';
import TopArticles from '../Article/TopArticles';

const HotNewsArticles: React.FC = () => {
  const articles = useSelector((state) =>
    state.hotNewsArticle.data?.articles?.slice(0, 5)
  );
  return !articles ? (
    <ArticleSkeleton />
  ) : (
    <TopArticles
      title="Bài viết được quan tâm"
      articles={articles}
      buttonLink="/news/hot-articles"
    />
  );
};

export default HotNewsArticles;
