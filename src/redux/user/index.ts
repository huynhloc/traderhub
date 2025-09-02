import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ForgotPasswordParams,
  LoginParams,
  ResetPasswordParams,
  SendEmailConfirmationParams,
  SigunUpParams,
  UpdateAvatarParams,
  UpdateMeParams,
} from 'api/userApis';
import ForumQuestionRedux from 'redux/forumQuestion';
import ArticleRedux from 'redux/article';
import { User, CallBack } from 'interfaces';
import { AnswerReactionParams } from 'api/answerApis';
import { CommentReactionParams } from 'api/commentApis';
import { userLike, userUnlike } from 'utils/tracking';

type StateType = {
  isProcessing: boolean;
  currentUser?: User;
  error: unknown;
};

const initialState: StateType = {
  isProcessing: false,
  currentUser: undefined,
  error: undefined,
};

const reactAnswer = (state: StateType, payload: AnswerReactionParams) => {
  if (state.currentUser) {
    const { like, forumAnswer } = payload;
    if (!state.currentUser.likedAnswers) {
      state.currentUser.likedAnswers = [];
    }
    const index = state.currentUser.likedAnswers.indexOf(forumAnswer);
    if (like && index < 0) {
      state.currentUser.likedAnswers.push(forumAnswer);
      userLike({ email: state.currentUser.email, answer: forumAnswer });
    }
    if (!like && index >= 0) {
      state.currentUser.likedAnswers.splice(index, 1);
      userUnlike({ email: state.currentUser.email, answer: forumAnswer });
    }
  }
};

const reactComment = (state: StateType, payload: CommentReactionParams) => {
  if (state.currentUser) {
    const { like, forumComment } = payload;
    if (!state.currentUser.likedComments) {
      state.currentUser.likedComments = [];
    }
    const index = state.currentUser.likedComments.indexOf(forumComment);
    if (like && index < 0) {
      state.currentUser.likedComments.push(forumComment);
      userLike({ email: state.currentUser.email, comment: forumComment });
    }
    if (!like && index >= 0) {
      state.currentUser.likedComments.splice(index, 1);
      userUnlike({ email: state.currentUser.email, comment: forumComment });
    }
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signup: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & SigunUpParams>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    signupSuccess: (state) => ({
      ...state,
      isProcessing: false,
    }),
    signupFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    login: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & LoginParams>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    loginWithFacebook: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & { accessToken: string }>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    loginWithGoogle: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & { accessToken: string }>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    loginSuccess: (state, { payload }) => ({
      ...state,
      currentUser: payload,
      isProcessing: false,
    }),
    loginFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    forgotPassword: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & ForgotPasswordParams>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    forgotPasswordSuccess: (state) => ({
      ...state,
      isProcessing: false,
    }),
    forgotPasswordFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    sendEmailConfirmation: (
      state,
      _action: PayloadAction<
        { callback?: CallBack } & SendEmailConfirmationParams
      >
    ) => ({ ...state, error: undefined, isProcessing: true }),
    sendEmailConfirmationSuccess: (state) => ({
      ...state,
      isProcessing: false,
    }),
    sendEmailConfirmationFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    resetPassword: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & ResetPasswordParams>
    ) => ({ ...state, error: undefined, isProcessing: true }),
    resetPasswordSuccess: (state) => ({
      ...state,
      isProcessing: false,
    }),
    resetPasswordFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    fetchCurrentUser: (state) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    fetchCurrentUserSuccess: (state, { payload }) => ({
      ...state,
      currentUser: { ...state.currentUser, ...payload },
      isProcessing: false,
    }),
    fetchCurrentUserFail: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    updateMe: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & UpdateMeParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    updateMeSuccess: (state, { payload }) => ({
      ...state,
      currentUser: { ...state.currentUser, ...payload },
      isProcessing: false,
    }),
    updateMeFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    changePass: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & UpdateMeParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    changePassSuccess: (state) => ({
      ...state,
      currentUser: { ...state.currentUser, hasPass: true } as User,
      isProcessing: false,
    }),
    changePassFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    updateAvatar: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & UpdateAvatarParams>
    ) => ({
      ...state,
      error: undefined,
      isProcessing: true,
    }),
    updateAvatarSuccess: (state, { payload }) => {
      const user = state.currentUser as User;
      state.isProcessing = false;
      user.avatar.url = payload[0].url as string;
      user.avatar.id = payload[0].id as string;
    },
    updateAvatarFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
    logout: () => initialState,
  },
  extraReducers: {
    [ForumQuestionRedux.actions.reactForumQuestion.type]: (
      state,
      { payload }
    ) => {
      if (state.currentUser) {
        const { like, forumQuestion } = payload;
        if (!state.currentUser.likedForumQuestions) {
          state.currentUser.likedForumQuestions = [];
        }
        const index = state.currentUser.likedForumQuestions.indexOf(
          forumQuestion
        );
        if (like && index < 0) {
          state.currentUser.likedForumQuestions.push(forumQuestion);
          userLike({ email: state.currentUser.email, forumQuestion });
        }
        if (!like && index >= 0) {
          state.currentUser.likedForumQuestions.splice(index, 1);
          userUnlike({ email: state.currentUser.email, forumQuestion });
        }
      }
    },
    [ArticleRedux.actions.reactArticle.type]: (state, { payload }) => {
      if (state.currentUser) {
        const { like, article } = payload;
        if (!state.currentUser.likedArticles) {
          state.currentUser.likedArticles = [];
        }
        const index = state.currentUser.likedArticles.indexOf(article);
        if (like && index < 0) {
          state.currentUser.likedArticles.push(article);
          userLike({ email: state.currentUser.email, article });
        }
        if (!like && index >= 0) {
          state.currentUser.likedArticles.splice(index, 1);
          userUnlike({ email: state.currentUser.email, article });
        }
      }
    },
    [ForumQuestionRedux.actions.reactAnswer.type]: (state, { payload }) => {
      reactAnswer(state, payload);
    },
    [ArticleRedux.actions.reactAnswer.type]: (state, { payload }) => {
      reactAnswer(state, payload);
    },
    [ForumQuestionRedux.actions.reactComment.type]: (state, { payload }) => {
      reactComment(state, payload);
    },
    [ArticleRedux.actions.reactComment.type]: (state, { payload }) => {
      reactComment(state, payload);
    },
  },
});

export default userSlice;
