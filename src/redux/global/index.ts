import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppConfig } from 'interfaces';

type StateType = {
  isLoading: boolean;
  imageLightBox: string;
  appConfig?: AppConfig;
  error: unknown;
};

const initialState: StateType = {
  isLoading: false,
  imageLightBox: '',
  appConfig: undefined,
  error: undefined,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    showImage: (state, { payload }) => ({ ...state, imageLightBox: payload }),
    hideImage: (state) => ({ ...state, imageLightBox: '' }),
    getAppConfig: (state) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    getAppConfigSuccess: (state, { payload }: PayloadAction<AppConfig>) => ({
      ...state,
      appConfig: payload,
      isLoading: false,
    }),
    getAppConfigFailure: (state, { payload }) => ({
      ...state,
      error: payload,
      isLoading: false,
    }),
    reset: () => initialState,
    resetError: (state) => ({ ...state, error: undefined }),
  },
});

export default globalSlice;
