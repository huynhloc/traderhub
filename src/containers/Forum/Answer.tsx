import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import moment from 'moment';
import { isEmpty, first } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, SvgIcon, Button, IconButton, Avatar } from '@material-ui/core';
import {
  ChatBubbleOutline,
  FavoriteBorderOutlined,
  Favorite,
  Cached,
  MoreVert as MoreVertIcon,
} from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import TimeIcon from 'assets/icons/time-icon.svg';
import { User, Answer, Comment } from 'interfaces';
import { useDispatch } from 'react-redux';
import { CommentSkeleton } from 'components';
import { formatNumber } from 'utils';
import ForumQuestionRedux from 'redux/forumQuestion';
import ArticleRedux from 'redux/article';
import CommentBox from './CommentBox';
import { ANSWER_TYPE } from 'constants/app';
import linkifyHtml from 'linkifyjs/html';

const linkifyConfig = {
  defaultProtocol: 'https',
  attributes: {
    target: '_blank',
    rel: 'nofollow external noopener noreferrer',
  },
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentBox: {
      borderRadius: '0px 8px 8px 8px',
      paddingBottom: theme.spacing(0.5),
      [theme.breakpoints.down('xs')]: {
        paddingBottom: theme.spacing(0.25),
      },
    },
    icon: {
      width: '16px',
      height: '16px',
      marginRight: theme.spacing(0.25),
      marginTop: 2,
    },
    actionBtn: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(0.5),
      '&:hover': {
        backgroundColor: 'transparent',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
      },
    },
    content: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      marginBottom: theme.spacing(0.5),
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
      },
    },
    commentImg: {
      // border: '1px solid #ccc',
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
    loadMoreBtn: {
      textTransform: 'none',
      alignSelf: 'flex-start',
      marginLeft: '62px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  })
);

type Props = {
  answer: Answer;
  liked: boolean;
  currentUser?: User;
  reactAnswer: (answer: Answer, like: boolean) => void;
  reactComment: (comment: Comment, like: boolean) => void;
  requestOpenContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    playload: {
      requestEdit: () => void;
      answer?: Answer;
    }
  ) => void;
  showImage: (url: string) => () => void;
};

