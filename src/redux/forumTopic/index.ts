import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { ForumTopic } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: ForumTopic;
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'forumTopic',
  initialState,
  reducers: {
    getForumTopic: (
      state,
      {
        payload,
      }: PayloadAction<{ slug: string; page: number; res?: ServerResponse }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
      data: state.data?.slug === payload.slug ? state.data : undefined,
    }),
    getForumTopicSuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getForumTopicFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    getMoreQuestions: (
      state,
      _action: PayloadAction<{ createdAt: string; forumTopicId: string }>
    ) => ({
      ...state,
      error: undefined,
      data: {
        ...state.data,
        forumQuestions: [],
      } as ForumTopic,
      isLoading: true,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
