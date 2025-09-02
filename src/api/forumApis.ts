import { PAGE_SIZE } from 'constants/app';
import { Answer, Comment, ForumHashtag, ForumQuestion } from 'interfaces';
import api from './base';

export type QuestionParams = {
  id?: string; // incase update
  forumTopic: string;
  forumHashtags: string[];
  title: string;
  content: string;
};

export type QuestionReactionParams = {
  like: boolean;
  forumQuestion: string;
  user: string;
};

export type DeleteParams = {
  id: string;
};

export const getForumDataApi = async () => api.get('/forum');

export const getForumCategoryApi = async (slug: string, page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(
    `/forum-categories/${slug}?_limit=${PAGE_SIZE}&_start=${start}`
  );
};

export const getForumTopicApi = async (slug: string, page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(`/forum-topics/${slug}?_limit=${PAGE_SIZE}&_start=${start}`);
};

export const getForumQuestionApi = async (slug: string) =>
  api.get(`/forum-questions/${slug}`);

export const getHotForumQuestionsApi = async (page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(
    `/forum-questions?_sort=point:desc&_limit=${PAGE_SIZE}&_start=${start}`
  );
};

export const getAnswersApi = async (
  createdAt: string,
  forumQuestionId: string
) =>
  api.get(
    `/forum-answers?_sort=createdAt:desc&_limit=10&createdAt_lt=${createdAt}&forumQuestion_eq=${forumQuestionId}`
  );

export const getMyForumQuestionsApi = async (start: number) =>
  api.get(
    `/forum-questions/mine?_sort=createdAt:desc&_limit=10&_start=${start}`
  );
export const getMyAnswersApi = async (start: number) =>
  api.get(
    `/forum-answers/mine?_sort=createdAt:desc&_limit=10&_start=${start}`
  ) as Promise<Answer[]>;
export const getMyCommentsApi = async (start: number) =>
  api.get(
    `/forum-comments/mine?_sort=createdAt:desc&_limit=10&_start=${start}`
  ) as Promise<Comment[]>;
export const getTaggedCommentsApi = async (start: number) =>
  api.get(`/forum-comments/tagged?_limit=10&_start=${start}`);

export const getForumCategoriesApi = async () => api.get('/forum-categories/');
export const getForumHashtagsApi = async () => api.get('/forum-hashtags/');
export const getTopForumHashtagsApi = async () =>
  api.get('/forum-hashtags?_sort=point:desc&_limit=20');

export const createForumQuestionApi = async (params: QuestionParams) =>
  api.post('/forum-questions/', params);

export const updateForumQuestionApi = async ({
  id,
  ...params
}: QuestionParams) => api.put(`/forum-questions/${id}`, params);

export const reactForumQuestionApi = async (params: QuestionReactionParams) =>
  api.post('/forum-question-reactions/react', params);

export const deleteForumQuestionApi = async ({ id }: DeleteParams) =>
  api.delete(`/forum-questions/${id}`);

export const getForumHashtagApi = async (slug: string) =>
  api.get(`/forum-hashtags/${slug}`) as Promise<ForumHashtag>;

export const getForumQuestionsByHashtagApi = async (
  page: number,
  hashtagId?: string
) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get('/forum-questions', {
    params: {
      _sort: 'createdAt:desc',
      _limit: PAGE_SIZE,
      _start: start,
      forumHashtags_in: [hashtagId],
    },
  }) as Promise<{
    questions: ForumQuestion[];
    totalQuestion: number;
  }>;
};

export const getForumQuestionSlugsByTopicApi = async (topicSlug: string) =>
  api.get('/forum-questions/slugs-by-topic', {
    params: {
      topicSlug,
    },
  }) as Promise<string[]>;
