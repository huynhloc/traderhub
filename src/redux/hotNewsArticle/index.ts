import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { Article } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: {
    articles?: Article[];
    totalArticle?: number;
  };
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'hotNewsArticle',
  initialState,
  reducers: {
    getArticles: (
      state,
      _action: PayloadAction<{ page: number; res?: ServerResponse }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getArticlesSuccess: (
      state,
      {
        payload,
      }: PayloadAction<{
        articles?: Article[];
        totalArticle?: number;
      }>
    ) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getArticlesFailure: (state, { payload }) => ({
      ...state,
      data: {
        totalArticle: state.data?.totalArticle,
        articles: [],
      },
      error: payload,
      isLoading: false,
    }),
    reset: () => initialState,
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
