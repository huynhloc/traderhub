import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getNewsDataApi, getArticleCategoriesApi } from 'api/articleApis';
import NewsRedux from './index';
import { ARTICLE_CATEGORY_TYPE } from 'constants/app';

const { actions } = NewsRedux;

function* newsRootSagas() {
  yield all([
    yield takeLatest(actions.getNewsData.type, getNewsDataSaga),
    yield takeLatest(actions.getNewsCategories.type, getNewsCategoriesSaga),
  ]);
}

export function* getNewsDataSaga() {
  try {
    const data = yield call(getNewsDataApi);
    yield put(actions.getNewsDataSuccess(data));
  } catch (error) {
    yield put(actions.getNewsDataFailure(error));
  }
}

export function* getNewsCategoriesSaga() {
  try {
    const data = yield call(
      getArticleCategoriesApi,
      ARTICLE_CATEGORY_TYPE.NEWS
    );
    yield put(actions.getNewsCategoriesSuccess(data));
  } catch (error) {
    yield put(actions.getNewsCategoriesFailure(error));
  }
}

export default newsRootSagas;
