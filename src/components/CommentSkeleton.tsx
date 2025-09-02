import React from 'react';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTheme } from '@material-ui/core/styles';

const CommentSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <Box display="flex" flexDirection="row" mb={1.5}>
      <Skeleton
        animation="wave"
        variant="circle"
        width={46}
        height={46}
        style={{
          marginRight: theme.spacing(1),
          backgroundColor: theme.palette.background.default,
        }}
      />
      <Box flex={1}>
        <Skeleton
          variant="rect"
          animation="wave"
          height={70}
          width="100%"
          style={{
            borderRadius: '0px 8px 8px 8px',
            backgroundColor: theme.palette.background.default,
          }}
        />
      </Box>
    </Box>
  );
};

export default CommentSkeleton;
