import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getHotForumQuestionsApi } from 'api/forumApis';
import HotForumQuestionRedux from './index';
import { redirectNotFoundPageIfExccedRange } from 'utils';

const { actions } = HotForumQuestionRedux;

function* forumTopicRootSagas() {
  yield all([yield takeLatest(actions.getQuestions.type, getQuestionsSaga)]);
}

export function* getQuestionsSaga({
  payload,
}: ReturnType<typeof actions.getQuestions>) {
  try {
    const data = yield call(getHotForumQuestionsApi, payload.page);
    redirectNotFoundPageIfExccedRange(
      payload.page,
      data?.totalQuestion,
      payload.res
    );
    yield put(actions.getQuestionsSuccess(data));
  } catch (error) {
    yield put(actions.getQuestionsFailure(error));
  }
}

export default forumTopicRootSagas;
