import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerResponse } from 'http';
import { User } from 'interfaces';

type StateType = {
  isLoading: boolean;
  data?: {
    users?: User[];
    totalUser?: number;
  };
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  data: undefined,
  error: undefined,
};

const userSlice = createSlice({
  name: 'activeMember',
  initialState,
  reducers: {
    getMembers: (
      state,
      _action: PayloadAction<{ page: number; res?: ServerResponse }>
    ) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getMembersSuccess: (
      state,
      {
        payload,
      }: PayloadAction<{
        users?: User[];
        totalUser?: number;
      }>
    ) => ({
      ...state,
      data: payload,
      isLoading: false,
    }),
    getMembersFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      data: {
        totalUser: state.data?.totalUser,
        users: [],
      },
      isLoading: false,
    }),
    reset: () => initialState,
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default userSlice;
