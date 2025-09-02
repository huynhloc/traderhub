import React from 'react';
import { Theme, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Article } from 'interfaces';
import RelatedNewsItem from './RelatedNewsItem';
import Carousel from 'react-elastic-carousel';

type Props = {
  articles: Article[];
  setCarousel: (ref: Carousel) => void;
};

const CarouselItems: React.FC<Props> = ({ articles, setCarousel }) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 450, itemsToShow: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 960, itemsToShow: 4 },
  ];
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Carousel
      showEmptySlots
      ref={setCarousel}
      breakPoints={breakPoints}
      itemPadding={[isMobile ? 6 : 12, isMobile ? 6 : 12]}
      itemsToShow={3}
      showArrows={false}
      pagination={false}
    >
      {articles.map((article) => (
        <RelatedNewsItem
          key={article.id}
          article={article}
          size={isMobile ? 'small' : 'medium'}
        />
      ))}
    </Carousel>
  );
};

export default CarouselItems;
