import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { Article, ArticleCategory, Webinar } from 'interfaces';

type StateType = {
  isLoading: boolean;
  isProcessing: boolean;
  data: {
    articles?: Article[];
    totalArticle?: number;
    categories?: ArticleCategory[];
    featuredArticles?: Article[];
    topWebinars?: Webinar[];
    featuredVideo?: string;
  };
  registeredWebinars: string[];
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  isProcessing: false,
  data: {},
  registeredWebinars: [],
  error: undefined,
};

const userSlice = createSlice({
  name: 'academy',
  initialState,
  reducers: {
    getAcademyData: (
      state,
      _: PayloadAction<{ page: number; res?: ServerResponse }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getAcademyDataSuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getAcademyDataFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    registerWebinars: (state, { payload }) => {
      if (state.registeredWebinars.indexOf(payload) < 0) {
        state.registeredWebinars.push(payload);
      }
    },
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
