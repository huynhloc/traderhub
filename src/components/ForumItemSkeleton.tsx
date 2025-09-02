import React from 'react';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTheme } from '@material-ui/core/styles';
import TBox from './TBox';

const ForumItemSkeleton: React.FC<{ showAvatar?: boolean }> = ({
  showAvatar = false,
}) => {
  const theme = useTheme();
  return (
    <TBox mb={1} display="flex" flexDirection="row" width={1}>
      {showAvatar && (
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
      )}
      <Box flex={1}>
        <Skeleton
          variant="text"
          animation="wave"
          height={10}
          width="40%"
          style={{ marginBottom: 10, marginTop: showAvatar ? 8 : 0 }}
        />
        <Skeleton variant="text" animation="wave" height={10} width="50%" />
      </Box>
    </TBox>
  );
};

export default ForumItemSkeleton;
