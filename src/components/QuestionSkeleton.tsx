import React from 'react';
import { Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTheme } from '@material-ui/core/styles';
import { TBox } from 'components';

const QuestionSkeleton: React.FC = () => {
  const theme = useTheme();
  return (
    <TBox>
      <Box display="flex" justifyContent="space-between" mb={1.5}>
        <Box display="flex" width="80%" alignItems="center">
          <Skeleton
            animation="wave"
            variant="circle"
            width={46}
            height={46}
            style={{
              marginRight: theme.spacing(0.75),
              backgroundColor: theme.palette.background.default,
            }}
          />
          <Box display="block" width="80%">
            <Skeleton
              animation="wave"
              height={10}
              width="30%"
              style={{
                marginBottom: theme.spacing(0.5),
                backgroundColor: theme.palette.background.default,
              }}
            />
            <Skeleton
              animation="wave"
              height={10}
              width="20%"
              style={{
                backgroundColor: theme.palette.background.default,
              }}
            />
          </Box>
        </Box>
        <Skeleton
          animation="wave"
          height={10}
          width="10%"
          style={{
            backgroundColor: theme.palette.background.default,
          }}
        />
      </Box>
      <Skeleton
        animation="wave"
        height={10}
        width="100%"
        style={{
          marginBottom: theme.spacing(0.5),
          backgroundColor: theme.palette.background.default,
        }}
      />
      <Skeleton
        animation="wave"
        height={10}
        width="100%"
        style={{
          marginBottom: theme.spacing(0.5),
          backgroundColor: theme.palette.background.default,
        }}
      />
    </TBox>
  );
};

export default QuestionSkeleton;
