import { Comment } from "@prisma/client"

export interface ArticleData {
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList?: string[],
    createdAt: string,
    updatedAt?: string,
    favorited: boolean,
    favoritesCount: number,
    author: {
        username: string,
        bio?: string,
        image?: string,
        following: boolean
    }
}

export interface ArticleRes {
    article: ArticleData
}

export interface ArticlesRes {
    articles: ArticleData[],
    articlesCount: number
}

export interface CommentRes {
    comment: Comment
}

export interface CommentsRes {
    comments: Comment[]
}
