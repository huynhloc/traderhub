import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getForumCategoryApi } from 'api/forumApis';
import ForumCategoryRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = ForumCategoryRedux;

function* forumCategoryRootSagas() {
  yield all([
    yield takeLatest(actions.getForumCategory.type, getForumCategoryDataSaga),
  ]);
}

export function* getForumCategoryDataSaga({
  payload,
}: ReturnType<typeof actions.getForumCategory>) {
  try {
    const data = yield call(getForumCategoryApi, payload.slug, payload.page);
    redirectNotFoundPageIfExccedRange(
      payload.page,
      data?.totalTopic,
      payload.res
    );
    yield put(actions.getForumCategorySuccess(data));
  } catch (error) {
    yield put(actions.getForumCategoryFailure(error));
  }
}

export default forumCategoryRootSagas;
