import React from 'react';
import Link from 'next/link';
import { Box, Typography } from '@material-ui/core';
// import randomColor from 'randomcolor';
import { Tag } from 'interfaces';
import { TBox } from 'components';

export const fontSizeConverter = (
  count: number,
  min: number,
  max: number,
  minSize: number,
  maxSize: number
) => {
  if (max - min === 0) {
    // handle devision by zero
    return Math.round((minSize + maxSize) / 2);
  }
  return Math.round(
    ((count - min) * (maxSize - minSize)) / (max - min) + minSize
  );
};

type Props = {
  tags?: Tag[];
};

const TagCloudComponent: React.FC<Props> = React.memo(({ tags = [] }) => {
  const counts = tags.map((tag) => tag.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  return tags?.length > 0 ? (
    <Box pb={2} display="flex" flexDirection="column" alignItems="center">
      <Box mb={1.5} width={1}>
        <Typography variant="h5" component="h1" color="textSecondary">
          TagCloud
        </Typography>
      </Box>
      <TBox mb={1} width={1}>
        {tags.map((tag: Tag, index: number) => (
          <Link href={`/forum/hashtag/${tag.key}`} key={`${tag.key}_${index}`}>
            <a>
              <span
                style={{
                  animation: 'blinker 3s linear infinite',
                  animationDelay: `${Math.random() * 2}s`,
                  fontSize: `${fontSizeConverter(tag.count, min, max, 1, 20) + 10
                    }px`,
                  margin: '6px',
                  padding: '3px',
                  verticalAlign: 'middle',
                  // color: randomColor({
                  //   luminosity: 'dark',
                  // }),
                }}
              >
                {tag.value}
              </span>
            </a>
          </Link>
        ))}
      </TBox>
    </Box>
  ) : null;
});

export default TagCloudComponent;
