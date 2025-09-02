import { PAGE_SIZE } from 'constants/app';
import { Article, ArticleCategory } from 'interfaces';
import api from './base';

export type ArticleReactionParams = {
  like: boolean;
  article: string;
  user: string;
};

export const getNewsDataApi = async () => api.get('/news');
export const getAcademyDataApi = async (page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(`/academy?_limit=${PAGE_SIZE}&_start=${start}`);
};

export const getArticleCategoriesApi = async (type: string) =>
  api.get('/article-categories/', {
    params: {
      type,
    },
  });

export const getHotArticleCategoriesApi = async (type: string) =>
  api.get('/article-categories/hot', {
    params: {
      type,
    },
  });

export const getArticleCategoryApi = async (slug: string) =>
  api.get(`/article-categories/${slug}`) as Promise<ArticleCategory>;

export const getArticlesApi = async (
  page: number,
  type: string,
  categoryId?: string
) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/articles', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      type_eq: type,
      articleCategory_eq: categoryId,
    },
  }) as Promise<{
    articles: Article[];
    totalArticle: number;
  }>;
};

export const getFeaturedArticlesApi = async (page: number, type: string) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/articles', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      type_eq: type,
      featured_eq: true,
    },
  }) as Promise<{
    articles: Article[];
    totalArticle: number;
  }>;
};

export const getNewsDataHomePageApi = async () =>
  api.get('/articles', {
    params: {
      _sort: 'createdAt:desc',
      _limit: 10,
      type_eq: 'news',
    },
  }) as Promise<{ articles: Article[] }>;

export const getArticleApi = async (slug: string, type: string) =>
  api.get(`/articles/${slug}`, {
    params: {
      type_eq: type,
    },
  }) as Promise<Article>;

export const reactArticleApi = async (params: ArticleReactionParams) =>
  api.post('/article-reactions/react', params);

export const getAnswersApi = async (createdAt: string, articlId: string) =>
  api.get(
    `/forum-answers?_sort=createdAt:desc&_limit=10&createdAt_lt=${createdAt}&article_eq=${articlId}`
  );

export const getHotNewsArticleApi = async (page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(
    `/articles?type=news&_sort=totalView:desc&_limit=${PAGE_SIZE}&_start=${start}`
  );
};

export const getArticleSlugsByCategoryApi = async (
  categorySlug: string,
  type: string
) =>
  api.get('/articles/slugs-by-category', {
    params: {
      categorySlug,
      type,
    },
  }) as Promise<string[]>;
