import {
  call,
  put,
  fork,
  take,
  cancelled,
  all,
  takeLatest,
  select,
} from 'redux-saga/effects';
import Router from 'next/router';
import { CallBack, User } from 'interfaces';
import {
  loginApi,
  loginWithFacebookApi,
  loginWithGoogleApi,
  signupApi,
  fetchCurrentUserApi,
  forgotPasswordApi,
  sendEmailConfirmationApi,
  LoginParams,
  resetPasswordApi,
  updateMeApi,
  updateAvatarApi,
  deleteAvatarApi,
} from 'api/userApis';
import { setRequesetAuthorizationHeader } from 'api/base';
import { getServerErrorMessage, setToken } from 'utils';
import { LOGOUT_KEY } from 'storageKeys';
import { ROUTES } from 'constants/routes';
import * as Tracking from 'utils/tracking';
import UserRedux from './index';

const { actions: userActions } = UserRedux;

function* userRootSagas() {
  yield all([
    yield takeLatest(userActions.fetchCurrentUser.type, fetchCurrentUserSaga),
    yield takeLatest(userActions.updateMe.type, updateMeSaga),
    yield takeLatest(userActions.changePass.type, changePassSaga),
    yield takeLatest(userActions.updateAvatar.type, updateAvatarSaga),
    yield takeLatest(userActions.signup.type, signupSaga),
    yield takeLatest(userActions.loginWithFacebook.type, logingWithFacebokSaga),
    yield takeLatest(userActions.loginWithGoogle.type, logingWithGoogleSaga),
    yield takeLatest(userActions.forgotPassword.type, forgotPasswordSaga),
    yield takeLatest(userActions.resetPassword.type, resetPasswordSaga),
    yield takeLatest(
      userActions.sendEmailConfirmation.type,
      sendEmailConfirmationSaga
    ),
    loginSaga(),
    logoutSaga(),
  ]);
}

export function* fetchCurrentUserSaga() {
  try {
    const user = yield call(fetchCurrentUserApi);
    yield put(userActions.fetchCurrentUserSuccess(user));
  } catch (error) {
    yield put(userActions.fetchCurrentUserFail(error));
  }
}

export function* updateMeSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.updateMe>) {
  try {
    const user = select((state) => state.user.currentUser) as unknown;
    Tracking.updateProfile((user as User).email);
    const response = yield call(updateMeApi, params);
    yield put(userActions.updateMeSuccess(params));
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.updateMeFailure(error));
  }
}

export function* changePassSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.changePass>) {
  try {
    const user = select((state) => state.user.currentUser) as unknown;
    Tracking.changePassword((user as User).email);
    const response = yield call(updateMeApi, params);
    yield put(userActions.changePassSuccess());
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.changePassFailure(error));
  }
}

export function* updateAvatarSaga({
  payload: { callback, oldAvatarId, ...params },
}: ReturnType<typeof userActions.updateAvatar>) {
  try {
    const user = select((state) => state.user.currentUser) as unknown;
    Tracking.changeAvatar((user as User).email);
    const response = yield call(updateAvatarApi, params);
    yield put(userActions.updateAvatarSuccess(response));
    if (oldAvatarId) {
      deleteAvatarApi({ id: oldAvatarId });
    }
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.updateAvatarFailure(error));
  }
}

export function* signupSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.signup>) {
  try {
    const { user } = yield call(signupApi, params);
    yield put(userActions.signupSuccess());
    callback && callback(null, user);
    Tracking.localSignUp(user);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.signupFailure(error));
  }
}

export function* loginSaga() {
  while (true) {
    // eslint-disable-line
    const {
      payload: { callback, ...params },
    } = yield take(userActions.login.type);
    yield fork(authorize, params, callback);
  }
}

function* authorize(params: LoginParams, callback: CallBack) {
  try {
    const { user, jwt } = yield call(loginApi, params);
    yield put(userActions.loginSuccess(user));
    setToken(jwt);
    setRequesetAuthorizationHeader(jwt);
    callback && callback(null, user);
    Tracking.loginSuccess(user);
  } catch (error) {
    yield put(userActions.loginFailure(error));
    Tracking.loginFailure({ email: params.identifier });
    callback && callback(error);
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}

export function* logingWithFacebokSaga({
  payload: { callback, accessToken },
}: ReturnType<typeof userActions.loginWithFacebook>) {
  try {
    const { user, jwt } = yield call(loginWithFacebookApi, accessToken);
    yield put(userActions.loginSuccess(user));
    setToken(jwt);
    setRequesetAuthorizationHeader(jwt);
    callback && callback(null, user);
    Tracking.loginSuccess(user);
  } catch (error) {
    callback && callback(error);
    const message = getServerErrorMessage(error);
    Tracking.loginFailure({ error: message, provider: 'facebook' });
    yield put(userActions.loginFailure(error));
  }
}

export function* logingWithGoogleSaga({
  payload: { callback, accessToken },
}: ReturnType<typeof userActions.loginWithGoogle>) {
  try {
    const { user, jwt } = yield call(loginWithGoogleApi, accessToken);
    yield put(userActions.loginSuccess(user));
    setToken(jwt);
    setRequesetAuthorizationHeader(jwt);
    callback && callback(null, user);
    Tracking.loginSuccess(user);
  } catch (error) {
    callback && callback(error);
    const message = getServerErrorMessage(error);
    Tracking.loginFailure({ error: message, provider: 'google' });
    yield put(userActions.loginFailure(error));
  }
}

export function* forgotPasswordSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.forgotPassword>) {
  try {
    Tracking.forgotPassword(params.email);
    const response = yield call(forgotPasswordApi, params);
    yield put(userActions.forgotPasswordSuccess());
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.forgotPasswordFailure(error));
  }
}

export function* sendEmailConfirmationSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.sendEmailConfirmation>) {
  try {
    const response = yield call(sendEmailConfirmationApi, params);
    yield put(userActions.forgotPasswordSuccess());
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.forgotPasswordFailure(error));
  }
}

export function* resetPasswordSaga({
  payload: { callback, ...params },
}: ReturnType<typeof userActions.resetPassword>) {
  try {
    Tracking.resetPassword();
    const response = yield call(resetPasswordApi, params);
    yield put(userActions.resetPasswordSuccess());
    callback && callback(null, response);
  } catch (error) {
    callback && callback(error);
    yield put(userActions.resetPasswordFailure(error));
  }
}

/**
 * Log out saga: client only
 */
export function* logoutSaga() {
  while (true) {
    const user = select((state) => state.user.currentUser) as unknown;
    yield take(userActions.logout.type);
    setToken();
    setRequesetAuthorizationHeader();
    Router.replace(ROUTES.LOGIN);
    window.localStorage.setItem(LOGOUT_KEY, Date.now().toString());
    Tracking.logout((user || {}) as User);
  }
}

export default userRootSagas;
