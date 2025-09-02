import { call, put, all, takeLatest } from 'redux-saga/effects';
import {
  getForumQuestionApi,
  getAnswersApi,
  reactForumQuestionApi,
  deleteForumQuestionApi,
} from 'api/forumApis';
import {
  createAnswerApi,
  deleteAnswerApi,
  reactAnswerApi,
  updateAnswerApi,
} from 'api/answerApis';
import ForumQuestionRedux from './index';
import {
  createCommentApi,
  deleteCommentApi,
  getCommentsApi,
  reactCommentApi,
  updateCommentApi,
} from 'api/commentApis';

const { actions } = ForumQuestionRedux;

function* forumQuestionRootSagas() {
  yield all([
    yield takeLatest(actions.getForumQuestion.type, getForumQuestionDataSaga),
    yield takeLatest(actions.reactForumQuestion.type, reactForumQuestionSaga),
    yield takeLatest(actions.deleteForumQuestion.type, deleteForumQuestionSaga),

    yield takeLatest(actions.reactAnswer.type, reactAnswerSaga),
    yield takeLatest(actions.reactComment.type, reactCommentSaga),
    yield takeLatest(actions.getMoreAnswers.type, getMoreAnswersSaga),
    yield takeLatest(actions.getMoreComments.type, getMoreCommentsSaga),

    yield takeLatest(actions.createAnswer.type, createAnswerSaga),
    yield takeLatest(actions.createComment.type, createCommentSaga),
    yield takeLatest(actions.updateAnswer.type, updateAnswerSaga),
    yield takeLatest(actions.updateComment.type, updateCommentSaga),
    yield takeLatest(actions.deleteAnswer.type, deleteAnswerSaga),
    yield takeLatest(actions.deleteComment.type, deleteCommentSaga),
  ]);
}

export function* getForumQuestionDataSaga({
  payload,
}: ReturnType<typeof actions.getForumQuestion>) {
  try {
    const data = yield call(getForumQuestionApi, payload);
    yield put(actions.getForumQuestionSuccess(data));
  } catch (error) {
    yield put(actions.getForumQuestionFailure(error));
  }
}

export function* getMoreAnswersSaga({
  payload,
}: ReturnType<typeof actions.getMoreAnswers>) {
  try {
    const data = yield call(
      getAnswersApi,
      payload.createdAt,
      payload.forumQuestionId
    );
    yield put(actions.getMoreAnswersSuccess(data.reverse()));
    payload.callback && payload.callback(null, data);
  } catch (error) {
    yield put(actions.getMoreAnswersFailure(error));
    payload.callback && payload.callback(error, null);
  }
}

export function* getMoreCommentsSaga({
  payload,
}: ReturnType<typeof actions.getMoreComments>) {
  try {
    const data = yield call(
      getCommentsApi,
      payload.createdAt,
      payload.answerId
    );
    yield put(
      actions.getMoreCommentsSuccess({
        answer: payload.answerId,
        comments: data.reverse(),
      })
    );
    payload.callback && payload.callback(null, data);
  } catch (error) {
    yield put(actions.getMoreCommentsFailure(error));
    payload.callback && payload.callback(error, null);
  }
}

export function* createAnswerSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.createAnswer>) {
  try {
    const data = yield call(createAnswerApi, params);
    yield put(actions.createAnswerSuccess(data));
    callback && callback(null, data);
  } catch (error) {
    console.log(error);
    yield put(actions.createAnswerFailure(error));
    callback && callback(error);
  }
}

export function* updateAnswerSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.updateAnswer>) {
  try {
    const data = yield call(updateAnswerApi, params);
    yield put(actions.updateAnswerSuccess(data));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.updateAnswerFailure(error));
    callback && callback(error);
  }
}

export function* createCommentSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.createComment>) {
  try {
    const data = yield call(createCommentApi, params);
    yield put(
      actions.createCommentSuccess({
        ...data,
        answer: params.forumAnswer,
      })
    );
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.createCommentFailure(error));
    callback && callback(error);
  }
}

export function* updateCommentSaga({
  payload: { callback, forumAnswer, ...params },
}: ReturnType<typeof actions.updateComment>) {
  try {
    const data = yield call(updateCommentApi, params);
    yield put(actions.updateCommentSuccess({ ...data, answer: forumAnswer }));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.updateCommentFailure(error));
    callback && callback(error);
  }
}

export function* reactForumQuestionSaga({
  payload,
}: ReturnType<typeof actions.reactForumQuestion>) {
  try {
    yield call(reactForumQuestionApi, payload);
  } catch (error) {
    console.log(error);
  }
}

export function* reactAnswerSaga({
  payload,
}: ReturnType<typeof actions.reactAnswer>) {
  try {
    yield call(reactAnswerApi, payload);
  } catch (error) {
    console.log(error);
  }
}

export function* reactCommentSaga({
  payload: { answer, ...params },
}: ReturnType<typeof actions.reactComment>) {
  try {
    yield call(reactCommentApi, params);
  } catch (error) {
    console.log(error);
  }
}

export function* deleteForumQuestionSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.deleteForumQuestion>) {
  try {
    const data = yield call(deleteForumQuestionApi, params);
    yield put(actions.deleteForumQuestionSuccess(params));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.deleteForumQuestionFailure(error));
    callback && callback(error);
  }
}

export function* deleteAnswerSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.deleteAnswer>) {
  try {
    const data = yield call(deleteAnswerApi, params);
    yield put(actions.deleteAnswerSuccess(params));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.deleteAnswerFailure(error));
    callback && callback(error);
  }
}

export function* deleteCommentSaga({
  payload: { callback, ...params },
}: ReturnType<typeof actions.deleteComment>) {
  try {
    const data = yield call(deleteCommentApi, params);
    yield put(actions.deleteCommentSuccess(params));
    callback && callback(null, data);
  } catch (error) {
    yield put(actions.deleteCommentFailure(error));
    callback && callback(error);
  }
}

export default forumQuestionRootSagas;
