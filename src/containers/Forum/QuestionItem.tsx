import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import {
  Box,
  Grid,
  SvgIcon,
  Typography,
  Avatar,
  IconButton,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatNumber } from 'utils';
import { ForumQuestion, RequestOpenContextMenuFn } from 'interfaces';
import { TBox } from 'components';
import ChatIcon from 'assets/icons/chat-icon.svg';
import EyeIcon from 'assets/icons/eye-icon.svg';
import TimeIcon from 'assets/icons/time-icon.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontWeight: 600,
      marginBottom: theme.spacing(0.5),
    },
    hotTopicIcon: {
      width: '16px',
      height: '16px',
      marginRight: theme.spacing(0.25),
    },
    avatar: {
      width: 46,
      height: 46,
      marginTop: 4,
      [theme.breakpoints.down('xs')]: {
        width: 36,
        height: 36,
      },
    },
    fallbackIcon: {
      color: theme.palette.common.white,
    },
    static: {
      [theme.breakpoints.down('sm')]: {
        marginLeft: '62px',
      },
    },
    contextMenuBtn: {
      position: 'absolute',
      top: 4,
      right: 0,
    },
  })
);

type Props = {
  question?: ForumQuestion;
  requestOpenContextMenu?: RequestOpenContextMenuFn;
};

const QuestionItem: React.FC<Props> = ({
  question,
  requestOpenContextMenu,
}) => {
  const theme = useTheme<Theme>();
  const isSM = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  return (
    <TBox mb={isMobile ? 0.5 : 1} position="relative">
      <Link href={`/forum/thread/${question?.slug}`}>
        <a>
          <Grid
            container
            direction="row"
            spacing={1}
            style={{
              paddingRight: requestOpenContextMenu ? (isMobile ? 16 : 32) : 0,
            }}
          >
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="row">
                <Avatar
                  classes={{
                    root: classes.avatar,
                    fallback: classes.fallbackIcon,
                  }}
                  src={question?.author.avatar?.url}
                  alt={question?.author?.fullName}
                />

                <Box px={1} flex={1}>
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    classes={{ root: classes.title }}
                  >
                    {question?.title}
                  </Typography>
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
                      mr={0.5}
                      bgcolor="success.light"
                    />
                    {question?.forumTopic.name}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} className={classes.static}>
              <Box
                width={1}
                display="flex"
                flexWrap="wrap"
                justifyContent={isSM ? 'flex-start' : 'flex-end'}
                color="text.secondary"
                fontWeight="fontWeightMedium"
                fontSize="caption.fontSize"
                mb={0.5}
              >
                <Box display="flex" alignItems="center" mr={1}>
                  <SvgIcon
                    classes={{ root: classes.hotTopicIcon }}
                    component={ChatIcon}
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                  />
                  {formatNumber(question?.totalAnswer)}
                </Box>
                <Box display="flex" alignItems="center" mr={1}>
                  <SvgIcon
                    classes={{ root: classes.hotTopicIcon }}
                    component={EyeIcon}
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                  />
                  {formatNumber(question?.totalView)}
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
                justifyContent={isSM ? 'flex-start' : 'flex-end'}
                fontSize="caption.fontSize"
                color="text.disabled"
                fontWeight="fontWeightMedium"
              >
                {question?.author.fullName}
              </Box>
            </Grid>
          </Grid>
        </a>
      </Link>
      {!!requestOpenContextMenu && (
        <IconButton
          className={classes.contextMenuBtn}
          onClick={(e) => {
            requestOpenContextMenu(e, {
              question,
            });
          }}
        >
          <MoreVertIcon fontSize={isMobile ? 'small' : 'default'} />
        </IconButton>
      )}
    </TBox>
  );
};

export default QuestionItem;
