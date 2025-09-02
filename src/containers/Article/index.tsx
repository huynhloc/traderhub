/**
 * Question detail
 */
import React, {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, first } from 'lodash';
import moment from 'moment';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
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
} from '@material-ui/core';
import {
  FavoriteBorderOutlined,
  Favorite,
  Cached,
  ArrowBack,
  ArrowForward,
} from '@material-ui/icons';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  TBox,
  CommentSkeleton,
  ConfirmDialog,
  ArticleSkeleton,
  TBreadcrumbs,
  SEOTags,
  TableOfContent,
} from 'components';
import Carousel from 'react-elastic-carousel';
import { Handle } from 'components/ConfirmDialog';
import { formatNumber, getServerErrorMessage } from 'utils';
import EyeIcon from 'assets/icons/eye-icon.svg';
import TimeIcon from 'assets/icons/time-icon.svg';
import ArticleRedux from 'redux/article';
import GlobalRedux from 'redux/global';
import { ROUTES } from 'constants/routes';
import AnswerItem from 'containers/Forum/Answer';
import CommentBox from 'containers/Forum/CommentBox';
import {
  Article,
  ArticleCategory,
  Answer,
  Comment,
  ServerError,
} from 'interfaces';
import TopArticles from './TopArticles';
import CarouselItems from './CarouselItems';
import { ANSWER_TYPE, ARTICLE_TYPE } from 'constants/app';
import {
  navigateToAcademyArticle,
  navigateToNewsArticle,
} from 'utils/tracking';

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
    carouselWrapper: {
      marginLeft: '-12px',
      marginRight: '-12px',
      [theme.breakpoints.down('xs')]: {
        marginLeft: '-6px',
        marginRight: '-6px',
      },
    },
  })
);