const AnswerItem: React.FC<Props> = ({
  answer,
  liked,
  reactAnswer,
  reactComment,
  requestOpenContextMenu,
  currentUser,
  showImage,
}) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [tags, setTags] = useState<{ userId: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const triggerComment = (mention?: User) => () => {
    setTags(
      mention ? [{ userId: mention.id, name: `@${mention.fullName}` }] : []
    );
    setShowCommentBox(!showCommentBox);
  };
  const onCreateCommentSuccess = (id: string) => {
    triggerComment()();
    // scroll to id
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };
  const loadMoreComments = useCallback(() => {
    if (answer) {
      const loadMoreCommentsAction =
        answer.type === ANSWER_TYPE.ARTICLE
          ? ArticleRedux.actions.getMoreComments
          : ForumQuestionRedux.actions.getMoreComments;
      setIsLoading(true);
      dispatch(
        loadMoreCommentsAction({
          createdAt: first(answer?.comments)?.createdAt as string,
          answerId: answer.id,
          callback: () => setIsLoading(false),
        })
      );
    }
  }, [answer]);

  const react = () => {
    reactAnswer(answer, !liked);
  };

  return !isEdit ? (
    <Box display="flex" flexDirection="row" id={answer.id}>
      <Box mr={isMobile ? 0.5 : 1}>
        <Avatar
          classes={{
            root: classes.avatar,
            fallback: classes.fallbackIcon,
          }}
          src={answer.author?.avatar?.url}
          alt={answer.author?.fullName}
        />
      </Box>
      <Box flex={1} display="flex" flexDirection="column" alignItems="stretch">
        <Box
          mb={isMobile ? 0.75 : 1}
          bgcolor="background.default"
          p={isMobile ? 0.625 : 1}
          className={classes.contentBox}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <div>
              <Box
                color="text.hint"
                fontSize="body2.fontSize"
                fontWeight="fontWeightMedium"
                mb={0.5}
              >
                {answer.author.fullName}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                color="text.disabled"
                fontWeight="fontWeightMedium"
                fontSize="caption.fontSize"
              >
                <SvgIcon
                  classes={{ root: classes.icon }}
                  component={TimeIcon}
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                />
                {moment(answer.createdAt).fromNow()}
              </Box>
            </div>
            {currentUser && currentUser.id === answer.author.id && (
              <IconButton
                edge="end"
                onClick={(e) =>
                  requestOpenContextMenu(e, {
                    requestEdit: () => setIsEdit(true),
                    answer,
                  })
                }
              >
                <MoreVertIcon fontSize={isMobile ? 'small' : 'default'} />
              </IconButton>
            )}
          </Box>
          <Box fontSize="body2.fontSize" color="common.black">
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{
                __html: linkifyHtml(answer.content, linkifyConfig),
              }}
            />
            {!isEmpty(answer.images) && (
              <Button onClick={showImage(answer.images[0].url)}>
                <Image
                  objectFit="cover"
                  quality={100}
                  width="100px"
                  height="100px"
                  src={answer.images[0].url}
                  alt="traderhub"
                />
              </Button>
            )}
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            color="text.secondary"
            fontWeight="fontWeightMedium"
            fontSize="body2.fontSize"
          >
            <Button
              classes={{ root: classes.actionBtn }}
              disableTouchRipple
              variant="text"
              onClick={react}
              startIcon={
                liked ? (
                  <Favorite color="primary" />
                ) : (
                  <FavoriteBorderOutlined />
                )
              }
            >
              {`${
                answer.totalLike ? formatNumber(answer.totalLike) : ''
              } Thích`}
            </Button>
            <Button
              classes={{ root: classes.actionBtn }}
              disableTouchRipple
              variant="text"
              startIcon={<ChatBubbleOutline />}
              onClick={triggerComment(
                !showCommentBox ? answer.author : undefined
              )}
            >
              {!showCommentBox ? 'Trả Lời' : 'Huỷ'}
            </Button>
          </Box>
        </Box>
        {showCommentBox && (
          <CommentBox
            answerType={answer.type}
            answerId={answer.id}
            tags={tags}
            key={answer.id}
            onCreateSuccess={onCreateCommentSuccess}
          />
        )}
        {!isLoading && answer.totalComment > (answer.comments?.length || 0) && (
          <Button
            classes={{ root: classes.loadMoreBtn }}
            disableTouchRipple
            variant="text"
            color="default"
            startIcon={<Cached />}
            onClick={loadMoreComments}
          >
            Xem bình luận trước ...
          </Button>
        )}
        {isLoading && <CommentSkeleton />}
        {answer.comments?.map((comment) => (
          <CommentItem
            answerType={answer.type}
            isMobile={isMobile}
            key={comment.id}
            comment={{ ...comment, answer: answer.id }}
            triggerComment={triggerComment}
            reactComment={reactComment}
            requestOpenContextMenu={requestOpenContextMenu}
            showImage={showImage}
            isOwner={currentUser?.id === comment.author.id}
            liked={
              !!(
                currentUser &&
                currentUser.likedComments.indexOf(comment.id) >= 0
              )
            }
          />
        ))}
      </Box>
    </Box>
  ) : (
    <CommentBox
      answerType={answer.type}
      answer={answer}
      cancelEdit={() => setIsEdit(false)}
    />
  );
};

