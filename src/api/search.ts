import { PAGE_SIZE } from 'constants/app';
import api from './base';

export const searchApi = async (q: string, _: number) =>
  api.get('/search', {
    params: {
      _q: q,
      _sort: 'createdAt:DESC',
      _limit: 5,
    },
  });

export const searchForumQuestionApi = async (q: string, page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/searchForumQuestion', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      _q: q,
    },
  });
};

export const searchNewsApi = async (q: string, page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/searchNews', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      _q: q,
    },
  });
};

export const searchAcademyApi = async (q: string, page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/searchAcademy', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      _q: q,
    },
  });
};
