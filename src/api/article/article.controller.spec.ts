import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@shared/prisma/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleData, ArticleRes, ArticlesRes } from './article.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

const articleData: ArticleData = {
  slug: 'test-article',
  title: 'Test Article',
  description: 'Test Article Description',
  body: 'Body of test article',
  createdAt: '2022-04-29T07:45:41.000Z',
  updatedAt: '2022-04-29T07:45:41.000Z',
  author: {
    username: 'username',
    bio: "Users's bio",
    image: 'Image of user',
    following: true,
  },
  tagList: ['Regular animals', 'Tropical animals'],
  favorited: false,
  favoritesCount: 1,
};

const articleList: ArticlesRes = {
  articles: [articleData],
  articlesCount: 1,
};

const articleRes: ArticleRes = {
  article: articleData,
};

const updateArticleDto: UpdateArticleDto = {
  title: 'Test - change body',
  body: 'Test - change body',
  description: 'Test - change description',
};

const createArticleDto: CreateArticleDto = {
  title: 'How to train your dragon by myself',
  description: 'Ever wonder how?',
  body: 'Very carefully.',
  tagList: ['training', 'dragons'],
};

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [ArticleService, PrismaService],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return an array of articles', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(articleList);
      expect(await controller.findAll({}, undefined)).toBe(articleList);
    });
  });

  describe('findOne', () => {
    it('Should return an article by given slug', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(articleRes);
      expect(await controller.findOne('test-article', undefined)).toBe(
        articleRes
      );
    });
  });

  describe('feed', () => {
    it('Should return an feed (array) of articles', async () => {
      const spy = jest.spyOn(service, 'feed').mockResolvedValue(articleList);
      const feed = controller.feed({}, undefined);
      expect(spy).toBeCalledWith({}, undefined);
      expect(await feed).toBe(articleList);
    });
  });

  describe('update', () => {
    it('Should pass data for article update', async () => {
      const spy = jest.spyOn(service, 'update').mockResolvedValue(articleRes);
      const update = controller.update('test-article', updateArticleDto, 3);
      expect(spy).toBeCalledWith('test-article', updateArticleDto, 3);
      expect(await update).toBe(articleRes);
    });
  });

  describe('create', () => {
    it('Should pass data create an article', async () => {
      const newArticle = {
        id: 1,
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Article Description',
        body: 'Body of test article',
        createdAt: new Date('2022-04-29T07:45:41.000Z'),
        updatedAt: new Date('2022-04-29T07:45:41.000Z'),
        author: {
          username: 'username',
          bio: "Users's bio",
          image: 'Image of user',
          followedBy: [{ id: 3 }],
        },
        authorId: 3,
        published: false,
        tagList: [{ name: 'Regular animals' }, { name: 'Tropical animals' }],
        favoritedBy: [{ id: 1 }],
      };
      const spyPrisma = jest
        .spyOn(prismaService.article, 'create')
        .mockResolvedValue(newArticle);
      const spyService = jest.spyOn(service, 'create');
      const create = controller.create(createArticleDto, 3);
      expect(await create).toStrictEqual(articleRes);
    });
  });
});
