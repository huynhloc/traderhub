import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmDialog, ForumItemSkeleton } from 'components';
import { Answer, Comment, ServerError } from 'interfaces';
import { getMyAnswersApi, getMyCommentsApi } from 'api/forumApis';
import CommentItem from './CommentItem';
import { Handle } from 'components/ConfirmDialog';
import { getServerErrorMessage } from 'utils';
import { Menu, MenuItem } from '@material-ui/core';
import { deleteAnswerApi } from 'api/answerApis';
import { deleteCommentApi } from 'api/commentApis';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contextMenuItem: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const AnswerActivities: React.FC = () => {
  const classes = useStyles();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreAnswer, setHasMoreAnswer] = useState(false);
  const [hasMoreComment, setHasMoreComment] = useState(false);
  const deleteConfirmRef = useRef<Handle>();
  const [isProcessing, setIsProcessing] = useState(false);

  const [
    anchorContextMenuEl,
    setAnchorContextMenuEl,
  ] = useState<null | HTMLElement>(null);
  const [contextMenuPayload, setContextMenuPayload] = useState<{
    answer?: Answer;
    comment?: Comment;
  } | null>(null);

  const isOpenContextMenu = Boolean(anchorContextMenuEl);

  const openContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    payload: {
      answer?: Answer;
      comment?: Comment;
    }
  ) => {
    setContextMenuPayload(payload);
    setAnchorContextMenuEl(event.currentTarget);
  };

  const closeContextMenu = () => {
    setAnchorContextMenuEl(null);
  };

  const deleteComment = async () => {
    if (contextMenuPayload?.answer?.id) {
      try {
        setIsProcessing(true);
        const data = await deleteAnswerApi({
          id: contextMenuPayload?.answer?.id,
        });
        const response = (data as unknown) as Answer;
        const newAnswers = answers.filter(
          (answer) => answer.id !== response.id
        );
        setAnswers(newAnswers);
        toast.success('Xoá thành công.');
      } catch (error) {
        toast.error(getServerErrorMessage(error as ServerError[]));
      } finally {
        deleteConfirmRef?.current?.handleClose();
        setIsProcessing(false);
      }
    } else if (contextMenuPayload?.comment?.id) {
      try {
        setIsProcessing(true);
        const data = await deleteCommentApi({
          id: contextMenuPayload?.comment?.id,
        });
        const response = (data as unknown) as Comment;
        const newComments = comments.filter(
          (comment) => comment.id !== response.id
        );
        setComments(newComments);
        toast.success('Xoá thành công.');
      } catch (error) {
        toast.error(getServerErrorMessage(error as ServerError[]));
      } finally {
        deleteConfirmRef?.current?.handleClose();
        setIsProcessing(false);
      }
    }
  };

  const loadData = async (isRefresh = false) => {
    const promises: Promise<Answer[] | Comment[] | null>[] = [];
    if (isRefresh) {
      promises.push(getMyAnswersApi(0));
      promises.push(getMyCommentsApi(0));
    } else {
      if (hasMoreAnswer) {
        promises.push(getMyAnswersApi(answers.length));
      } else {
        promises.push(Promise.resolve(null));
      }
      if (hasMoreComment) {
        promises.push(getMyCommentsApi(comments.length));
      } else {
        promises.push(Promise.resolve(null));
      }
    }

    return Promise.all(promises);
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    try {
      setIsLoading(true);
      const [listAnswer, listComment] = await loadData(true);
      if (listAnswer) {
        setHasMoreAnswer(listAnswer.length === 10);
        setAnswers(listAnswer as Answer[]);
      }
      if (listComment) {
        setHasMoreComment(listComment.length === 10);
        setComments(listComment as Comment[]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [listAnswer, listComment] = await loadData(false);
      if (listAnswer) {
        setHasMoreAnswer(listAnswer.length === 10);
        setAnswers([...answers, ...(listAnswer as Answer[])]);
      }
      if (listComment) {
        setHasMoreComment(listComment.length === 10);
        setComments([...comments, ...(listComment as Comment[])]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [answers, comments]);

  const items = useMemo(() => {
    const result = [...answers, ...comments];
    result.sort((item1, item2) =>
      item1.createdAt >= item2.createdAt ? -1 : 1
    );
    return result;
  }, [answers, comments]);

  return (
    <React.Fragment>
      {isLoading && !answers?.length && <ForumItemSkeleton showAvatar />}
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadMoreData}
        hasMore={(hasMoreAnswer || hasMoreComment) && !isLoading}
        loader={<ForumItemSkeleton key={0} showAvatar />}
      >
        {items ? (
          items
            .filter((item) => !!item)
            .map((item) => (
              <CommentItem
                key={item.id}
                {...((item as Answer).type && { answer: item as Answer })}
                {...(!(item as Answer).type && { comment: item as Comment })}
                requestOpenContextMenu={openContextMenu}
              />
            ))
        ) : (
          <div />
        )}
      </InfiniteScroll>
      <Menu
        id="context-menu"
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
        <MenuItem
          classes={{ gutters: classes.contextMenuItem }}
          onClick={() => {
            closeContextMenu();
            deleteConfirmRef?.current?.confirm({
              content: 'Bạn muốn xoá?',
              action: deleteComment,
            });
          }}
        >
          Xoá
        </MenuItem>
      </Menu>
      <ConfirmDialog ref={deleteConfirmRef} isProcessing={isProcessing} />
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

export default AnswerActivities;
