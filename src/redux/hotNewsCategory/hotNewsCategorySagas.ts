import { call, put, all, takeLatest } from 'redux-saga/effects';
import { getHotArticleCategoriesApi } from 'api/articleApis';
import Redux from './index';
import { ARTICLE_CATEGORY_TYPE } from 'constants/app';
import { ArticleCategory } from 'interfaces';

const { actions } = Redux;

function* rootSagas() {
  yield all([
    yield takeLatest(actions.getArticleCategories, getArticleCategoriesSaga),
  ]);
}

export function* getArticleCategoriesSaga() {
  try {
    const data = yield call(
      getHotArticleCategoriesApi,
      ARTICLE_CATEGORY_TYPE.NEWS
    );
    yield put(
      actions.getArticleCategoriesSuccess(
        data?.filter((cate: ArticleCategory) => !!cate && !!cate._id)
      )
    );
  } catch (error) {
    yield put(actions.getArticleCategoriesFailure(error));
  }
}

export default rootSagas;
