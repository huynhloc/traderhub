// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type CallBack = (error?: unknown, data?: unknown) => void;

export type AppConfig = {
  academyVideo?: string;
  head?: string;
};

export type Tag = {
  value: string;
  key: string;
  count: number;
};

export type TFile = {
  file?: Blob;
  name?: string;
  url?: string; // existed image
};

export type ServerError = { id: string; message: string };

export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  avatar: {
    id: string;
    url: string;
  };
  point: number;
  totalQuestion: number;
  totalAnswer: number;
  totalComment: number;
  address: string;
  intro: string;
  phone: string;
  provider: string;
  likedForumQuestions: string[];
  likedAnswers: string[];
  likedComments: string[];
  likedArticles: string[];
  connect?: { provider: string; email: string }[];
  hasPass: boolean;
};

export type Comment = {
  id: string;
  content: string;
  answer: string | Answer;
  createdAt: string;
  author: User;
  totalLike: number;
  tags?: { userId: string; name: string }[];
  images: {
    url: string;
  }[];
};

export type Answer = {
  id: string;
  content: string;
  forumQuestion: string | ForumQuestion;
  article: string | Article;
  createdAt: string;
  author: User;
  comments?: Comment[];
  totalComment: number;
  totalLike: number;
  type: string;
  images: {
    url: string;
  }[];
};

export type ForumQuestion = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  author: User;
  forumTopic: ForumTopic;
  answers?: Answer[];
  forumHashtags?: ForumHashtag[];
  totalAnswer: number;
  totalComment: number;
  totalLike: number;
  totalView: number;
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
  toc?: { text: string; id: string }[];
};

export type ForumTopic = {
  id: string;
  slug: string;
  name: string;
  description: string;
  createdAt: string;
  forumCategory: ForumCategory;
  forumQuestions?: ForumQuestion[];
  totalQuestion: number;
  totalAnswer: number;
  totalComment: number;
  tagcloud: Tag[];
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
};

export type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: {
    url: string;
  };
  forumTopics?: ForumTopic[];
  totalTopic: number;
  totalForumQuestionInWeek: number;
  totalForumQuestionInDay: number;
  tagcloud: Tag[];
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
};

export type SubMenuItem = {
  href: string;
  title: string;
};

export type NavItem = {
  href: string;
  title: string;
  subItems?: SubMenuItem[];
};

export type RequestOpenContextMenuFn = (
  event: React.MouseEvent<HTMLElement>,
  payload: {
    question?: ForumQuestion;
    answer?: Answer;
    comment?: Comment;
  }
) => void;

export type Article = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  totalLike: number;
  totalView: number;
  point: string;
  type: string;
  totalAnswer: number;
  answers: Answer[];
  articleCategory: string | ArticleCategory;
  relatedArticles: Article[];
  createdAt: string;
  created_by: {
    firstname: string;
    lastname: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
  toc?: { text: string; id: string }[];
};

export type ArticleCategory = {
  _id: string;
  id: string;
  slug: string;
  name: string;
  type: string;
  thumbnail: {
    url: string;
    formats?: {
      thumbnail?: {
        url?: string;
      };
    };
  };
  description?: string;
  articles?: Article[];
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
};

export type Webinar = {
  id: string;
  event: string;
  description?: string;
  date: string;
  fromTime: string;
  toTime: string;
  thumbnail: {
    url: string;
    formats?: {
      small?: {
        url?: string;
      };
    };
  };
};

export type WebinarGroupByMonth = {
  _id: string;
  webinars: Webinar[];
}[];

export type ForumHashtag = {
  id: string;
  slug: string;
  name: string;
  point: number;
  seoTitle?: string;
  seoDescription?: string;
  seoImg?: string;
};
