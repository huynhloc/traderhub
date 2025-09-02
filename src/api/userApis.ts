import { CancelToken } from 'axios';
import { PAGE_SIZE } from 'constants/app';
import { TFile } from 'interfaces';
import api from './base';

export type SigunUpParams = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export type UpdateMeParams = {
  id: string;
  fullName?: string;
  phone?: string;
  address?: string;
  intro?: string;
  password?: string;
  connect?: { provider: string; email: string }[];
};

export type UpdateAvatarParams = {
  oldAvatarId?: string;
  image: TFile;
  userId: string;
};

export type LoginParams = {
  identifier: string;
  password: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type SendEmailConfirmationParams = {
  email: string;
};

export type ResetPasswordParams = {
  code: string;
  password: string;
  passwordConfirmation: string;
};

export const signupApi = async (params: SigunUpParams) =>
  api.post('/auth/local/register', params);

export const loginApi = async (params: LoginParams) =>
  api.post('/auth/local', params);

export const fetchCurrentUserApi = async () => api.get('/users/me');

export const getActiveMembersApi = async (page: number) => {
  const start = page > 1 ? (page - 1) * PAGE_SIZE : 0;
  return api.get(`/users?_sort=point:desc&_limit=${PAGE_SIZE}&_start=${start}`);
};

export const loginWithFacebookApi = async (accessToken: string) =>
  api.get('/auth/facebook/callback', {
    params: {
      access_token: accessToken,
    },
  });

export const loginWithGoogleApi = async (accessToken: string) =>
  api.get('/auth/google/callback', {
    params: {
      access_token: accessToken,
    },
  });

export const forgotPasswordApi = async (params: ForgotPasswordParams) =>
  api.post('/auth/forgot-password', params);

export const resetPasswordApi = async (params: ResetPasswordParams) =>
  api.post('/auth/reset-password', params);

export const sendEmailConfirmationApi = async (
  params: SendEmailConfirmationParams
) => api.post('/auth/send-email-confirmation', params);

export const updateMeApi = async ({ id, ...params }: UpdateMeParams) =>
  api.put(`/users/${id}`, params);

export const updateAvatarApi = async ({
  image,
  userId,
}: UpdateAvatarParams) => {
  const formData = new FormData();
  formData.append('files', image.file as File, image.name);
  formData.append('ref', 'user');
  formData.append('refId', userId);
  formData.append('field', 'avatar');
  formData.append('source', 'users-permissions');
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadFileApi = async (file: TFile, cancelToken: CancelToken) => {
  const formData = new FormData();
  formData.append('files', file.file as File, file.name as string);
  return api.post('/upload', formData, {
    cancelToken,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }) as Promise<[{ url: string }]>;
};

export const deleteAvatarApi = async ({ id }: { id: string }) =>
  api.delete(`/upload/files/${id}`);
