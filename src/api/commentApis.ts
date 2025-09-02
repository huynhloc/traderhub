import api from './base';
import { isEmpty } from 'lodash';
import { TFile } from 'interfaces';

export type CommentParams = {
  id?: string; // incase update
  forumAnswer?: string;
  content: string;
  tags?: { userId: string; name: string }[];
  images: TFile[];
};

export type CommentReactionParams = {
  like: boolean;
  forumComment: string;
  user: string;
};

export type DeleteParams = {
  id: string;
};

export const getCommentsApi = async (createdAt: string, answerId: string) =>
  api.get(
    `/forum-comments?_sort=createdAt:desc&_limit=10&createdAt_lt=${createdAt}&forumAnswer_eq=${answerId}`
  );

export const reactCommentApi = async (params: CommentReactionParams) =>
  api.post('/forum-comment-reactions/react', params);

export const createCommentApi = async ({
  images,
  ...otherParams
}: CommentParams) => {
  const formData = new FormData();

  if (!isEmpty(images)) {
    images.forEach((image) =>
      formData.append('files.images', image.file as File, image.name)
    );
  }

  formData.append('data', JSON.stringify(otherParams));

  return api.post('/forum-comments/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateCommentApi = async ({
  id,
  images,
  ...otherParams
}: CommentParams) => {
  const formData = new FormData();
  let data = otherParams;

  if (!isEmpty(images)) {
    const newImages = images.filter((img) => img.file && img.name);
    if (!isEmpty(newImages)) {
      newImages.forEach((image) =>
        formData.append('files', image.file as File, image.name)
      );
      const response: { id: string }[] = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      data = {
        ...otherParams,
        images: response.map((img) => img.id),
      } as CommentParams;
    }
  } else {
    data = { ...otherParams, images: [] } as CommentParams;
  }

  return api.put(`/forum-comments/${id}`, data);
};

export const deleteCommentApi = async ({ id }: DeleteParams) =>
  api.delete(`/forum-comments/${id}`);
