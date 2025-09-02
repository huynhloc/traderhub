import React from 'react';
import { useSelector } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import { Box, Typography, Tabs, Tab } from '@material-ui/core';
import PersonIcon from 'assets/icons/person-icon.svg';
import ProfileTabContent from './Profile';
import ProfileActivitiesTabContent from './Activities';

type StyledTabProps = {
  label: string;
};

const AntTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(1),
      },
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  })
)(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'uppercase',
      minWidth: 120,
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(1),
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const useStyles = makeStyles({
  pageTitle: {
    textTransform: 'uppercase',
    flex: 1,
  },
});

const Profile: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const user = useSelector((state) => state.user.currentUser);

  const handleChange = (_: React.ChangeEvent<unknown>, newValue: number) => {
    setValue(newValue);
  };
  return user ? (
    <React.Fragment>
      <Box display="flex" flexDirection="row" mb={1.5}>
        <Box
          width={30}
          height={30}
          borderRadius="50%"
          bgcolor="primary.main"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mr={3 / 4}
          mt={1 / 6}
        >
          <PersonIcon />
        </Box>
        <Typography
          variant="h5"
          component="h1"
          color="textSecondary"
          classes={{ root: classes.pageTitle }}
        >
          Hồ Sơ
        </Typography>
      </Box>
      <AntTabs value={value} onChange={handleChange} aria-label="">
        <AntTab label="CÁ NHÂN" {...a11yProps(0)} />
        <AntTab label="HOẠT ĐỘNG" {...a11yProps(1)} />
      </AntTabs>
      <TabPanel value={value} index={0}>
        <ProfileTabContent />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProfileActivitiesTabContent />
      </TabPanel>
    </React.Fragment>
  ) : null;
};

export default Profile;