const ArticleDetail: React.FC = () => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const router = useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  const deleteConfirmRef = useRef<Handle>();
  const [
    anchorCommentContextMenuEl,
    setAnchorCommentContextMenuEl,
  ] = useState<null | HTMLElement>(null);
  const [commentContextAction, setCommentContextAction] = useState<{
    requestEdit: () => void;
    answer?: Answer;
    comment?: Comment;
  } | null>(null);
  const isOpenCommentContextMenu = Boolean(anchorCommentContextMenuEl);
  const [carousel, setCarousel] = useState<Carousel | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const article = useSelector((state) => state.article.data);
  const isLoadingStatus = useSelector((state) => state.article.isLoading);
  const isProcessing = useSelector((state) => state.article.isProcessing);
  const currentUser = useSelector((state) => state.user.currentUser);
  const liked =
    article &&
    currentUser &&
    currentUser.likedArticles.indexOf(article.id) >= 0;

  const articleCategory = article?.articleCategory as ArticleCategory;

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
    if (article) {
      setIsLoading(true);
      dispatch(
        ArticleRedux.actions.getMoreAnswers({
          createdAt: first(article?.answers)?.createdAt as string,
          articleId: article.id,
          callback: () => setIsLoading(false),
        })
      );
    }
  }, [article]);

  const reactArticle = useCallback(() => {
    if (!currentUser) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (currentUser && article) {
      dispatch(
        ArticleRedux.actions.reactArticle({
          user: currentUser.id,
          article: article.id,
          like: !liked,
        })
      );
    }
  }, [currentUser, article]);

  const reactAnswer = useCallback(
    (answer, like) => {
      if (!currentUser) {
        router.push(ROUTES.LOGIN);
        return;
      }
      if (currentUser) {
        dispatch(
          ArticleRedux.actions.reactAnswer({
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
          ArticleRedux.actions.reactComment({
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
        ArticleRedux.actions.deleteAnswer({
          ...commentContextAction?.answer,
          callback,
        })
      );
    } else if (commentContextAction?.comment) {
      dispatch(
        ArticleRedux.actions.deleteComment({
          ...commentContextAction?.comment,
          callback,
        })
      );
    }
  };

  const breadcrumbs = useMemo(
    () =>
      article
        ? [
          {
            text: article.type === ARTICLE_TYPE.NEWS ? 'Tin tức' : 'Academy',
            url: article.type === ARTICLE_TYPE.NEWS ? '/news' : '/academy',
          },
          {
            text: (article?.articleCategory as ArticleCategory)?.name,
            url: `/${article.type}/category/${(article?.articleCategory as ArticleCategory)?.slug
              }`,
          },
        ]
        : [],
    [article]
  );

  const onCreateAnswerSuccess = (id: string) => {
    const elmnt = document.getElementById(id);
    elmnt?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (article) {
      const trackingAction =
        article.type === ARTICLE_TYPE.NEWS
          ? navigateToNewsArticle
          : navigateToAcademyArticle;
      trackingAction({
        id: article.id,
        title: article.title,
        slug: article.slug,
      });
    }
  }, [article]);

  useEffect(() => {
    if ((!article || !article.id) && !isLoadingStatus) {
      router.replace('/404');
    }
  }, []);

  return (
    <React.Fragment>
      {article && (
        <SEOTags
          seoTitle={article.seoTitle || `${article.title} | TraderHub`}
          seoDescription={article.seoDescription || article.description}
          seoImg={article.seoImg || article.thumbnail}
        />
      )}
      <Grid container spacing={isMobile ? 0 : 2}>
        <Grid item xs={12} sm={12} md={8}>
          {!article ? (
            <ArticleSkeleton size={isMobile ? 'small' : 'medium'} />
          ) : (
            <React.Fragment>
              <Paper elevation={0}>
                <Box display="block" mb={1.5}>
                  <Typography variant="h5" component="h1" color="textSecondary">
                    {article?.title}
                  </Typography>
                  <TBreadcrumbs
                    className={classes.breadcrumbs}
                    links={breadcrumbs}
                  />
                </Box>
                <TBox>
                  <Box display="flex" justifyContent="space-between" mb={1.5}>
                    <Box display="flex" alignItems="center">
                      <Box display="block" flex={1}>
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
                          {moment(article?.createdAt).format('LLL')}
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
                      <Box display="flex" alignItems="center" mr={0.5}>
                        <SvgIcon
                          classes={{ root: classes.icon }}
                          component={EyeIcon}
                          width={16}
                          height={16}
                          viewBox="0 0 16 16"
                        />
                        {formatNumber(article?.totalView)}
                      </Box>
                    </Box>
                  </Box>
                  {article.toc && <TableOfContent toc={article.toc} />}
                  <Box fontSize="body1.fontSize">
                    <div
                      className={`${classes.content} ck-content`}
                      dangerouslySetInnerHTML={{
                        __html: article?.content,
                      }}
                    />
                  </Box>
                  <Button
                    classes={{ root: classes.actionBtn }}
                    disableTouchRipple
                    variant="text"
                    onClick={reactArticle}
                    startIcon={
                      liked ? (
                        <Favorite color="primary" />
                      ) : (
                        <FavoriteBorderOutlined />
                      )
                    }
                  >
                    {`${article.totalLike ? formatNumber(article.totalLike) : ''
                      } Thích`}
                  </Button>
                </TBox>
                <TBox>
                  <CommentBox
                    articleId={article?.id}
                    answerType={ANSWER_TYPE.ARTICLE}
                    key={article?.id}
                    onCreateSuccess={onCreateAnswerSuccess}
                  />
                  {!isLoading &&
                    article.totalAnswer > (article.answers?.length || 0) && (
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
                  {article?.answers?.map((answer) => (
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
        <Grid item xs={12} sm={12} md={4}>
          <Paper elevation={0}>
            {!!article?.articleCategory && (
              <TopArticles
                title="Cùng chủ đề"
                articles={articleCategory.articles || []}
                buttonLink={`/${article.type}/category/${articleCategory.slug}`}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
      {!isEmpty(article?.relatedArticles) && (
        <Box>
          <Box width={1} display="flex" justifyContent="space-between" pb={0.5}>
            <Typography variant="h5" color="textSecondary">
              Xem gì tiếp theo
            </Typography>
            <Box display="flex">
              <IconButton
                size="small"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={() => carousel && carousel.slidePrev()}
              >
                <ArrowBack />
              </IconButton>
              <IconButton
                size="small"
                edge="end"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onClick={() => carousel && carousel.slideNext()}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Box>
          <div className={classes.carouselWrapper}>
            <CarouselItems
              articles={article?.relatedArticles as Article[]}
              setCarousel={setCarousel}
            />
          </div>
        </Box>
      )}
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

export default ArticleDetail;
