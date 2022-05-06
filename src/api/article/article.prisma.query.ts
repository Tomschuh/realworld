import { PaginationDto } from "@shared/dto/pagination.dto";
import { ArticleListQueryDto } from "./dto/article-list-query.dto";

const authorInclude = {
  select: {
    username: true,
    bio: true,
    image: true,
    followedBy: {
      select: {
        id: true,
      },
    },
  },
};

const tagInclude = {
  select: {
    name: true,
  },
};

const favoritedByInclude = {
  select: {
    id: true,
  },
};

export const articleInclude = {
  author: authorInclude,
  tagList: tagInclude,
  favoritedBy: favoritedByInclude,
};

export const commentInclude = {
  author: authorInclude,
};

export const createListWhereClause = (query: ArticleListQueryDto) => {
  const queries = [];
  if (query.tag) {
    queries.push({
      tagList: {
        some: {
          name: query.tag,
        },
      },
    });
  }
  if (query.author) {
    queries.push({
      author: {
        username: {
          equals: query.author,
        },
      },
    });
  }
  if (query.favorited) {
    queries.push({
      favoritedBy: {
        some: {
          username: query.favorited,
        },
      },
    });
  }
  return queries;
};
