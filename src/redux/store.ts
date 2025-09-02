import { AnyAction, Store } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware, { Task } from 'redux-saga';
import { createWrapper, HYDRATE, MakeStore } from 'next-redux-wrapper';

import rootReducer, { RootState } from './reducer';
import rootSaga from './saga';

export interface SagaStore extends Store {
  sagaTask: Task;
}

const reducer = (state: RootState, action: AnyAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload, // apply data from hydration
    };

    // keep client state
    nextState.user = state.user;
    nextState.forum = {
      ...nextState.forum,
      allCategories: state.forum.allCategories,
    };
    return nextState;
  } else {
    return rootReducer(state, action);
  }
};

export const makeStore: MakeStore<RootState> = (): Store => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [
    ...getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }),
    sagaMiddleware,
  ];
  const store = configureStore({
    reducer: reducer as typeof rootReducer,
    middleware,
    devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
    preloadedState: {},
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducer', () => {
      const newRootReducer = require('./reducer').default;
      store.replaceReducer(newRootReducer);
    });
  }

  return store;
};

export default createWrapper<RootState>(makeStore, {
  debug: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
});
