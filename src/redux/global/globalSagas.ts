import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getAppConfigApi } from 'api/globalApis';
import GlobalRedux from './index';

const { actions } = GlobalRedux;

function* forumTopicRootSagas() {
  yield all([yield takeLatest(actions.getAppConfig.type, getAppConfigSaga)]);
}

export function* getAppConfigSaga() {
  try {
    const data = yield call(getAppConfigApi);
    yield put(actions.getAppConfigSuccess(data || {}));
  } catch (error) {
    yield put(actions.getAppConfigFailure(error));
  }
}

export default forumTopicRootSagas;
