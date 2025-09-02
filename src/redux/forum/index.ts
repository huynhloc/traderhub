import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuestionParams } from 'api/forumApis';
import { CallBack, ForumCategory, ForumHashtag } from 'interfaces';

type StateType = {
  isLoading: boolean;
  isProcessing: boolean;
  data: ForumCategory[];
  topHashtags: ForumHashtag[];
  allCategories?: ForumCategory[]; // will be loaded only on client
  allHashtags?: ForumHashtag[]; // will be loaded only on client
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  isProcessing: false,
  data: [],
  topHashtags: [],
  allCategories: undefined,
  allHashtags: undefined,
  error: null,
};

const userSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    getForumData: (state) => ({
      ...state,
      error: null,
      isLoading: true,
    }),
    getForumDataSuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getForumDataFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    getForumCategories: (state) => ({
      ...state,
      error: null,
    }),
    getForumCategoriesSuccess: (state, { payload }) => ({
      ...state,
      allCategories: payload,
    }),
    getForumCategoriesFailure: (state, { payload }) => ({
      ...state,
      error: payload,
    }),
    getForumHashtags: (state) => ({
      ...state,
      error: null,
    }),
    getForumHashtagsSuccess: (state, { payload }) => ({
      ...state,
      allHashtags: payload,
    }),
    getForumHashtagsFailure: (state, { payload }) => ({
      ...state,
      error: payload,
    }),
    getTopForumHashtags: (state) => ({
      ...state,
      error: null,
    }),
    getTopForumHashtagsSuccess: (state, { payload }) => ({
      ...state,
      topHashtags: payload,
    }),
    getTopForumHashtagsFailure: (state, { payload }) => ({
      ...state,
      error: payload,
    }),
    createForumQuestion: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & QuestionParams>
    ) => ({
      ...state,
      error: null,
      isProcessing: true,
    }),
    createForumQuestionSuccess: (state, _action) => ({
      ...state,
      isProcessing: false,
    }),
    createForumQuestionFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    updateForumQuestion: (
      state,
      _action: PayloadAction<{ callback?: CallBack } & QuestionParams>
    ) => ({
      ...state,
      error: null,
      isProcessing: true,
    }),
    updateForumQuestionSuccess: (state, _action) => ({
      ...state,
      isProcessing: false,
    }),
    updateForumQuestionFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isProcessing: false,
    }),
    resetError: (state) => ({ ...state, error: null }),
  },
});

export default userSlice;
