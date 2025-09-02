import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import {
  Box,
  Grid,
  SvgIcon,
  Typography,
  Avatar,
  IconButton,
  Card,
  CardActionArea,
} from '@material-ui/core';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
  Comment,
  Answer,
  ForumQuestion,
  RequestOpenContextMenuFn,
  Article,
  ArticleCategory,
} from 'interfaces';
import TimeIcon from 'assets/icons/time-icon.svg';
import { isEmpty } from 'lodash';
import { ANSWER_TYPE } from 'constants/app';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      marginBottom: theme.spacing(1),
      borderRadius: theme.spacing(1),
      border: `1px solid ${theme.palette.grey[100]}`,
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(0.5),
      },
    },
    container: {
      padding: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0.75),
      },
    },
    title: {
      fontWeight: 500,
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
        marginLeft: 60,
        marginTop: 4,
      },
      [theme.breakpoints.down('xs')]: {
        marginLeft: 50,
      },
    },
    contextMenuBtn: {
      position: 'absolute',
      top: 4,
      right: 0,
    },
    content: {
      whiteSpace: 'pre-line',
      paddingTop: 8,
      paddingLeft: theme.spacing(4),
      [theme.breakpoints.down('sm')]: {
        paddingTop: 4,
        paddingLeft: theme.spacing(3.5),
        fontSize: theme.typography.caption.fontSize,
      },
    },
  })
);

type Props = {
  comment?: Comment;
  answer?: Answer;
  requestOpenContextMenu?: RequestOpenContextMenuFn;
};

const CommentItem: React.FC<Props> = ({
  comment,
  answer,
  requestOpenContextMenu,
}) => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const isSM = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const question = useMemo(() => {
    if (comment) {
      return (comment.answer as Answer)?.forumQuestion as ForumQuestion;
    } else if (answer) {
      return answer.forumQuestion as ForumQuestion;
    }
    return;
  }, [comment, answer]);

  const article = useMemo(() => {
    if (comment) {
      return (comment.answer as Answer)?.article as Article;
    } else if (answer) {
      return answer.article as Article;
    }
    return;
  }, [comment, answer]);

  const formattedContent = useMemo(() => {
    if (comment) {
      const tags = comment.tags;
      if (tags && !isEmpty(tags)) {
        return tags.reduce(
          (accumulator, tagged) =>
            accumulator.replace(
              new RegExp(tagged.name, 'g'),
              `<a href="javascript:void(0)"><span class="mention">${tagged.name}</span></a>`
            ),
          comment.content
        );
      }
      return comment.content;
    } else if (answer) {
      return answer.content;
    }
    return '';
  }, [comment, answer]);

  const onClick = () => {
    const type = (comment?.answer as Answer)?.type || answer?.type;
    if (type === ANSWER_TYPE.FORUM && question) {
      router.push(`/forum/thread/${question?.slug}`);
    } else if (type === ANSWER_TYPE.ARTICLE && article) {
      router.push(`/${article.type}/article/${article?.slug}`);
    }
  };
  return (
    <Card elevation={2} className={classes.root}>
      <CardActionArea className={classes.container} onClick={onClick}>
        <Grid
          container
          direction="row"
          spacing={isSM ? 0 : 1}
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
                src={question?.author?.avatar?.url}
                alt={question?.author?.fullName}
              />

              <Box px={1} flex={1}>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  classes={{ root: classes.title }}
                >
                  {question?.title || article?.title}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  color="text.disabled"
                  fontWeight="fontWeightMedium"
                  fontSize="caption.fontSize"
                  fontFamily="fontFamily"
                >
                  <Box
                    width={12}
                    height={12}
                    borderRadius="50%"
                    mr={0.5}
                    bgcolor="success.light"
                  />
                  {question?.forumTopic?.name ||
                    (article?.articleCategory as ArticleCategory)?.name}
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
              <Box display="flex" alignItems="center" fontFamily="fontFamily">
                <SvgIcon
                  classes={{ root: classes.hotTopicIcon }}
                  component={TimeIcon}
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                />
                {moment(comment?.createdAt || answer?.createdAt).fromNow()}
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box
          fontSize="body2.fontSize"
          color="text.primary"
          fontFamily="fontFamily"
        >
          <div
            className={classes.content}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </Box>
      </CardActionArea>
      {!!requestOpenContextMenu && (
        <IconButton
          className={classes.contextMenuBtn}
          onClick={(e) => {
            requestOpenContextMenu(e, {
              comment,
              answer,
            });
          }}
        >
          <MoreVertIcon fontSize={isMobile ? 'small' : 'default'} />
        </IconButton>
      )}
    </Card>
  );
};

export default CommentItem;
