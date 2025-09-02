import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getForumTopicApi } from 'api/forumApis';
import ForumTopicRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = ForumTopicRedux;

function* forumTopicRootSagas() {
  yield all([
    yield takeLatest(actions.getForumTopic.type, getForumTopicDataSaga),
  ]);
}

export function* getForumTopicDataSaga({
  payload,
}: ReturnType<typeof actions.getForumTopic>) {
  try {
    const data = yield call(getForumTopicApi, payload.slug, payload.page);
    redirectNotFoundPageIfExccedRange(
      payload.page,
      data?.totalQuestion,
      payload.res
    );
    yield put(actions.getForumTopicSuccess(data));
  } catch (error) {
    yield put(actions.getForumTopicFailure(error));
  }
}

export default forumTopicRootSagas;
