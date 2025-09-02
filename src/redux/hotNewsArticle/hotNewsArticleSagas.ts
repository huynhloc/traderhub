import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getHotNewsArticleApi } from 'api/articleApis';
import HotNewsArticleRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = HotNewsArticleRedux;

function* rootSagas() {
  yield all([yield takeLatest(actions.getArticles, getArticlesSaga)]);
}

export function* getArticlesSaga({
  payload,
}: ReturnType<typeof actions.getArticles>) {
  try {
    const { page, res } = payload;
    const data = yield call(getHotNewsArticleApi, page);
    redirectNotFoundPageIfExccedRange(page, data?.totalArticle, res);
    yield put(actions.getArticlesSuccess(data));
  } catch (error) {
    yield put(actions.getArticlesFailure(error));
  }
}

export default rootSagas;
