import { Injectable } from "@nestjs/common";
import { ArticleData } from "./article.interface";

@Injectable()
export class ArticleHelper {
    
     prepareArticleDataRes(userId: number, {favoritedBy, ...article}) : ArticleData {
        return {
            slug: article.slug,
            title: article.title,
            description: article.description,
            body: article.body,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            author: article.author,
            tagList: article.tagList.map(t => t.name),
            favorited: Array.isArray(favoritedBy) && favoritedBy.map(f => f.id).includes(userId),
            favoritesCount: Array.isArray(favoritedBy) ? favoritedBy.length : 0,
        };
     };

     

    createListWhereClause(query) {
        const queries = [];
        if ('tag' in query) {
            queries.push({
                tagList: {
                    contains: query.tag,
                },
            });
        }
        if ('author' in query) {
            queries.push({
                author: {
                    username: {
                        equals: query.author,
                    },
                },
            });
        }
        if ('favorited' in query) {
            queries.push({
                favoritedBy: {
                    username: {
                        equals: query.favorited,
                    },
                },
            });
        }
        return queries;
    }
}