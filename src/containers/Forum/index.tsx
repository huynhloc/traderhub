import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, Paper, Box, Typography, IconButton } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { TBox, TagCloud } from 'components';
import ChatOutlineIcon from 'assets/icons/chat-outline-icon.svg';
import ChatIcon from 'assets/icons/chat-icon.svg';
import CoffeeIcon from 'assets/icons/coffee-icon.svg';
import ArrowRightIcon from 'assets/icons/arrow-right-icon.svg';
import HotForumQuestions from './HotForumQuestions';
import ActiveMembers from './ActiveMembers';
import TopicItem from './TopicItem';
import { navigateToForum } from 'utils/tracking';

const QuestionFormModal = dynamic(async () => import('./QuestionFormModal'), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pageTitle: {
      textTransform: 'uppercase',
      flex: 1,
    },
    cateImg: {
      marginTop: '8px',
    },
    categorySumText: {
      marginLeft: '5px',
      marginRight: theme.spacing(1),
      marginBottom: '2px',
      fontWeight: 500,
    },
  })
);

const Forum: React.FC = () => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const router = useRouter();
  const categories = useSelector((state) => state.forum.data);
  const hashtags = useSelector((state) => state.forum.topHashtags);

  const tags = hashtags?.map((tag) => ({
    value: tag.name,
    count: tag.point,
    key: tag.slug,
  }));

  useEffect(() => {
    navigateToForum();
  }, []);

  return (
    <Grid container spacing={isMobile ? 0 : 2}>
      <Grid item xs={12} sm={12} md={9}>
        <a
          href="https://scopemarkets.com/"
          target="_blank"
          rel="nofollow external noopener noreferrer"
        >
          <img
            style={{ width: '100%', marginBottom: 24 }}
            src="https://s3.ap-southeast-1.amazonaws.com/files.gigantecmedia.com/ForumTradehub/forum_banner_985583205a.gif"
            alt="forum-banner"
          />
        </a>

        <Paper elevation={0}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1.5}
          >
            <Box display="flex" flexDirection="row">
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
                <ChatOutlineIcon />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                color="textSecondary"
                classes={{ root: classes.pageTitle }}
              >
                Diễn Đàn
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <QuestionFormModal />
            </Box>
          </Box>
          {categories.map((category) => (
            <TBox key={category.id}>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                mb={1.5}
              >
                <ChatIcon />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  classes={{ root: classes.categorySumText }}
                >
                  {`${category.totalForumQuestionInWeek}/tuần`}
                </Typography>
                <CoffeeIcon />
                <Typography
                  variant="caption"
                  color="textSecondary"
                  classes={{ root: classes.categorySumText }}
                >
                  {`${category.totalForumQuestionInDay} mới`}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                pb={0.5}
              >
                <Box display="flex" alignItems="flex-start">
                  <div className={classes.cateImg}>
                    <Image
                      width={58}
                      height={58}
                      objectFit="contain"
                      quality={100}
                      src={category.icon.url}
                      alt={category.seoTitle || category.name}
                    />
                  </div>
                  <Box px={1} flex={1}>
                    <Typography variant="h6" component="h1">
                      {category.name}
                    </Typography>
                    <Typography variant="body2">
                      {category.description}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={async () =>
                    router.push(`/forum/category/${category.slug}`)
                  }
                >
                  <ArrowRightIcon />
                </IconButton>
              </Box>
              {category.forumTopics?.map((topic) => (
                <TopicItem key={topic.id} mt={1} mb={0} topic={topic} />
              ))}
            </TBox>
          ))}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} md={3}>
        <Paper elevation={0}>
          <HotForumQuestions />
          <ActiveMembers />
          <TagCloud tags={tags} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Forum;