const CommentItem: React.FC<{
  comment: Comment;
  liked: boolean;
  answerType: string;
  triggerComment: (mention?: User) => () => void;
  reactComment: (comment: Comment, like: boolean) => void;
  showImage: (url: string) => () => void;
  requestOpenContextMenu: (
    event: React.MouseEvent<HTMLElement>,
    playload: {
      requestEdit: () => void;
      comment?: Comment;
    }
  ) => void;
  isMobile: boolean;
  isOwner: boolean;
}> = ({
  comment,
  liked,
  answerType,
  isOwner,
  reactComment,
  requestOpenContextMenu,
  isMobile,
  showImage,
}) => {
  const classes = useStyles();
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [tags, setTags] = useState<{ userId: string; name: string }[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  const triggerComment = (mention?: User) => () => {
    setTags(
      mention ? [{ userId: mention.id, name: `@${mention.fullName}` }] : []
    );
    setShowCommentBox(!showCommentBox);
  };

  const onCreateCommentSuccess = (id: string) => {
    triggerComment()();
    // scroll to id
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const react = () => {
    reactComment(comment, !liked);
  };

  const formattedContent = useMemo(() => {
    const tags = comment.tags;
    let result = comment.content;
    if (tags && !isEmpty(tags)) {
      result = tags.reduce(
        (accumulator, tagged) =>
          accumulator.replace(
            new RegExp(tagged.name, 'g'),
            `<a href="javascript:void(0)"><span class="mention">${tagged.name}</span></a>`
          ),
        result
      );
    }
    return linkifyHtml(result, linkifyConfig);
  }, [comment]);
  return !isEdit ? (
    <Box display="flex" flexDirection="row" id={comment.id}>
      <Box mr={isMobile ? 0.5 : 1}>
        <Avatar
          classes={{
            root: classes.avatar,
            fallback: classes.fallbackIcon,
          }}
          src={comment.author?.avatar?.url}
          alt={comment.author?.fullName}
        />
      </Box>
      <Box flex={1} display="flex" flexDirection="column" alignItems="stretch">
        <Box
          flex={1}
          mb={isMobile ? 0.75 : 1}
          bgcolor="background.default"
          p={isMobile ? 0.625 : 1}
          className={classes.contentBox}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <div>
              <Box
                color="text.hint"
                fontSize="body2.fontSize"
                fontWeight="fontWeightMedium"
                mb={0.5}
              >
                {comment.author.fullName}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                color="text.disabled"
                fontWeight="fontWeightMedium"
                fontSize="caption.fontSize"
              >
                <SvgIcon
                  classes={{ root: classes.icon }}
                  component={TimeIcon}
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                />
                {moment(comment.createdAt).fromNow()}
              </Box>
            </div>
            {isOwner && (
              <IconButton
                edge="end"
                onClick={(e) =>
                  requestOpenContextMenu(e, {
                    requestEdit: () => setIsEdit(true),
                    comment,
                  })
                }
              >
                <MoreVertIcon fontSize={isMobile ? 'small' : 'default'} />
              </IconButton>
            )}
          </Box>
          <Box fontSize="body2.fontSize" color="common.black">
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
            {!isEmpty(comment.images) && (
              <Button onClick={showImage(comment.images[0].url)}>
                <Image
                  objectFit="cover"
                  quality={100}
                  width="100%"
                  height="100%"
                  src={comment.images[0].url}
                  alt="traderhub"
                />
              </Button>
            )}
          </Box>
          <Box
            display="flex"
            flexWrap="wrap"
            alignItems="center"
            color="text.secondary"
            fontWeight="fontWeightMedium"
            fontSize="body2.fontSize"
          >
            <Button
              classes={{ root: classes.actionBtn }}
              disableTouchRipple
              variant="text"
              onClick={react}
              startIcon={
                liked ? (
                  <Favorite color="primary" />
                ) : (
                  <FavoriteBorderOutlined />
                )
              }
            >
              {`${
                comment.totalLike ? formatNumber(comment.totalLike) : ''
              } Thích`}
            </Button>
            <Button
              classes={{ root: classes.actionBtn }}
              variant="text"
              startIcon={<ChatBubbleOutline />}
              onClick={triggerComment(
                !showCommentBox ? comment.author : undefined
              )}
            >
              {!showCommentBox ? 'Trả Lời' : 'Huỷ'}
            </Button>
          </Box>
        </Box>
        {showCommentBox && (
          <CommentBox
            answerType={answerType}
            answerId={comment.answer as string}
            tags={tags}
            onCreateSuccess={onCreateCommentSuccess}
          />
        )}
      </Box>
    </Box>
  ) : (
    <CommentBox
      answerType={answerType}
      comment={comment}
      tags={comment.tags}
      cancelEdit={() => setIsEdit(false)}
    />
  );
};

export default AnswerItem;
