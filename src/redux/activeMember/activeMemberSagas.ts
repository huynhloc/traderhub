import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getActiveMembersApi } from 'api/userApis';
import ActiveMemberRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = ActiveMemberRedux;

function* forumTopicRootSagas() {
  yield all([yield takeLatest(actions.getMembers.type, getMemebersSaga)]);
}

export function* getMemebersSaga({
  payload,
}: ReturnType<typeof actions.getMembers>) {
  try {
    const data = yield call(getActiveMembersApi, payload.page);
    redirectNotFoundPageIfExccedRange(
      payload.page,
      data?.totalUser,
      payload.res
    );
    yield put(actions.getMembersSuccess(data));
  } catch (error) {
    yield put(actions.getMembersFailure(error));
  }
}

export default forumTopicRootSagas;
