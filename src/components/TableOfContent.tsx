import React, { useState } from 'react';
import {
  makeStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const Accordion = withStyles({
  root: {
    backgroundColor: 'white',
    border: '1px solid rgba(0, 0, 0, .125)',
    borderRadius: 8,
    width: 'fit-content',
    marginBottom: `24px !important`,
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      width: 'fit-content',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    marginBottom: -1,
    minHeight: 40,
    padding: '0 16px',
    '&$expanded': {
      minHeight: 40,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordionSummary: {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.text.primary,
    },
    accordionDetails: {
      padding: 0,
    },
    listItem: {
      padding: `0px ${theme.spacing(1)}px`,
    },
    listItemText: {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.common.black,
    },
  })
);

type Props = {
  toc?: { text: string; id: string }[];
};

const TableOfContent: React.FC<Props> = ({ toc }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const handleChange = (_: unknown, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Typography className={classes.accordionSummary}>Nội Dung</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <List component="nav">
          {toc?.map((heading) => (
            <ListItem key={`#${heading.id}`} className={classes.listItem}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded(false);
                  const timer = setTimeout(() => {
                    document?.querySelector(`#${heading.id}`)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                    clearTimeout(timer);
                  }, 500);
                }}
              >
                <ListItemText
                  primary={heading.text}
                  classes={{
                    primary: classes.listItemText,
                  }}
                />
              </a>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default TableOfContent;
