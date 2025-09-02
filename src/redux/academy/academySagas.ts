import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getAcademyDataApi } from 'api/articleApis';
import AcademyRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = AcademyRedux;

function* newsRootSagas() {
  yield all([
    yield takeLatest(actions.getAcademyData.type, getAcademyDataSaga),
  ]);
}

export function* getAcademyDataSaga({
  payload,
}: ReturnType<typeof actions.getAcademyData>) {
  try {
    const { page, res } = payload;
    console.log('getAcademyDataApi');
    const data = yield call(getAcademyDataApi, page);
    redirectNotFoundPageIfExccedRange(page, data?.totalArticle, res);
    yield put(actions.getAcademyDataSuccess(data));
  } catch (error) {
    console.log('getAcademyDataApi ERROR');
    yield put(actions.getAcademyDataFailure(error));
  }
}

export default newsRootSagas;
