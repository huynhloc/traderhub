import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  List,
  ListSubheader,
  ListItem,
  Grid,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Webinar, WebinarGroupByMonth } from 'interfaces';
import { getAllWebinars } from 'api/webinarApis';
import { CircularProgress } from 'components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      position: 'relative',
      margin: '8px 16px',
      overflow: 'auto',
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: theme.typography.fontSize,
      color: theme.palette.text.secondary,
      borderLeft: `10px solid ${theme.palette.primary.main}`,
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 0px 12px #EEEEEE',
      maxHeight: '100%',
    },
    listSection: {
      backgroundColor: 'inherit',
    },
    listHeader: {
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.h6.fontSize,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.common.white,
    },
    listItem: {
      padding: theme.spacing(1),
    },
    disableListItem: {
      opacity: '1 !important',
    },
    ul: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  })
);

type Props = {
  open: boolean;
  onClose: () => void;
  onRegister: (webinar: Webinar) => void;
  registeredWebinars: string[];
};

const WebinarDialog: React.FC<Props> = ({
  open,
  onClose,
  onRegister,
  registeredWebinars,
}) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [webinars, setWebinars] = useState<WebinarGroupByMonth>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAllWebinars = async () => {
    try {
      setIsLoading(true);
      const data = await getAllWebinars();
      setWebinars(data as WebinarGroupByMonth);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (webinar: Webinar) => () => {
    onRegister(webinar);
  };

  useEffect(() => {
    if (open) {
      loadAllWebinars();
    }
  }, [open]);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      fullScreen={isXs}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Lịch trực tuyến Webinar</DialogTitle>
      {isLoading && (
        <Box display="flex" justifyContent="center" mt={4} width={1}>
          <CircularProgress
            size={40}
            style={{
              color: theme.palette.primary.main,
              marginRight: 0,
            }}
          />
        </Box>
      )}
      <List subheader={<li />} className={classes.list}>
        {webinars.map((webinarGroupByMonth) => (
          <li key={webinarGroupByMonth._id} className={classes.listSection}>
            <ul className={classes.ul}>
              <ListSubheader className={classes.listHeader}>
                {`Tháng ${parseInt(webinarGroupByMonth._id.split('/')[1])}`}
              </ListSubheader>
              {webinarGroupByMonth.webinars.map((webinar) => (
                <ListItem
                  key={webinar.id}
                  button
                  onClick={handleClick(webinar)}
                  disabled={registeredWebinars.indexOf(webinar.id) >= 0}
                  classes={{
                    root: classes.listItem,
                    disabled: classes.disableListItem,
                  }}
                >
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={3} md={2}>
                      {moment(webinar.date).format('DD/MM/YYYY')}
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                      {`${webinar.fromTime.substring(
                        0,
                        5
                      )} - ${webinar.toTime.substring(0, 5)}`}
                    </Grid>
                    <Grid item xs={12} sm={5} md={8}>
                      <Box
                        color="common.white"
                        bgcolor="primary.main"
                        borderRadius={24}
                        py={0.5}
                        px={0.75}
                      >
                        {webinar.event}
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </ul>
          </li>
        ))}
      </List>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WebinarDialog;
