import React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';

const Index: React.FC<CircularProgressProps> = ({ ...props }) => (
  <CircularProgress
    size={20}
    style={{ color: 'white', marginRight: '16px' }}
    {...props}
  />
);

export default Index;
