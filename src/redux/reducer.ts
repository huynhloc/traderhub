import { combineReducers } from '@reduxjs/toolkit';
import GlobalRedux from './global';
import UserRedux from './user';
import ForumRedux from './forum';
import ForumCategoryRedux from './forumCategory';
import ForumTopicRedux from './forumTopic';
import ForumQuesitonRedux from './forumQuestion';
import HotForumQuestionRedux from './hotForumQuestion';
import ActiveMemberRedux from './activeMember';
import SearchRedux from './search';
import NewsRedux from './news';
import AcademyRedux from './academy';
import ArticleRedux from './article';
import HotNewsArticleRedux from './hotNewsArticle';
import HotNewsCategoryRedux from './hotNewsCategory';

const rootReducer = combineReducers({
  [GlobalRedux.name]: GlobalRedux.reducer,
  [UserRedux.name]: UserRedux.reducer,
  [ForumRedux.name]: ForumRedux.reducer,
  [ForumCategoryRedux.name]: ForumCategoryRedux.reducer,
  [ForumTopicRedux.name]: ForumTopicRedux.reducer,
  [ForumQuesitonRedux.name]: ForumQuesitonRedux.reducer,
  [HotForumQuestionRedux.name]: HotForumQuestionRedux.reducer,
  [ActiveMemberRedux.name]: ActiveMemberRedux.reducer,
  [SearchRedux.name]: SearchRedux.reducer,
  [NewsRedux.name]: NewsRedux.reducer,
  [AcademyRedux.name]: AcademyRedux.reducer,
  [ArticleRedux.name]: ArticleRedux.reducer,
  [HotNewsArticleRedux.name]: HotNewsArticleRedux.reducer,
  [HotNewsCategoryRedux.name]: HotNewsCategoryRedux.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
