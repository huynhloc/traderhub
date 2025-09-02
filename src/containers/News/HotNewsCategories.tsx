import React from 'react';
import { useSelector } from 'react-redux';
import { ArticleSkeleton } from 'components';
import TopArticleCategories from '../Article/TopArticleCategories';

const HotNewsCategories: React.FC = () => {
  const categories = useSelector((state) =>
    state.hotNewsCategory.data?.slice(0, 5)
  );
  return !categories ? (
    <ArticleSkeleton />
  ) : (
    <TopArticleCategories
      title="Chuyên mục được quan tâm"
      categories={categories}
      buttonLink="/news/hot-categories"
    />
  );
};

export default HotNewsCategories;
