import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { ForumCategory } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: ForumCategory;
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'forumCategory',
  initialState,
  reducers: {
    getForumCategory: (
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
    getForumCategorySuccess: (state, { payload }) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getForumCategoryFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      data: {
        ...state.data,
        forumTopics: [],
      } as ForumCategory,
      isLoading: false,
    }),
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
