import React from 'react';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
} from '@material-ui/core';
import { Webinar } from 'interfaces';

type ItemSize = 'small' | 'medium';

type StyleProps = {
  size?: ItemSize;
};

const useStyles = makeStyles<Theme, StyleProps>((theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      borderRadius: ({ size }) => (size === 'medium' ? '16px' : '8px'),
      backgroundColor: theme.palette.common.white,
    },
    container: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    media: {
      height: ({ size }) => (size === 'medium' ? '250px' : '150px'),
    },
    content: {
      flex: 1,
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1.5) : theme.spacing(1),
    },
    title: {
      color: theme.palette.text.secondary,
      fontWeight: theme.typography.h5.fontWeight,
      fontSize: ({ size }) => (size === 'medium' ? '22px' : '18px'),
      marginBottom: ({ size }) =>
        size === 'medium' ? theme.spacing(1) : theme.spacing(0.5),
    },
    description: {
      color: theme.palette.text.secondary,
      fontSize: ({ size }) =>
        size === 'medium'
          ? theme.typography.body2.fontSize
          : theme.typography.caption.fontSize,
    },
    footer: {
      padding: ({ size }) =>
        size === 'medium' ? theme.spacing(1.5) : theme.spacing(1),
      paddingTop: '0 !important',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: theme.typography.fontFamily,
      fontSize: ({ size }) =>
        size === 'medium'
          ? theme.typography.body2.fontSize
          : theme.typography.caption.fontSize,
    },
  })
);

type Props = {
  onRegister: (webinar: Webinar) => void;
  webinar: Webinar;
  size?: ItemSize;
  registered?: boolean;
};

const WebinarItem: React.FC<Props> = ({
  size = 'medium',
  webinar,
  onRegister,
  registered,
}) => {
  const classes = useStyles({ size });
  const handleClick = async () => {
    onRegister(webinar);
  };
  return (
    <Card className={`${classes.root} ${classes.container}`} elevation={2}>
      <CardMedia
        className={classes.media}
        component="img"
        src={webinar.thumbnail?.formats?.small?.url || webinar.thumbnail?.url}
        alt={webinar.event}
      />
      <CardContent className={classes.content}>
        <Typography className={classes.title}>{webinar.event}</Typography>
        <Typography className={classes.description}>
          {webinar.description}
        </Typography>
      </CardContent>
      <CardActions className={classes.footer}>
        <Box component="span" color="text.hint" fontWeight="fontWeightMedium">
          {`${moment(webinar.date).format(
            'DD/MM/YYYY'
          )} ${webinar.fromTime.substring(0, 5)} - ${webinar.toTime.substring(
            0,
            5
          )}`}
        </Box>
        <Button
          disabled={registered}
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClick}
        >
          {!registered ? 'Đăng Ký' : 'Đã đăng ký'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default WebinarItem;
