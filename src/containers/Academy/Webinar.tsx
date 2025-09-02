import React, { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import moment, { Moment } from 'moment';
import { Grid, Button, Box, TextField } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Cached from '@material-ui/icons/Cached';
import { useSelector } from 'react-redux';
import { Webinar } from 'interfaces';
import { navigateToWebinar } from 'utils/tracking';
import { ArticleSkeleton, TBreadcrumbs } from 'components';
import { getWebinars } from 'api/webinarApis';
import WebinarItem from './WebinarItem';

const RegisterWebinarModal = dynamic(
  async () => import('./RegisterWebinarModal'),
  {
    ssr: false,
  }
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
    },
    loadMoreBtn: {
      marginBottom: theme.spacing(1.5),
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    searchBar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'stretch',
      },
    },
    datePicker: {
      width: 'auto',
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
        marginBottom: theme.spacing(1),
      },
    },
    searchInput: {
      flex: 1,
    },
  })
);

type Props = {
  webinars: Webinar[];
};

const PAGE_SIZE = 9;

const Webinars: React.FC<Props> = ({ webinars: initWebinars }) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const [queryStr, setQueryStr] = useState('');
  const [fromDate, setFromDate] = useState<Moment | null>(moment());
  const [toDate, setToDate] = useState<Moment | null>(null);
  const [webinars, setWebinars] = useState<Webinar[]>(initWebinars);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initWebinars?.length === PAGE_SIZE);
  const registeredWebinars = useSelector(
    (state) => state.academy.registeredWebinars
  );
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openRegisterWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setIsOpen(true);
  };

  const closeRegisterWebinar = () => {
    setSelectedWebinar(null);
    setIsOpen(false);
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQueryStr(event.target.value);
  };

  useEffect(() => {
    setWebinars(initWebinars);
    setHasMore(initWebinars?.length === PAGE_SIZE);
  }, [initWebinars]);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      // IF THERE'S A RUNNING TIMEOUT
      clearTimeout(timeoutRef.current); // THEN, CANCEL IT
    }
    if ((!fromDate || fromDate?.isValid()) && (!toDate || toDate?.isValid())) {
      timeoutRef.current = setTimeout(search, 500);
    }
  }, [fromDate, toDate, queryStr]);

  useEffect(() => {
    navigateToWebinar({});
  }, []);

  const loadMoreWebinars = async () => {
    try {
      setIsLoading(true);
      const fromDateStr = fromDate ? fromDate.format('YYYY-MM-DD') : undefined;
      const toDateStr = toDate ? toDate.format('YYYY-MM-DD') : undefined;

      const data = await getWebinars(
        webinars.length,
        PAGE_SIZE,
        fromDateStr,
        toDateStr,
        queryStr || undefined
      );
      setHasMore(data.length === PAGE_SIZE);
      setWebinars([...webinars, ...data]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const search = async () => {
    try {
      setIsLoading(true);
      const fromDateStr = fromDate ? fromDate.format('YYYY-MM-DD') : undefined;
      const toDateStr = toDate ? toDate.format('YYYY-MM-DD') : undefined;

      const data = await getWebinars(
        0,
        PAGE_SIZE,
        fromDateStr,
        toDateStr,
        queryStr || undefined
      );
      setHasMore(data.length === PAGE_SIZE);
      setWebinars(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = useMemo(
    () => [
      {
        text: 'Academy',
        url: '/academy',
      },
      {
        text: 'Lịch Sự Kiện',
        url: `/academy/webinar`,
      },
    ],
    []
  );

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <RegisterWebinarModal
        isOpen={isOpen}
        webinar={selectedWebinar as Webinar}
        requestClose={closeRegisterWebinar}
      />
      <TBreadcrumbs
        style={{ marginBottom: theme.spacing(1.5) }}
        links={breadcrumbs}
      />
      <Box mb={1} className={classes.searchBar}>
        <KeyboardDatePicker
          className={classes.datePicker}
          invalidDateMessage="Nhập ngày theo định dạng dd/mm/yyyy"
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Từ Ngày"
          format="DD/MM/yyyy"
          value={fromDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={setFromDate}
        />
        <KeyboardDatePicker
          className={classes.datePicker}
          invalidDateMessage="Nhập ngày theo định dạng dd/mm/yyyy"
          minDate={fromDate && fromDate?.isValid() ? fromDate : undefined}
          minDateMessage={`Hãy nhập ngày lớn hơn hoặc bằng ngày ${fromDate?.format(
            'DD/MM/YYYY'
          )}`}
          autoOk
          variant="inline"
          inputVariant="outlined"
          label="Đến Ngày"
          format="DD/MM/yyyy"
          value={toDate}
          InputAdornmentProps={{ position: 'start' }}
          onChange={setToDate}
        />
        <TextField
          className={classes.searchInput}
          placeholder="Tìm sự kiện ..."
          variant="outlined"
          value={queryStr}
          onChange={handleSearchQueryChange}
        />
      </Box>
      <Grid container spacing={1} style={{ marginBottom: theme.spacing(1) }}>
        {webinars.map((webinar) => (
          <Grid item xs={12} sm={6} md={4} key={webinar.id}>
            <WebinarItem
              registered={registeredWebinars.indexOf(webinar.id) >= 0}
              webinar={webinar}
              size={isMobile ? 'small' : 'medium'}
              onRegister={openRegisterWebinar}
            />
          </Grid>
        ))}
      </Grid>
      {!isLoading && hasMore && (
        <Button
          classes={{ root: classes.loadMoreBtn }}
          variant="text"
          color="default"
          startIcon={<Cached />}
          onClick={loadMoreWebinars}
        >
          Xem thêm ...
        </Button>
      )}
      {isLoading && <ArticleSkeleton size={isMobile ? 'small' : 'medium'} />}
    </MuiPickersUtilsProvider>
  );
};

export default Webinars;
