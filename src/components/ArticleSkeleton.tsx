import React from 'react';
import { Box, Card } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTheme } from '@material-ui/core/styles';

const ArticleSkeleton: React.FC<{ size?: string }> = ({ size = 'medium' }) => {
  const theme = useTheme();
  return (
    <Card
      elevation={2}
      style={{
        backgroundColor: theme.palette.common.white,
        display: 'flex',
      }}
    >
      <Skeleton
        animation="wave"
        variant="rect"
        width={size === 'small' ? 100 : 200}
        height={size === 'small' ? 100 : 140}
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      />
      <Box flex={1} p={size === 'small' ? 0.5 : 1.5}>
        <Skeleton
          variant="text"
          animation="wave"
          height={18}
          width="70%"
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          height={18}
          width="100%"
          style={{ marginBottom: size === 'small' ? 16 : 22 }}
        />
        <Skeleton variant="text" animation="wave" height={18} width="30%" />
      </Box>
    </Card>
  );
};

export default ArticleSkeleton;
