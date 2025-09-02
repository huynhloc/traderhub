import React from 'react';
import Link from 'next/link';
import { Container, Grid, Typography, Box } from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Logo from 'assets/images/footerlogo.svg';
import FacebookSvg from 'assets/images/facebook-black.svg';
import InstagramSvg from 'assets/images/instagram-black.svg';
import GithubSvg from 'assets/images/github-black.svg';
import LinkedInSvg from 'assets/images/linkedin-black.svg';

const SOCIAL_LINK = [
  {
    href: 'https://www.facebook.com',
    icon: FacebookSvg,
  },
  { href: 'https://www.instagram.com', icon: InstagramSvg },
  {
    href: 'https://www.linkedin.com',
    icon: LinkedInSvg,
  },
  { href: 'https://github.com', icon: GithubSvg },
];

const MENU = [
  {
    header: 'Traderhub.vn',
    items: [
      {
        title: 'Trang chủ',
        href: '/',
      },
      {
        title: 'Forum',
        href: '/forum',
      },
      {
        title: 'Forex và CFDs',
        href: '/forum/topic/Kien-Thuc-Giao-Dich-CFDs-va-Forex',
      },
      {
        title: 'Tiền điện tử',
        href: '/forum/topic/Kien-Thuc-Giao-Dich-Tien-Dien-Tu',
      },
      {
        title: 'Hàng hoá',
        href: '/forum/topic/Kien-Thuc-Giao-Dich-Hang-Hoa',
      },
    ],
  },
  {
    header: 'Diễn đàn',
    items: [
      {
        title: 'Góc Thảo Luận',
        href: '/forum/category/goc-thao-luan',
      },
      {
        title: 'Thảo Luận Khác',
        href: '/forum/category/thao-luan-khac',
      },
      {
        title: 'Chiến Lược Giao Dịch',
        href: '/forum/category/chien-luoc-giao-dich',
      },
      {
        title: 'Kiến Thức Đầu Tư',
        href: '/forum/category/kien-thuc-dau-tu',
      },
    ],
  },
  {
    header: 'Tin Tức',
    items: [
      {
        title: 'Tin Nhanh Chứng Khoán',
        href: '/news/category/tin-nhanh-chung-khoan',
      },
      {
        title: 'Chia Sẻ Kiến Thức',
        href: '/news/category/chia-se-kien-thuc',
      },
      { title: 'Academy', href: '/academy' },
      { title: 'Blog trading', href: '/academy/category/blog-trading' },
      {
        title: 'Tài liệu nổi bật',
        href: '/academy/category/tai-lieu-noi-bat',
      },
    ],
  },
  {
    header: 'Liên Hệ',
    items: [
      {
        title: 'hotro.traderhub@gmail.com',
        href: 'mailto:hotro.traderhub@gmail.com',
      },
    ],
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      boxShadow: theme.shadows[1],
      backgroundColor: theme.palette.common.white,
      width: '100%',
    },
    container: {
      height: '100%',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(3.5),
      paddingBottom: theme.spacing(3.5),
      [theme.breakpoints.down('xs')]: {
        paddingLeft: theme.spacing(0.625),
        paddingRight: theme.spacing(0.625),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      },
    },
    footerLink: {
      color: theme.palette.text.hint,
      fontSize: 16,
      fontWeight: theme.typography.fontWeightMedium,
    },
    socialBtn: {
      width: 40,
      height: 40,
      marginRight: theme.spacing(1),
      padding: theme.spacing(0.675),
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.common.black}`,
    },
    socialIcon: {
      width: '100%',
      height: '100%',
    },
  })
);

const Footer = () => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <footer className={classes.root}>
      <Container
        maxWidth="lg"
        classes={{
          root: classes.container,
        }}
      >
        <Grid container spacing={isMobile ? 0 : 1}>
          {MENU.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.header}>
              <Box mb={1}>
                <Typography variant="h6">{item.header}</Typography>
              </Box>
              <div>
                {item.items.map((subItem) => (
                  <Box key={subItem.title} my={0.5}>
                    <Link href={subItem.href}>
                      <a className={classes.footerLink}>{subItem.title}</a>
                    </Link>
                  </Box>
                ))}
              </div>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Grid container>
            <Grid item xs={12} sm={6} md={6}>
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box
                display="flex"
                mt={1}
                width={1}
                justifyContent={isMobile ? 'flex-start' : 'flex-end'}
              >
                {SOCIAL_LINK.map(({ href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="nofollow external noopener noreferrer"
                    className={classes.socialBtn}
                  >
                    <Icon className={classes.socialIcon} />
                  </a>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Typography variant="body2">
            TraderHub là 1 trong các diễn đàn chứng khoán lớn và uy tín nhất tại
            Việt Nam. Nơi chia sẻ các kiến thức liên quan đến giao dịch, đầu tư
            thị trường cổ phiếu, ngoại hối, tiền điện tử, vàng.
          </Typography>
          <Typography variant="body2">
            Truy cập, sử dụng website này bạn phải chấp nhận quy định của diễn
            đàn.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
};

export default Footer;
