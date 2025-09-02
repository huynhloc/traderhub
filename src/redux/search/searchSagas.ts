import { call, put, all, takeLatest } from 'redux-saga/effects';
import {
  searchApi,
  searchForumQuestionApi,
  searchNewsApi,
  searchAcademyApi,
} from 'api/search';
import { APP_VERTICAL } from 'constants/app';

import SearchRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = SearchRedux;

function* searchRootSagas() {
  yield all([yield takeLatest(actions.search.type, searchSaga)]);
}

export function* searchSaga({ payload }: ReturnType<typeof actions.search>) {
  try {
    let api = searchApi;
    const { vertical, q, page, res } = payload;
    switch (vertical) {
      case APP_VERTICAL.FORUM:
        api = searchForumQuestionApi;
        break;
      case APP_VERTICAL.NEWS:
        api = searchNewsApi;
        break;
      case APP_VERTICAL.ACADEMY:
        api = searchAcademyApi;
        break;
      default:
        break;
    }
    const data = yield call(api, q, page);
    if (vertical) {
      redirectNotFoundPageIfExccedRange(
        page,
        data?.totalForumQuestion || data?.totalNews || data?.totalAcademy,
        res
      );
    }
    yield put(actions.searchSuccess({ vertical, q, result: data }));
  } catch (error) {
    yield put(actions.searchFailure(error));
  }
}

export default searchRootSagas;
