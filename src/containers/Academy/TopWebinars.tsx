import React, { useState } from 'react';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  List,
  ListItem,
} from '@material-ui/core';
import { Webinar } from 'interfaces';
import WebinarGroupByMonth from './WebinarGroupByMonth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    webinarContainer: {
      width: '100%',
      borderRadius: '8px',
      backgroundColor: theme.palette.common.white,
    },
    webinarList: {
      padding: 0,
    },
    webinar: {
      display: 'flex',
      flexDirection: 'column',
      padding: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.hint,
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
    disabledWebinar: { opacity: '1 !important' },
    showMoreBtn: {
      borderRadius: 18,
      marginTop: theme.spacing(1.5),
    },
  })
);

type Props = {
  webinars: Webinar[];
  onRegister: (webinar: Webinar) => void;
  registeredWebinars: string[];
};

const TopWebinars: React.FC<Props> = ({
  webinars,
  onRegister,
  registeredWebinars,
}) => {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleClick = (webinar: Webinar) => () => {
    onRegister(webinar);
  };
  return (
    <Box
      pb={2}
      width={1}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box mb={1.5} width={1}>
        <Typography variant="h5" color="textSecondary">
          Lịch trực tuyến webinar
        </Typography>
      </Box>
      <Card elevation={2} className={classes.webinarContainer}>
        <List className={classes.webinarList}>
          {webinars.map((webinar) => (
            <ListItem
              button
              onClick={handleClick(webinar)}
              disabled={registeredWebinars.indexOf(webinar.id) >= 0}
              key={webinar.id}
              disableGutters
              classes={{
                root: classes.webinar,
                disabled: classes.disabledWebinar,
              }}
              alignItems="flex-start"
            >
              <div>{moment(webinar.date).format('DD/MM/YYYY')}</div>
              <Box
                fontSize="subtitle1.fontSize"
                fontWeight="fontWeightBold"
                color="text.secondary"
                py={0.5}
              >
                {webinar.event}
              </Box>
              <div>{`${webinar.fromTime.substring(
                0,
                5
              )} - ${webinar.toTime.substring(0, 5)}`}</div>
            </ListItem>
          ))}
        </List>
      </Card>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        classes={{
          root: classes.showMoreBtn,
        }}
        onClick={handleOpenDialog}
      >
        Xem tất cả
      </Button>
      <WebinarGroupByMonth
        open={openDialog}
        onClose={handleCloseDialog}
        onRegister={onRegister}
        registeredWebinars={registeredWebinars}
      />
    </Box>
  );
};

export default TopWebinars;
