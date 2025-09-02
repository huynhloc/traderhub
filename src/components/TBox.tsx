import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core/styles';

const TBox: React.FC<BoxProps> = ({ children, ...props }) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Box
      border={1}
      borderRadius={16}
      borderColor="grey.100"
      bgcolor="common.white"
      boxShadow={2}
      p={isMobile ? 0.75 : 1}
      mb={isMobile ? 1 : 2}
      {...props}
    >
      {children}
    </Box>
  );
};

export default TBox;
