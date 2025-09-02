import React from 'react';
import { Grid } from '@material-ui/core';
import MainCategoryItem from './MainCategoryItem';

const listCategoryItems = [
  {
    slug: `forum`,
    imageUrl: '/images/chatting.png',
    title: 'Diễn đàn',
    description:
      'Cùng nhau trao đổi ý kiến, chia sẽ kiến thức với nhiều nội dung khác nhau',
  },
  {
    slug: `news`,
    imageUrl: '/images/newspaper.png',
    title: 'Tin tức',
    description: 'Tin tức nóng hổi mới nhất trong nước và ngoài nước ',
  },
  {
    slug: `academy`,
    imageUrl: '/images/mortarboard.png',
    title: 'Academy',
    description: 'Các khóa đào tào và tài liệu nổi bật kinh tế',
  },
  {
    slug: `calendar`,
    imageUrl: '/images/exchange-rate.png',
    title: 'Lịch kinh tế',
    description: 'Lịch trình công bố các sự kiện kinh tế, tài chính',
  },
];

type Props = {
  isMobile: boolean;
};

const CategoryItem: React.FC<Props> = ({ isMobile }) => {
  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      style={
        isMobile
          ? { marginBottom: '32px', marginTop: '16px' }
          : { marginTop: '16px' }
      }
    >
      <Grid container spacing={1}>
        {listCategoryItems.map((item, idx) => {
          return (
            <Grid key={idx} item xs={12} sm={3}>
              <MainCategoryItem
                size={isMobile ? 'small' : 'medium'}
                propsItem={item}
              />
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default CategoryItem;
