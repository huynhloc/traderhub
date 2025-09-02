import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { ForumQuestion } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: {
    questions?: ForumQuestion[];
    totalQuestion?: number;
  };
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'hotForumQuestion',
  initialState,
  reducers: {
    getQuestions: (
      state,
      _action: PayloadAction<{ page: number; res?: ServerResponse }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getQuestionsSuccess: (
      state,
      {
        payload,
      }: PayloadAction<{
        questions: ForumQuestion[];
        totalQuestion: number;
      }>
    ) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getQuestionsFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      data: {
        totalQuestion: state.data?.totalQuestion,
        questions: [],
      },
      isLoading: false,
    }),
    reset: () => initialState,
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
