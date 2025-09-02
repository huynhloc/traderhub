import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Popover,
  Avatar,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
  Send,
  Mood as MoodIcon,
  Image as ImageIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { CircularProgress } from 'components';
import ForumQuestionRedux from 'redux/forumQuestion';
import ArticleRedux from 'redux/article';
import { ROUTES } from 'constants/routes';
import { Answer, Comment, TFile } from 'interfaces';
import { ANSWER_TYPE } from 'constants/app';
import { userMention } from 'utils/tracking';

export function getName(str: string) {
  return Date.now() + str.slice(str.lastIndexOf('.'));
}

const EmojiPicker = dynamic(async () => import('emoji-picker-react'), {
  ssr: false,
});
const ImageOptimizer = dynamic(
  async () => import('components/ImageOptimizer'),
  {
    ssr: false,
  }
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contentBox: {
      borderRadius: '0px 8px 8px 8px',
    },
    sendBtn: {
      padding: theme.spacing(1),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(0.625),
      },
    },
    input: {
      flex: 1,
      padding: theme.spacing(1),
      fontSize: theme.typography.fontSize,
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.typography.caption.fontSize,
        padding: theme.spacing(0.625),
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
    circularProgress: {
      color: `${theme.palette.primary.dark} !important`,
    },
  })
);

