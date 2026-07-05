import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockPostsService = {
  findAll: jest.fn().mockResolvedValue({ items: [], nextCursor: null }),
  find: jest.fn().mockResolvedValue(null),
  create: jest.fn(),
  genLinkPreview: jest.fn().mockResolvedValue(null),
};

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the pagination query through and returns { items, nextCursor }', async () => {
    mockPostsService.findAll.mockResolvedValueOnce({
      items: [
        {
          postid: 7,
          title: 't',
          link: 'https://e.com',
          date: new Date(),
          user: { username: 'bob', displayName: 'Bob' },
        },
      ],
      nextCursor: 7,
    });

    const query = { limit: 20, cursor: 9 };
    const res = await controller.fetchPosts(query as any);

    expect(mockPostsService.findAll).toHaveBeenCalledWith(query);
    expect(res.nextCursor).toBe(7);
    expect(res.items).toEqual([
      {
        postid: 7,
        title: 't',
        link: 'https://e.com',
        date: expect.any(Date),
        username: 'bob',
        displayName: 'Bob',
      },
    ]);
  });
});
