export interface ArticleData {
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

export interface ArticleRes {
  article: ArticleData;
}

export interface ArticlesRes {
  articles: ArticleData[];
  articlesCount: number;
}

export interface CommentData {
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
