import api from './base';
import { isEmpty } from 'lodash';
import { TFile } from 'interfaces';

export type AnswerParams = {
  id?: string; // incase update
  forumQuestion?: string;
  article?: string;
  content: string;
  images: TFile[];
  type?: string;
};

export type AnswerReactionParams = {
  like: boolean;
  forumAnswer: string;
  user: string;
};

export type DeleteParams = {
  id: string;
};

export const reactAnswerApi = async (params: AnswerReactionParams) =>
  api.post('/forum-answer-reactions/react', params);

export const createAnswerApi = async ({
  images,
  ...otherParams
}: AnswerParams) => {
  const formData = new FormData();

  if (!isEmpty(images)) {
    images.forEach((image) =>
      formData.append('files.images', image.file as File, image.name)
    );
  }

  formData.append('data', JSON.stringify(otherParams));

  return api.post('/forum-answers/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateAnswerApi = async ({
  id,
  images,
  ...otherParams
}: AnswerParams) => {
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
      } as AnswerParams;
    }
  } else {
    data = { ...otherParams, images: [] } as AnswerParams;
  }

  return api.put(`/forum-answers/${id}`, data);
};

export const deleteAnswerApi = async ({ id }: DeleteParams) =>
  api.delete(`/forum-answers/${id}`);
