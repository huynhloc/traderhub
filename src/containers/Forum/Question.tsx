/**
 * Question detail
 */
import React, {
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { first } from 'lodash';
import moment from 'moment';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Box,
  Button,
  Typography,
  SvgIcon,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@material-ui/core';
import { FavoriteBorderOutlined, Favorite, Cached } from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TBox,
  TBreadcrumbs,
  QuestionSkeleton,
  CommentSkeleton,
  ConfirmDialog,
  SEOTags,
  TableOfContent,
} from 'components';
import { Handle } from 'components/ConfirmDialog';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { formatNumber, getServerErrorMessage } from 'utils';
import ChatIcon from 'assets/icons/chat-icon.svg';
import EyeIcon from 'assets/icons/eye-icon.svg';
import TimeIcon from 'assets/icons/time-icon.svg';
import ForumQuestionRedux from 'redux/forumQuestion';
import GlobalRedux from 'redux/global';
import { ROUTES } from 'constants/routes';
import { Answer, Comment, ServerError } from 'interfaces';
import { ANSWER_TYPE } from 'constants/app';
import { navigateToForumQuestion } from 'utils/tracking';
import HotForumQuestions from './HotForumQuestions';
import ActiveMembers from './ActiveMembers';
import AnswerItem from './Answer';
import CommentBox from './CommentBox';

