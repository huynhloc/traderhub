import React, { useCallback, useEffect, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Menu, MenuItem } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmDialog, ForumItemSkeleton } from 'components';
import { ForumQuestion, ServerError } from 'interfaces';
import { deleteForumQuestionApi, getMyForumQuestionsApi } from 'api/forumApis';
import { Handle } from 'components/ConfirmDialog';
import QuestionItem from '../Forum/QuestionItem';
import { getServerErrorMessage } from 'utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    contextMenuItem: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
);

const PostActivities: React.FC = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState<ForumQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const deleteConfirmRef = useRef<Handle>();
  const [isProcessing, setIsProcessing] = useState(false);

  const [
    anchorContextMenuEl,
    setAnchorContextMenuEl,
  ] = useState<null | HTMLElement>(null);
  const [contextMenuPayload, setContextMenuPayload] = useState<{
    question?: ForumQuestion;
  } | null>(null);

  const isOpenContextMenu = Boolean(anchorContextMenuEl);

  const openContextMenu = (
    event: React.MouseEvent<HTMLElement>,
    payload: {
      question?: ForumQuestion;
    }
  ) => {
    setContextMenuPayload(payload);
    setAnchorContextMenuEl(event.currentTarget);
  };

  const closeContextMenu = () => {
    setAnchorContextMenuEl(null);
  };

  const deleteForumQuestion = async () => {
    if (contextMenuPayload?.question?.id) {
      try {
        setIsProcessing(true);
        const data = await deleteForumQuestionApi({
          id: contextMenuPayload?.question?.id,
        });
        const response = (data as unknown) as ForumQuestion;
        const newQuestions = questions.filter(
          (question) => question.id !== response.id
        );
        setQuestions(newQuestions);
        toast.success('Xoá thành công.');
      } catch (error) {
        toast.error(getServerErrorMessage(error as ServerError[]));
      } finally {
        deleteConfirmRef?.current?.handleClose();
        setIsProcessing(false);
      }
    }
  };

  const loadQuestions = async (start: number) => {
    try {
      setIsLoading(true);
      const data = await getMyForumQuestionsApi(start);
      const response = (data as unknown) as ForumQuestion[];
      setHasMore(response.length === 10);
      if (start === 0) {
        setQuestions(response);
      } else {
        setQuestions([...questions, ...response]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions(0);
  }, []);

  const loadMoreQuestions = useCallback(() => {
    loadQuestions(questions.length);
  }, [questions]);

  return (
    <React.Fragment>
      {isLoading && !questions?.length && <ForumItemSkeleton showAvatar />}
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={loadMoreQuestions}
        hasMore={hasMore && !isLoading}
        loader={<ForumItemSkeleton key={0} showAvatar />}
      >
        {questions ? (
          questions
            .filter((question) => !!question)
            .map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
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
              action: deleteForumQuestion,
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

export default PostActivities;
