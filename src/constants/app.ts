export const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_PATTERN = /^.{8,}$/;
export const PHONE_PATTERN = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

export const PAGE_SEO_TITLE = 'TraderHub';
export const PAGE_SEO_DESCRIPTION =
  'Traderhub là diễn đàn tài chính hàng đầu để các trader có thể thảo luận về các lĩnh vực đầu tư tài chính như forex, cryptocurrency, hàng hoá, chứng khoán quốc tế, chứng khoán phái sinh... để tìm ra chiến lược giao dịch thành công cho bản thân.';
export const PAGE_SEO_IMG = '/traderhub-meta.png';

export const APP_VERTICAL = {
  FORUM: 'forum',
  NEWS: 'news',
  ACADEMY: 'academy',
};

export const AUTHEN_PROVIDER = {
  LOCAL: 'local',
  FACEBOOK: 'facebook',
  GOOGLE: 'google',
};

export const POINT_MAP = {
  master: 1000,
  professional: 500,
  experienced: 100,
};

export const ANSWER_TYPE = {
  FORUM: 'forum',
  ARTICLE: 'article',
};

export const ARTICLE_TYPE = {
  NEWS: 'news',
  ACADEMY: 'academy',
};

export const ARTICLE_CATEGORY_TYPE = {
  NEWS: 'news',
  ACADEMY: 'academy',
};

export const PAGE_SIZE = 20;

export const SITE_HOSTS = ['traderhub.vn', 'localhost:3000'];
