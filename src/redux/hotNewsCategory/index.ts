import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArticleCategory } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: ArticleCategory[];
  hasMore: boolean;
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  hasMore: false,
  error: undefined,
};

const userSlice = createSlice({
  name: 'hotNewsCategory',
  initialState,
  reducers: {
    getArticleCategories: (state) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getArticleCategoriesSuccess: (
      state,
      { payload }: PayloadAction<ArticleCategory[]>
    ) => ({
      ...state,
      data: payload,
      hasMore: false, // get all
      isLoading: false,
    }),
    getArticleCategoriesFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    reset: () => initialState,
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
