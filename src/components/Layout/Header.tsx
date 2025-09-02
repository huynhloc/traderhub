import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Avatar,
} from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@material-ui/icons/Menu';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NProgress from 'nprogress';
import { NavItem, SubMenuItem } from 'interfaces';
import NewsRedux from 'redux/news';
import UserRedux from 'redux/user';
import ForumRedux from 'redux/forum';
import Logo from 'assets/images/logo.svg';
import { ROUTES } from 'constants/routes';
import NavButton from './NavButton';
import SearchBar from './SearchBar';
import DrawerMenu from './DrawerMenu';
import TickersTapeWidget from 'components/TickersTapeWidget';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: '120px',
      justifyContent: 'center',
      backgroundColor: theme.palette.common.white,
      [theme.breakpoints.down('sm')]: {
        height: '64px',
      },
    },
    container: {
      height: '100%',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(0.625),
        paddingRight: theme.spacing(0.625),
      },
    },
    toolbar: {
      height: '100%',
      display: 'flex',
      alignItems: 'stretch',
    },
    menuButton: {
      display: 'none',
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        display: 'block',
      },
      [theme.breakpoints.down('xs')]: {
        marginRight: theme.spacing(0.5),
      },
    },
    logoButton: {
      marginRight: theme.spacing(2),
      alignSelf: 'stretch',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      [theme.breakpoints.down('xs')]: {
        marginRight: 0,
      },
    },
    navButtons: {
      display: 'block',
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    avatar: {
      width: 46,
      height: 46,
      [theme.breakpoints.down('xs')]: {
        width: 36,
        height: 36,
      },
    },
    fallbackIcon: {
      color: theme.palette.common.white,
    },
  })
);

const getNavItems = (
  newsSubMenus: SubMenuItem[] = [],
  forumSubMenus: SubMenuItem[] = []
): NavItem[] => [
  {
    href: '/forum',
    title: 'Diễn Đàn',
    subItems: forumSubMenus,
  },
  {
    href: '/news',
    title: 'Tin Tức',
    subItems: newsSubMenus,
  },
  {
    href: '/academy',
    title: 'Academy',
    subItems: [
      { title: 'Tài liệu nổi bật', href: '/academy/category/tai-lieu-noi-bat' },
      { title: 'Lịch sự kiện', href: '/academy/webinar' },
      { title: 'Blog trading', href: '/academy/category/blog-trading' },
      { title: 'Videos', href: '/academy/category/videos' },
    ],
  },
  {
    href: '/calendar',
    title: 'Lịch Kinh Tế',
  },
];

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const router = useRouter();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isProcessing = useSelector((state) => state.user.isProcessing);
  const allNewsCategories = useSelector((state) => state.news.allCategories);
  const allForumCategories = useSelector((state) => state.forum.data);
  const [openDrawerMenu, setOpenDrawerMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickUserMenuItem = (url: string) => () => {
    setAnchorEl(null);
    router.push(url);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(UserRedux.actions.logout());
  };

  const toggleDrawer = () => setOpenDrawerMenu(!openDrawerMenu);

  const navItems = useMemo(
    () =>
      getNavItems(
        !allNewsCategories
          ? []
          : allNewsCategories.map((cate) => ({
              title: cate.name,
              href: `/news/category/${cate.slug}`,
            })),
        !allForumCategories
          ? []
          : allForumCategories.map((cate) => ({
              title: cate.name,
              href: `/forum/category/${cate.slug}`,
            }))
      ),
    [allNewsCategories]
  );

  useEffect(() => {
    NProgress.configure({ parent: '#header', showSpinner: false });
  }, []);

  useEffect(() => {
    if (!allNewsCategories) {
      dispatch(NewsRedux.actions.getNewsCategories());
    }
  }, [allNewsCategories]);

  useEffect(() => {
    if (!allForumCategories) {
      dispatch(ForumRedux.actions.getForumData());
    }
  }, [allForumCategories]);

  return (
    <AppBar
      id="header"
      position="fixed"
      elevation={1}
      classes={{
        root: classes.root,
      }}
    >
      <TickersTapeWidget />

      <Container
        maxWidth="lg"
        classes={{
          root: classes.container,
        }}
      >
        <Toolbar disableGutters className={classes.toolbar}>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              <MenuIcon color="action" fontSize="large" />
            </IconButton>
            <IconButton
              edge="start"
              classes={{
                root: classes.logoButton,
              }}
              color="inherit"
              aria-label="open drawer"
            >
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </IconButton>
            <div className={classes.navButtons}>
              {navItems.map(({ href, title, subItems }) => (
                <NavButton key={href} href={href} subItems={subItems}>
                  {title}
                </NavButton>
              ))}
            </div>
          </Box>
          <Box
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flex={1}
          >
            <SearchBar />
            {!isProcessing && !currentUser && (
              <NavButton href="/login">Đăng Nhập</NavButton>
            )}
            {isProcessing && <CircularProgress size={20} />}
            {currentUser && (
              <React.Fragment>
                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar
                    classes={{
                      root: classes.avatar,
                      fallback: classes.fallbackIcon,
                    }}
                    src={currentUser?.avatar?.url}
                    alt={currentUser?.fullName}
                  />
                </IconButton>

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  elevation={2}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={openUserMenu}
                  onClose={handleClose}
                >
                  <MenuItem onClick={onClickUserMenuItem(ROUTES.PROFILE)}>
                    Thông tin cá nhân
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Box>
        </Toolbar>
      </Container>
      <DrawerMenu
        open={openDrawerMenu}
        onClose={toggleDrawer}
        navItems={navItems}
      />
    </AppBar>
  );
};

export default Header;
