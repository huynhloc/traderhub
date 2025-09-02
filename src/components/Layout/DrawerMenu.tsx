import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import {
  Collapse,
  List,
  ListItem,
  ListItemText,
  Drawer,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { NavItem } from 'interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerMenu: {
      minWidth: '300px',
    },
    menuItemText: {
      color: theme.palette.text.primary,
    },
    nestedMenuItemText: {
      color: theme.palette.text.primary,
      marginLeft: theme.spacing(1),
    },
  })
);

type NestedItemProps = {
  item: NavItem;
  onClose: () => void;
};

const NestedItem: React.FC<NestedItemProps> = ({
  item: { title, href, subItems },
  onClose,
}) => {
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const navigate = (url: string) => () => {
    onClose();
    router.push(url);
  };
  return (
    <React.Fragment>
      <ListItem button onClick={navigate(href)}>
        <ListItemText primary={title} className={classes.menuItemText} />

        <ListItemSecondaryAction onClick={handleClick}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems?.map((subItem) => (
            <ListItem
              key={subItem.href}
              button
              onClick={navigate(subItem.href)}
            >
              <ListItemText
                primary={subItem.title}
                className={classes.nestedMenuItemText}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

type Props = {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

const Drawermenu: React.FC<Props> = ({ open, onClose, navItems }) => {
  const router = useRouter();
  const classes = useStyles();
  const navigate = (url: string) => () => {
    onClose();
    router.push(url);
  };
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List className={classes.drawerMenu}>
        {navItems.map((item) =>
          isEmpty(item.subItems) ? (
            <ListItem button key={item.href} onClick={navigate(item.href)}>
              <Link href={item.href}>
                <a>
                  <ListItemText
                    primary={item.title}
                    className={classes.menuItemText}
                  />
                </a>
              </Link>
            </ListItem>
          ) : (
            <NestedItem key={item.href} item={item} onClose={onClose} />
          )
        )}
      </List>
    </Drawer>
  );
};

export default Drawermenu;
