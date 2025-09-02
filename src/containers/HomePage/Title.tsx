import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme>(() =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
    },
  })
);

type Props = {
  title: string;
  spacingTop?: number;
};
const Title: React.FC<Props> = ({ title, spacingTop }) => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      mt={spacingTop ? spacingTop : 3.5}
      mb={0.5}
    >
      <Typography
        variant="h5"
        color="textSecondary"
        classes={{ root: classes.pageTitle }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default Title;
