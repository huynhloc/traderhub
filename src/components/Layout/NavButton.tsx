import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';
import Menu from 'material-ui-popup-state/HoverMenu';
import { Button, MenuItem } from '@material-ui/core';
import {
  usePopupState,
  bindHover,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { withStyles, Theme } from '@material-ui/core/styles';
import { SubMenuItem } from 'interfaces';

type Props = {
  children: React.ReactNode;
  href: string;
  subItems?: SubMenuItem[];
};

const NavButton = withStyles((theme: Theme) => ({
  root: {
    fontWeight: theme.typography.fontWeightBold,
    margin: `0px ${theme.spacing(0.6)}px`,
    textTransform: 'none',
    '& a': {
      textDecoration: 'none',
      color: 'unset',
    },
  },
  contained: {
    color: theme.palette.common.white,
    background: `linear-gradient(282.34deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 97.76%)`,
  },
  text: {
    padding: `6px 16px`,
  },
}))(Button);

export default React.memo(({ children, href, subItems }: Props) => {
  const router = useRouter();
  const onClickSubItem = () => {
    popupState.close();
  };

  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });

  return (
    <React.Fragment>
      <NavButton
        {...bindHover(popupState)}
        disableRipple
        variant={router.pathname.startsWith(href) ? 'contained' : 'text'}
        onClick={popupState.close}
      >
        <Link href={href}>
          <a>{children}</a>
        </Link>
      </NavButton>
      {!isEmpty(subItems) && (
        <Menu
          {...bindMenu(popupState)}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          elevation={2}
          MenuListProps={{
            disablePadding: true,
          }}
        >
          {subItems?.map((item) => (
            <MenuItem key={`submenu$_${item.href}`} onClick={onClickSubItem}>
              <Link href={item.href}>
                <a
                  style={{
                    color: 'unset',
                  }}
                >
                  {item.title}
                </a>
              </Link>
            </MenuItem>
          ))}
        </Menu>
      )}
    </React.Fragment>
  );
});
