import { call, put, all, takeLatest } from 'redux-saga/effects';
import {
  getForumDataApi,
  getForumCategoriesApi,
  createForumQuestionApi,
  updateForumQuestionApi,
  getForumHashtagsApi,
  getTopForumHashtagsApi,
} from 'api/forumApis';
import ForumRedux from './index';

const { actions } = ForumRedux;

function* forumRootSagas() {
  yield all([
    yield takeLatest(actions.getForumData.type, getForumDataSaga),
    yield takeLatest(actions.getForumCategories.type, getForumCategoriesSaga),
    yield takeLatest(actions.getForumHashtags.type, getForumHashtagsSaga),
    yield takeLatest(actions.getTopForumHashtags.type, getTopForumHashtagsSaga),
    yield takeLatest(actions.createForumQuestion.type, createForumQuestionSaga),
    yield takeLatest(actions.updateForumQuestion.type, updateForumQuestionSaga),
  ]);
}

export function* getForumDataSaga() {
  try {
    const data = yield call(getForumDataApi);
    yield put(actions.getForumDataSuccess(data));
  } catch (error) {
    yield put(actions.getForumDataFailure(error));
  }
}
export function* getForumCategoriesSaga() {
  try {
    const data = yield call(getForumCategoriesApi);
    yield put(actions.getForumCategoriesSuccess(data));
  } catch (error) {
    yield put(actions.getForumCategoriesFailure(error));
  }
}
export function* getForumHashtagsSaga() {
  try {
    const data = yield call(getForumHashtagsApi);
    yield put(actions.getForumHashtagsSuccess(data));
  } catch (error) {
    yield put(actions.getForumHashtagsFailure(error));
  }
}

export function* getTopForumHashtagsSaga() {
  try {
    const data = yield call(getTopForumHashtagsApi);
    yield put(actions.getTopForumHashtagsSuccess(data));
  } catch (error) {
    yield put(actions.getTopForumHashtagsFailure(error));
  }
}

export function* createForumQuestionSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.createForumQuestion>) {
  try {
    const data = yield call(createForumQuestionApi, params);
    yield put(actions.createForumQuestionSuccess(data));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.createForumQuestionFailure(error));
    callback && callback(error);
  }
}

export function* updateForumQuestionSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.updateForumQuestion>) {
  try {
    const data = yield call(updateForumQuestionApi, params);
    yield put(actions.updateForumQuestionSuccess(data));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.updateForumQuestionFailure(error));
    callback && callback(error);
  }
}

export default forumRootSagas;
