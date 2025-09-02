import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Typography, Button, SvgIcon, Avatar } from '@material-ui/core';
import { formatNumber } from 'utils';
import { ForumItemSkeleton, TBox } from 'components';
import PinIcon from 'assets/icons/pin-icon.svg';
import ChatIcon from 'assets/icons/chat-icon.svg';
import EyeIcon from 'assets/icons/eye-icon.svg';
import TimeIcon from 'assets/icons/time-icon.svg';
import { ForumQuestion } from 'interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    hotTopicIcon: {
      width: '16px',
      height: '16px',
      marginRight: theme.spacing(0.25),
    },
    avatar: {
      width: 40,
      height: 40,
    },
    fallbackIcon: {
      color: theme.palette.common.white,
    },
    showMoreBtn: {
      borderRadius: 18,
    },
  })
);

const HotForumQuestions: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const questions = useSelector((state) =>
    state.hotForumQuestion.data?.questions?.slice(0, 5)
  );
  return (
    <Box pb={2} display="flex" flexDirection="column" alignItems="center">
      <Box mb={1.5} width={1}>
        <Typography variant="h5" component="h1" color="textSecondary">
          Chủ đề hot nhất
        </Typography>
      </Box>
      {questions &&
        questions.map((question) => (
          <HotForumQuestionItem
            key={`hottopic_${question.id}`}
            question={question}
          />
        ))}
      {!questions && <ForumItemSkeleton showAvatar />}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        classes={{
          root: classes.showMoreBtn,
        }}
        onClick={async () => router.push('/forum/hot-topics')}
      >
        Xem tất cả
      </Button>
    </Box>
  );
};

const HotForumQuestionItem: React.FC<{ question: ForumQuestion }> = React.memo(
  ({ question }) => {
    const classes = useStyles();
    return (
      <TBox mb={1} p={0} width={1}>
        <Link href={`/forum/thread/${question?.slug}`}>
          <a>
            <Box display="flex" p={1} width={1}>
              <Box
                width={40}
                height={40}
                mr={1}
                borderRadius="50%"
                bgcolor="background.default"
              >
                <Avatar
                  classes={{
                    root: classes.avatar,
                    fallback: classes.fallbackIcon,
                  }}
                  src={question.author?.avatar?.url}
                  alt={question.author?.fullName}
                />
              </Box>
              <Box flex={1}>
                <Box
                  component="span"
                  fontWeight="fontWeightBold"
                  color="text.secondary"
                  fontSize="body2.fontSize"
                  className="truncate truncate--2"
                >
                  <PinIcon />
                  {` `}
                  {question.title}
                </Box>
                <Box
                  width={1}
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  color="text.secondary"
                  fontWeight="fontWeightMedium"
                  fontSize="caption.fontSize"
                  py={2 / 3}
                >
                  <Box display="flex" alignItems="center" mr={0.5}>
                    <SvgIcon
                      classes={{ root: classes.hotTopicIcon }}
                      component={ChatIcon}
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                    />
                    {formatNumber(question.totalAnswer)}
                  </Box>
                  <Box display="flex" alignItems="center" mr={0.5}>
                    <SvgIcon
                      classes={{ root: classes.hotTopicIcon }}
                      component={EyeIcon}
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                    />
                    {formatNumber(question.totalView)}
                  </Box>
                  <Box display="flex" alignItems="center">
                    <SvgIcon
                      classes={{ root: classes.hotTopicIcon }}
                      component={TimeIcon}
                      width={16}
                      height={16}
                      viewBox="0 0 16 16"
                    />
                    {moment(question?.createdAt).fromNow()}
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  color="text.disabled"
                  fontWeight="fontWeightMedium"
                  fontSize="caption.fontSize"
                >
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    mr={0.25}
                    bgcolor="success.light"
                  />
                  {question.forumTopic.name}
                </Box>
              </Box>
            </Box>
          </a>
        </Link>
      </TBox>
    );
  }
);

export default HotForumQuestions;
