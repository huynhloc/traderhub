import { createSlice } from '@reduxjs/toolkit';
import { ArticleCategory, Article } from 'interfaces';

type StateType = {
  isLoading: boolean;
  isProcessing: boolean;
  data: {
    articles?: Article[];
    totalArticle?: number;
  };
  allCategories?: ArticleCategory[];
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  isProcessing: false,
  data: {},
  allCategories: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    getNewsData: (state) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getNewsDataSuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getNewsDataFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    getNewsCategories: (state) => ({
      ...state,
      error: null,
    }),
    getNewsCategoriesSuccess: (state, { payload }) => ({
      ...state,
      allCategories: payload,
    }),
    getNewsCategoriesFailure: (state, { payload }) => ({
      ...state,
      error: payload,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