const QuestionFormModal = dynamic(async () => import('./QuestionFormModal'), {
  ssr: false,
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    breadcrumbs: {
      marginTop: theme.spacing(1),
    },
    icon: {
      width: '16px',
      height: '16px',
      marginRight: theme.spacing(0.25),
      marginTop: 2,
    },
    content: {
      whiteSpace: 'pre-line',
      wordBreak: 'break-word',
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
      },
      '& *': {
        maxWidth: '100%',
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
    actionBtn: {
      color: theme.palette.text.secondary,
      marginRight: theme.spacing(0.5),
      marginTop: theme.spacing(1),
      '&:hover': {
        backgroundColor: 'transparent',
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
      },
    },
    loadMoreBtn: {
      textTransform: 'none',
      alignSelf: 'flex-start',
      marginLeft: '62px',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    contextMenuItem: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    tag: {
      borderRadius: 3,
      border: `1px solid ${theme.palette.grey[500]}`,
      margin: 3,
      padding: `2px 5px`,
    },
  })
);

const Question: React.FC = () => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const deleteConfirmRef = useRef<Handle>();
  const [
    anchorContextMenuEl,
    setAnchorContextMenuEl,
  ] = useState<null | HTMLElement>(null);
  const [
    anchorCommentContextMenuEl,
    setAnchorCommentContextMenuEl,
  ] = useState<null | HTMLElement>(null);
  const [commentContextAction, setCommentContextAction] = useState<{
    requestEdit: () => void;
    answer?: Answer;
    comment?: Comment;
  } | null>(null);
  const isOpenContextMenu = Boolean(anchorContextMenuEl);
  const isOpenCommentContextMenu = Boolean(anchorCommentContextMenuEl);
  const [isLoading, setIsLoading] = useState(false);
  const question = useSelector((state) => state.forumQuestion.data);
  const isLoadingStatus = useSelector((state) => state.forumQuestion.isLoading);
  const isProcessing = useSelector((state) => state.forumQuestion.isProcessing);
  const currentUser = useSelector((state) => state.user.currentUser);
  const liked =
    question &&
    currentUser &&
    currentUser.likedForumQuestions.indexOf(question.id) >= 0;

  const openContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorContextMenuEl(event.currentTarget);
  };

  const closeContextMenu = () => {
    setAnchorContextMenuEl(null);
  };

  const openCommentContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    action: {
      requestEdit: () => void;
      answer?: Answer;
      comment?: Comment;
    }
  ) => {
    setCommentContextAction(action);
    setAnchorCommentContextMenuEl(event.currentTarget);
  };

  const closeCommentContextMenu = () => {
    setAnchorCommentContextMenuEl(null);
  };

  const showImage = (url: string) => () =>
    dispatch(GlobalRedux.actions.showImage(url));

  const loadMoreAnswers = useCallback(() => {
    if (question) {
      setIsLoading(true);
      dispatch(
        ForumQuestionRedux.actions.getMoreAnswers({
          createdAt: first(question?.answers)?.createdAt as string,
          forumQuestionId: question.id,
          callback: () => setIsLoading(false),
        })
      );
    }
  }, [question]);

  const reactForumQuestion = useCallback(() => {
    if (!currentUser) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (currentUser && question) {
      dispatch(
        ForumQuestionRedux.actions.reactForumQuestion({
          user: currentUser.id,
          forumQuestion: question.id,
          like: !liked,
        })
      );
    }
  }, [currentUser, question]);

  const reactAnswer = useCallback(
    (answer, like) => {
      if (!currentUser) {
        router.push(ROUTES.LOGIN);
        return;
      }
      if (currentUser) {
        dispatch(
          ForumQuestionRedux.actions.reactAnswer({
            user: currentUser.id,
            forumAnswer: answer.id,
            like,
          })
        );
      }
    },
    [currentUser]
  );

  const reactComment = useCallback(
    (comment, like) => {
      if (!currentUser) {
        router.push(ROUTES.LOGIN);
        return;
      }
      if (currentUser) {
        dispatch(
          ForumQuestionRedux.actions.reactComment({
            user: currentUser.id,
            answer: comment.answer,
            forumComment: comment.id,
            like,
          })
        );
      }
    },
    [currentUser]
  );

  const deleteForumQuestion = () => {
    if (question) {
      dispatch(
        ForumQuestionRedux.actions.deleteForumQuestion({
          ...question,
          callback: (err, data) => {
            deleteConfirmRef?.current?.handleClose();
            if (!err && data) {
              router.replace(ROUTES.HOME);
            } else {
              toast.error(getServerErrorMessage(err as ServerError[]));
            }
          },
        })
      );
    }
  };

  const deleteComment = () => {
    const callback = (err: unknown, data: unknown) => {
      if (!err && data) {
        deleteConfirmRef?.current?.handleClose();
      } else {
        toast.error(getServerErrorMessage(err as ServerError[]));
      }
    };
    if (commentContextAction?.answer) {
      dispatch(
        ForumQuestionRedux.actions.deleteAnswer({
          ...commentContextAction?.answer,
          callback,
        })
      );
    } else if (commentContextAction?.comment) {
      dispatch(
        ForumQuestionRedux.actions.deleteComment({
          ...commentContextAction?.comment,
          callback,
        })
      );
    }
  };

  const onCreateAnswerSuccess = (id: string) => {
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  const breadcrumbs = useMemo(
    () =>
      question
        ? [
          { text: 'Diễn đàn', url: '/forum' },
          {
            text: question?.forumTopic.forumCategory?.name,
            url: `/forum/category/${question?.forumTopic.forumCategory?.slug}`,
          },
          {
            text: question?.forumTopic.name,
            url: `/forum/topic/${question?.forumTopic.slug}`,
          },
        ]
        : [],
    [question]
  );

  useEffect(() => {
    question &&
      navigateToForumQuestion({
        id: question.id,
        title: question.title,
        slug: question.slug,
      });
  }, [question]);

  useEffect(() => {
    if ((!question || !question.id) && !isLoadingStatus) {
      router.replace('/404');
    }
  }, []);

  console.log({ question });

  return (
    <React.Fragment>
      {question && (
        <SEOTags
          seoTitle={question.seoTitle || `${question.title} | TraderHub`}
          seoDescription={question.seoDescription}
          seoImg={question.seoImg}
        />
      )}
      <Grid container spacing={isMobile ? 0 : 2}>
        <Grid item xs={12} sm={12} md={9}>
          {!question ? (
            <QuestionSkeleton />
          ) : (
            <React.Fragment>
              <Paper elevation={0}>
                <Box display="block" mb={1.5}>
                  <Typography variant="h5" component="h1" color="textSecondary">
                    {question?.title}
                  </Typography>
                  <TBreadcrumbs
                    className={classes.breadcrumbs}
                    links={breadcrumbs}
                  />
                </Box>
                <TBox>
                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Box display="flex" alignItems="center">
                      <Box mr={isMobile ? 0.5 : 0.75}>
                        <Avatar
                          classes={{
                            root: classes.avatar,
                            fallback: classes.fallbackIcon,
                          }}
                          src={question?.author.avatar?.url}
                          alt={question?.author?.fullName}
                        />
                      </Box>
                      <Box display="block" flex={1}>
                        <Box
                          color="text.hint"
                          fontSize="body2.fontSize"
                          fontWeight="fontWeightMedium"
                          mb={0.5}
                        >
                          {question?.author.fullName}
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
                          {moment(question?.createdAt).fromNow()}
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                      color="text.secondary"
                      fontWeight="fontWeightMedium"
                      fontSize="caption.fontSize"
                    >
                      <Box display="flex" alignItems="center" mr={1}>
                        <SvgIcon
                          classes={{ root: classes.icon }}
                          component={ChatIcon}
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                        />
                        {formatNumber(question?.totalAnswer)}
                      </Box>
                      <Box display="flex" alignItems="center" mr={0.5}>
                        <SvgIcon
                          classes={{ root: classes.icon }}
                          component={EyeIcon}
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                        />
                        {formatNumber(question.totalView)}
                      </Box>
                      {currentUser?.id === question.author.id && (
                        <IconButton edge="end" onClick={openContextMenu}>
                          <MoreVertIcon
                            fontSize={isMobile ? 'small' : 'default'}
                          />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  {question.toc && <TableOfContent toc={question.toc} />}
                  <Box fontSize="body1.fontSize">
                    <div
                      className={`${classes.content} ck-content`}
                      dangerouslySetInnerHTML={{
                        __html: question?.content,
                      }}
                    />
                  </Box>
                  <Box display="flex" width={1} mt={1.5}>
                    {question?.forumHashtags?.map((tag) => (
                      <Link href={`/forum/hashtag/${tag.slug}`} key={tag.slug}>
                        <a className={classes.tag}>
                          <Typography variant="caption" color="textPrimary">
                            {tag.name}
                          </Typography>
                        </a>
                      </Link>
                    ))}
                  </Box>
                  <Button
                    classes={{ root: classes.actionBtn }}
                    disableTouchRipple
                    variant="text"
                    onClick={reactForumQuestion}
                    startIcon={
                      liked ? (
                        <Favorite color="primary" />
                      ) : (
                        <FavoriteBorderOutlined />
                      )
                    }
                  >
                    {`${question.totalLike ? formatNumber(question.totalLike) : ''
                      } Thích`}
                  </Button>
                </TBox>
                <TBox>
                  <CommentBox
                    questionId={question?.id}
                    key={question?.id}
                    answerType={ANSWER_TYPE.FORUM}
                    onCreateSuccess={onCreateAnswerSuccess}
                  />
                  {!isLoading &&
                    question.totalAnswer > (question.answers?.length || 0) && (
                      <Button
                        classes={{ root: classes.loadMoreBtn }}
                        disableTouchRipple
                        variant="text"
                        color="default"
                        startIcon={<Cached />}
                        onClick={loadMoreAnswers}
                      >
                        Xem bình luận trước ...
                      </Button>
                    )}
                  {isLoading && <CommentSkeleton />}
                  {question?.answers?.map((answer) => (
                    <AnswerItem
                      currentUser={currentUser}
                      key={answer.id}
                      answer={answer}
                      liked={
                        !!(
                          currentUser &&
                          currentUser.likedAnswers.indexOf(answer.id) >= 0
                        )
                      }
                      reactAnswer={reactAnswer}
                      reactComment={reactComment}
                      requestOpenContextMenu={openCommentContextMenu}
                      showImage={showImage}
                    />
                  ))}
                </TBox>
              </Paper>
              <Menu
                id="question-context-menu"
                anchorEl={anchorContextMenuEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isOpenContextMenu}
                onClose={closeContextMenu}
              >
                <div>
                  <QuestionFormModal
                    forumQuestion={question}
                    renderActionButton={(handleOpen) => (
                      <MenuItem
                        classes={{ gutters: classes.contextMenuItem }}
                        onClick={() => {
                          closeContextMenu();
                          handleOpen();
                        }}
                      >
                        Sửa
                      </MenuItem>
                    )}
                  />
                </div>
                <MenuItem
                  classes={{ gutters: classes.contextMenuItem }}
                  onClick={() => {
                    closeContextMenu();
                    deleteConfirmRef?.current?.confirm({
                      content: 'Bạn muốn xoá bài này?',
                      action: deleteForumQuestion,
                    });
                  }}
                >
                  Xoá
                </MenuItem>
              </Menu>
              <Menu
                id="comment-context-menu"
                anchorEl={anchorCommentContextMenuEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isOpenCommentContextMenu}
                onClose={closeCommentContextMenu}
              >
                <MenuItem
                  classes={{ gutters: classes.contextMenuItem }}
                  onClick={() => {
                    closeCommentContextMenu();
                    commentContextAction?.requestEdit();
                  }}
                >
                  Sửa
                </MenuItem>
                <MenuItem
                  classes={{ gutters: classes.contextMenuItem }}
                  onClick={() => {
                    closeCommentContextMenu();
                    deleteConfirmRef?.current?.confirm({
                      content: 'Bạn muốn xoá bình luận này?',
                      action: deleteComment,
                    });
                  }}
                >
                  Xoá
                </MenuItem>
              </Menu>
              <ConfirmDialog
                ref={deleteConfirmRef}
                isProcessing={isProcessing}
              />
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={3}>
          <Paper elevation={0}>
            <HotForumQuestions />
            <ActiveMembers />
          </Paper>
        </Grid>
      </Grid>
      <ToastContainer
        autoClose={5000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Question;
