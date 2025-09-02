import { Webinar, WebinarGroupByMonth } from 'interfaces';
import api from './base';

export type RegisterWebinarParams = {
  webinar: string;
  name: string;
  email: string;
  phone: string;
};

export const getAllWebinars = async () =>
  api.get('/webinars/findall') as Promise<WebinarGroupByMonth>;

export const getWebinars = async (
  start: number,
  limit: number,
  fromDate?: string,
  toDate?: string,
  q?: string
) =>
  api.get('/webinars', {
    params: {
      _start: start,
      date_gte: fromDate,
      date_lte: toDate,
      _q: q,
      _sort: 'date:asc,fromTime:asc',
      _limit: limit,
    },
  }) as Promise<Webinar[]>;

export const createRegisterWebinar = async (params: RegisterWebinarParams) =>
  api.post('/register-webinars/', params) as Promise<Webinar>;