const CommentBox: React.FC<{
  answerType: string;
  questionId?: string; // create answer for forum question
  articleId?: string; // cretae answer for article
  answerId?: string; // create comment for answer
  tags?: { userId: string; name: string }[];
  answer?: Answer; // update case
  comment?: Comment; // update case
  cancelEdit?: () => void;
  onCreateSuccess?: (id: string) => void;
}> = ({
  answerType,
  questionId,
  articleId,
  answerId,
  tags,
  answer,
  comment,
  cancelEdit,
  onCreateSuccess,
}) => {
  const theme = useTheme<Theme>();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const router = useRouter();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>();
  const classes = useStyles();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<TFile[]>([]);
  const [file, setFile] = useState<File | null>();
  const [anchorEmojiEl, setAnchorEmojiEl] = useState<null | HTMLElement>(null);
  const isOpenEmoji = Boolean(anchorEmojiEl);
  const [isProcessing, setIsProcessing] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  const isUpdate = Boolean(answer) || Boolean(comment);

  let timer: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    // handle only for nested comment box
    if (answerId) {
      if (tags && !isEmpty(tags)) {
        const mentionStr = tags.map((user) => user.name).join(' ') + ' ';
        setContent(mentionStr);
      } else {
        setContent('');
      }
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    // case update
    if (isUpdate) {
      setContent((answer?.content || comment?.content) as string);
      const existedImgs = answer?.images || comment?.images;
      if (existedImgs && !isEmpty(existedImgs)) {
        setImages([{ url: existedImgs[0].url }]);
      }
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [answerId, tags]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setContent(e.target.value);
  };

  const openEmojiPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEmojiEl(event.currentTarget);
  };

  const closeEmojiPopover = () => {
    setAnchorEmojiEl(null);
  };

  const onEmojiClick = (_: unknown, emojiObject: { emoji: string }) => {
    closeEmojiPopover();
    setContent(`${content}${emojiObject.emoji}`);
  };

  const handleOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (isEmpty(target.files)) {
      return;
    }
    setFile((target.files || [])[0]);
  };

  const onFileResized = (tFile: TFile) => setImages([tFile]);
  const onFileRemoved = () => {
    setImages([]);
    setFile(null);
  };

  const handleSubmit = () => {
    if (!currentUser) {
      router.push(ROUTES.LOGIN);
      return;
    }
    if (!content && isEmpty(images)) {
      return;
    }
    setIsProcessing(true);
    const callback = (error: unknown, data: unknown) => {
      setIsProcessing(false);
      if (!error && data) {
        setContent('');
        setFile(null);
        setImages([]);
        onCreateSuccess && onCreateSuccess((data as { id: string }).id);
      }
    };

    if (answerId) {
      const finalTags = tags?.filter((tagged) =>
        content.includes(`${tagged.name} `)
      );

      const createCommentAction =
        answerType === ANSWER_TYPE.ARTICLE
          ? ArticleRedux.actions.createComment
          : ForumQuestionRedux.actions.createComment;

      dispatch(
        createCommentAction({
          forumAnswer: answerId as string,
          content,
          images,
          tags: finalTags,
          callback,
        })
      );
      userMention({ email: currentUser.email, mentions: finalTags });
    } else {
      const createAnswerAction =
        answerType === ANSWER_TYPE.ARTICLE
          ? ArticleRedux.actions.createAnswer
          : ForumQuestionRedux.actions.createAnswer;
      const payload =
        answerType === ANSWER_TYPE.ARTICLE
          ? {
              article: articleId as string,
            }
          : {
              forumQuestion: questionId as string,
            };
      dispatch(
        createAnswerAction({
          ...payload,
          content,
          images,
          type: answerType,
          callback,
        })
      );
    }
  };

  const handleUpdate = () => {
    if (!content && isEmpty(images)) {
      return;
    }
    setIsProcessing(true);
    const callback = (error: unknown, data: unknown) => {
      setIsProcessing(false);
      if (!error && data) {
        setContent('');
        setFile(null);
        setImages([]);
        cancelEdit && cancelEdit();
      }
    };
    if (comment) {
      // update comment
      const finalTags = tags?.filter((tagged) =>
        content.includes(`${tagged.name} `)
      );

      const updateCommentAction =
        answerType === ANSWER_TYPE.ARTICLE
          ? ArticleRedux.actions.updateComment
          : ForumQuestionRedux.actions.updateComment;

      dispatch(
        updateCommentAction({
          id: comment.id,
          forumAnswer: comment.answer as string,
          content,
          images,
          tags: finalTags,
          callback,
        })
      );
    } else if (answer) {
      const updateAnswerAction =
        answerType === ANSWER_TYPE.ARTICLE
          ? ArticleRedux.actions.updateAnswer
          : ForumQuestionRedux.actions.updateAnswer;

      dispatch(
        updateAnswerAction({
          id: answer.id,
          content,
          images,
          callback,
        })
      );
    }
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box borderRadius="50%" mr={isMobile ? 0.5 : 1}>
        <Avatar
          classes={{
            root: classes.avatar,
            fallback: classes.fallbackIcon,
          }}
          src={currentUser?.avatar?.url}
          alt={currentUser?.fullName}
        />
      </Box>
      <Box
        flex={1}
        mb={isMobile ? 0.75 : 1}
        bgcolor="background.default"
        className={classes.contentBox}
      >
        <Box
          flex={1}
          display="flex"
          flexDirection="row"
          alignItems="flex-start"
        >
          <InputBase
            inputRef={inputRef}
            multiline
            fullWidth
            margin="none"
            placeholder="Viết bình luận..."
            classes={{
              root: classes.input,
            }}
            value={content}
            onChange={handleTextChange}
          />
          {!isUpdate && (
            <IconButton
              classes={{
                root: classes.sendBtn,
              }}
              aria-label="send"
              color="inherit"
              disabled={isProcessing}
              onClick={handleSubmit}
            >
              {isProcessing ? (
                <CircularProgress
                  classes={{
                    root: classes.circularProgress,
                  }}
                />
              ) : (
                <Send fontSize={isMobile ? 'small' : 'default'} />
              )}
            </IconButton>
          )}
        </Box>
        <Box px={isMobile ? 0.625 : 1}>
          <Box>
            {file && (
              <ImageOptimizer
                file={file}
                onResized={onFileResized}
                onRemove={onFileRemoved}
              />
            )}
            {!!images[0]?.url && (
              <Box>
                <Box
                  position="relative"
                  width="100px"
                  bgcolor="background.default"
                >
                  <Image
                    width="100px"
                    height="100px"
                    objectFit="cover"
                    src={images[0].url}
                    alt="traderhub"
                  />
                  <Box
                    position="absolute"
                    top={0}
                    right={0}
                    bgcolor="common.white"
                  >
                    <IconButton
                      size="small"
                      aria-label="close"
                      onClick={onFileRemoved}
                    >
                      <CloseIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              <IconButton
                edge="start"
                aria-label="emoji"
                color="inherit"
                onClick={openEmojiPopover}
              >
                <MoodIcon fontSize={isMobile ? 'small' : 'default'} />
              </IconButton>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id={`icon-button-file-${isUpdate}-${questionId}-${answerId}-${answer?.id}-${comment?.id}`}
                type="file"
                onChange={handleOpenFile}
              />
              <label
                htmlFor={`icon-button-file-${isUpdate}-${questionId}-${answerId}-${answer?.id}-${comment?.id}`}
              >
                <IconButton
                  size="small"
                  aria-label="upload picture"
                  component="span"
                >
                  <ImageIcon fontSize={isMobile ? 'small' : 'default'} />
                </IconButton>
              </label>
            </div>
            {isUpdate && (
              <div>
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={cancelEdit}
                >
                  Huỷ
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={isProcessing}
                  onClick={handleUpdate}
                >
                  {isProcessing && <CircularProgress />}
                  Cập nhật
                </Button>
              </div>
            )}
          </Box>
        </Box>
      </Box>
      <Popover
        id="emoji-popover"
        open={isOpenEmoji}
        anchorEl={anchorEmojiEl}
        keepMounted
        onClose={closeEmojiPopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <EmojiPicker onEmojiClick={onEmojiClick} />
      </Popover>
    </Box>
  );
};

export default CommentBox;
