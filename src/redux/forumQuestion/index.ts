import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerParams, AnswerReactionParams } from 'api/answerApis';
import { CommentParams, CommentReactionParams } from 'api/commentApis';
import { QuestionReactionParams } from 'api/forumApis';
import { CallBack, Answer, Comment, ForumQuestion } from 'interfaces';
import ForumRedux from 'redux/forum';

type StateType = {
  isLoading: boolean;
  isProcessing: boolean;
  data?: ForumQuestion;
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  isProcessing: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'forumQuestion',
  initialState,
  reducers: {
    getForumQuestion: (state, { payload }: PayloadAction<string>) => ({
      ...state,
      error: undefined,
      isLoading: true,
      data: state.data?.slug === payload ? state.data : undefined,
    }),
    getForumQuestionSuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getForumQuestionFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    getMoreAnswers: (
      state,
      _action: PayloadAction<{
        callback?: CallBack;
        createdAt: string;
        forumQuestionId: string;
      }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getMoreAnswersSuccess: (state, { payload }: PayloadAction<Answer[]>) => ({
      ...state,
      data: {
        ...state.data,
        answers: [...payload, ...(state.data?.answers || [])],
      } as ForumQuestion,
      isLoading: false,
    }),
    getMoreAnswersFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    getMoreComments: (
      state,
      _action: PayloadAction<{
        callback?: CallBack;
        createdAt: string;
        answerId: string;
      }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getMoreCommentsSuccess: (
      state,
      { payload }: PayloadAction<{ answer: string; comments: Comment[] }>
    ) => {
      const answer = state.data?.answers?.find(
        (answer) => answer.id === payload.answer
      ) as Answer;
      answer.comments = [...payload.comments, ...(answer.comments || [])];
      state.isLoading = false;
    },
    getMoreCommentsFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    createAnswer: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & AnswerParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    createAnswerSuccess: (state, { payload }) => {
      const data = state.data as ForumQuestion;
      state.isProcessing = false;
      data.totalAnswer = data.totalAnswer + 1;
      data.answers = [...(state.data?.answers || []), payload];
    },
    createAnswerFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    updateAnswer: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & AnswerParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    updateAnswerSuccess: (state, { payload }) => {
      const answers = state.data?.answers;
      const answer = answers?.find(({ id }) => id === payload.id);
      if (!answer) return state;
      answer.content = payload.content;
      answer.images = payload.images;
      state.isProcessing = false;
    },
    updateAnswerFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    createComment: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & CommentParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    createCommentSuccess: (state, { payload }) => {
      const answer = state.data?.answers?.find(
        (answer) => answer.id === payload.answer
      ) as Answer;
      answer.totalComment = answer.totalComment + 1;
      answer.comments = [...(answer.comments || []), payload];
      state.isProcessing = false;
    },
    createCommentFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    updateComment: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & CommentParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    updateCommentSuccess: (state, { payload }) => {
      const answer = state.data?.answers?.find(
        ({ id }) => id === payload.answer
      );
      if (!answer) return state;
      const comment = answer.comments?.find(({ id }) => id === payload.id);
      if (!comment) return state;

      comment.tags = payload.tags;
      comment.content = payload.content;
      comment.images = payload.images;
      state.isProcessing = false;
    },
    updateCommentFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    reactForumQuestion: (
      state,
      { payload }: PayloadAction<QuestionReactionParams>
    ) => {
      (state.data as ForumQuestion).totalLike += payload.like ? 1 : -1;
    },
    reactAnswer: (state, { payload }: PayloadAction<AnswerReactionParams>) => {
      const answer = state.data?.answers?.find(
        (answer) => answer.id === payload.forumAnswer
      ) as Answer;
      answer.totalLike += payload.like ? 1 : -1;
    },
    reactComment: (
      state,
      { payload }: PayloadAction<{ answer: string } & CommentReactionParams>
    ) => {
      const answer = state.data?.answers?.find(
        (answer) => answer.id === payload.answer
      ) as Answer;
      const comment = answer.comments?.find(
        (comment) => comment.id === payload.forumComment
      ) as Comment;
      comment.totalLike += payload.like ? 1 : -1;
    },
    deleteForumQuestion: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & ForumQuestion>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    deleteForumQuestionSuccess: (state, { payload }) => {
      if (payload.id === state.data?.id) {
        state.data = undefined;
      }
      state.isProcessing = false;
    },
    deleteForumQuestionFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    deleteAnswer: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & Answer>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    deleteAnswerSuccess: (state, { payload }) => {
      const data = state.data as ForumQuestion;
      const answers = data.answers || [];
      const answerIndex = answers.findIndex(({ id }) => id === payload.id);
      if (answerIndex < 0) return state;
      data.totalAnswer = data.totalAnswer - 1;
      answers?.splice(answerIndex, 1);
      state.isProcessing = false;
    },
    deleteAnswerFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    deleteComment: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & Comment>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    deleteCommentSuccess: (state, { payload }) => {
      const answer = state.data?.answers?.find(
        ({ id }) => id === payload.answer
      );
      if (!answer) return state;
      const comments = answer.comments || [];
      const commentIndex = comments.findIndex(({ id }) => id === payload.id);
      if (commentIndex < 0) return state;

      comments.splice(commentIndex, 1);
      answer.totalComment = answer.totalComment - 1;
      state.isProcessing = false;
    },
    deleteCommentFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
  },
  extraReducers: {
    [ForumRedux.actions.updateForumQuestionSuccess.type]: (
      state,
      { payload }
    ) => {
      if (state.data?.id === payload.id) {
        state.data = {
          ...state.data,
          ...payload,
        };
      }
    },
  },
});

export default userSlice;
