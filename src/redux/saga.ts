import { all } from 'redux-saga/effects';
import userSagas from './user/userSagas';
import forumSagas from './forum/forumSagas';
import forumCategorySagas from './forumCategory/forumCategorySagas';
import forumTopicSagas from './forumTopic/forumTopicSagas';
import forumQuestionSagas from './forumQuestion/forumQuestionSagas';
import hotForumQuestionSagas from './hotForumQuestion/hotForumQuestionSagas';
import activeMemberSagas from './activeMember/activeMemberSagas';
import searchSagas from './search/searchSagas';
import newsSagas from './news/newsSagas';
import academySagas from './academy/academySagas';
import articleSagas from './article/articleSagas';
import hotNewsArticleSagas from './hotNewsArticle/hotNewsArticleSagas';
import hotNewsCategorySagas from './hotNewsCategory/hotNewsCategorySagas';
import globalSagas from './global/globalSagas';

function* rootSaga() {
  yield all([
    userSagas(),
    forumSagas(),
    forumCategorySagas(),
    forumTopicSagas(),
    forumQuestionSagas(),
    hotForumQuestionSagas(),
    activeMemberSagas(),
    searchSagas(),
    newsSagas(),
    articleSagas(),
    academySagas(),
    hotNewsArticleSagas(),
    hotNewsCategorySagas(),
    globalSagas(),
  ]);
}

export default rootSaga;
