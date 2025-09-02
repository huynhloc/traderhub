import { ServerResponse } from 'http';
import Router from 'next/router';
import { PAGE_SIZE, POINT_MAP, SITE_HOSTS } from 'constants/app';
import { ServerError } from 'interfaces';
import Cookies from 'js-cookie';
import nextCookie from 'next-cookies';
import moment from 'moment';
import { TOKEN_KEY } from 'storageKeys';
import { REDIRECT_STATUS_CODE } from 'constants/routes';

export const getServerErrorMessage = (
  errors?: Nullable<ServerError[]>
): string => {
  return errors ? errors?.map((error) => error.message)?.join('\n') : '';
};

export const setToken = (token?: string) => {
  if (typeof window !== 'undefined') {
    token && Cookies.set(TOKEN_KEY, token);
    !token && Cookies.remove(TOKEN_KEY);
  }
};

/**
 * only work on client,
 * please use withAuth hoc for checking authentication on both server and client
 */
export const getToken = (): Nullable<string> => {
  const { [TOKEN_KEY]: token } = nextCookie({});
  return token;
};

export const formatNumber = (num = 0) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const getMemberLabel = (point: number) => {
  if (point >= POINT_MAP.master) return 'master';
  if (point >= POINT_MAP.professional) return 'professional';
  if (point >= POINT_MAP.experienced) return 'experienced';
  return 'beginner';
};

export const formatDate = (date?: string) => {
  return date ? moment(date).format('DD/MM/YYYY') : '';
};

export function getFileName(str: string) {
  return Date.now() + str.slice(str.lastIndexOf('.'));
}

export const isInternalLink = (url: string) => {
  const isWithoutHttp =
    !/^(https?:)?\/\//.test(url) && !/^(http?:)?\/\//.test(url);
  const comps = SITE_HOSTS.map((host) => new RegExp(host));
  return isWithoutHttp || comps.some((comp) => comp.test(url));
};

export const redirectNotFoundPage = (res?: ServerResponse) => {
  if (typeof window === 'undefined' && res) {
    res.writeHead(REDIRECT_STATUS_CODE, { Location: '/404' });
    res.end();
  } else {
    Router.replace('/404');
  }
};

export const redirectToPage = (url: string, res?: ServerResponse) => {
  if (typeof window === 'undefined' && res) {
    res.writeHead(REDIRECT_STATUS_CODE, { Location: url });
    res.end();
  } else {
    Router.replace(url);
  }
};

export const redirectNotFoundPageIfInValidPage = (
  currentUrl: string,
  page?: string,
  res?: ServerResponse
) => {
  if (parseInt(page as string) === 1) {
    redirectToPage(currentUrl, res);
  } else if (
    page &&
    (!parseInt(page as string) || parseInt(page as string) < 1)
  ) {
    redirectNotFoundPage(res);
  }
};

export const redirectNotFoundPageIfExccedRange = (
  currentPage: number,
  totalItem?: number,
  res?: ServerResponse
) => {
  if (
    currentPage <= Math.ceil((totalItem || 0) / PAGE_SIZE) ||
    currentPage === 1
  ) {
    return;
  }
  redirectNotFoundPage(res);
};

export const generateSitemap = (slugs: string[]) => {
  const baseUrl = 'https://www.traderhub.vn';
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${slugs
      .map((url: string) => {
        return `
          <url>
            <loc>${baseUrl}${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
          </url>
        `;
      })
      .join('')}
  </urlset>
`;
};
