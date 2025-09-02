import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { Article, ForumQuestion } from 'interfaces';

type StateType = {
  isLoading: boolean;
  q: string;
  vertical: string;
  data?: {
    forumQuestions: ForumQuestion[];
    news: Article[];
    academy: Article[];
    totalForumQuestion: number;
    totalNews: number;
    totalAcademy: number;
  };
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  q: '',
  vertical: '',
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    search: (
      state,
      {
        payload: { q, vertical },
      }: PayloadAction<{
        q: string;
        vertical: string;
        page: number;
        res?: ServerResponse;
      }>
    ) => ({
      ...state,
      q,
      vertical,
      error: undefined,
      isLoading: true,
    }),
    searchSuccess: (state, { payload }) => {
      const { vertical, result } = payload;
      state.isLoading = false;
      if (!vertical) {
        state.data = result;
      } else {
        state.data = {
          ...state.data,
          ...result,
        };
      }
    },
    searchFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
