export class ArticleData {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList?: string[];
  createdAt: string;
  updatedAt?: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}

export class ArticleRes {
  article: ArticleData;
}

export class ArticlesRes {
  articles: ArticleData[];
  articlesCount: number;
}

export class CommentData {
  id: number;
  createdAt: string;
  updatedAt?: string;
  body: string;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}

export interface CommentRes {
  comment: CommentData;
}

export interface CommentsRes {
  comments: CommentData[];
}
