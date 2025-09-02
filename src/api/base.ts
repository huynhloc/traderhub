import Axios from 'axios';
import { isArray } from 'lodash';
import NProgress from 'nprogress';

const api = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

api.interceptors.request.use((config) => {
  if (config.method === 'get' && typeof window !== 'undefined') {
    NProgress.start();
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    response?.config?.method === 'get' &&
      typeof window !== 'undefined' &&
      NProgress.done();
    return response.data;
  },
  async (error) => {
    error?.response?.config?.method === 'get' &&
      typeof window !== 'undefined' &&
      NProgress.done();
    if (error.response) {
      const errors = error.response.data;
      return Promise.reject(
        errors.data && isArray(errors.data)
          ? errors.data[0]?.messages
          : [
              {
                id: 'common',
                message:
                  errors.statusCode === 500 ? 'Lỗi server' : errors.message,
              },
            ]
      );
    } else if (error.request)
      return Promise.reject([{ id: 'common', message: 'Lỗi server' }]);
    return Promise.reject([{ id: 'common', message: error.message }]);
  }
);

export function setRequesetAuthorizationHeader(token?: string) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
}

export default api;
