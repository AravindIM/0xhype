import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PostsService } from './posts.service';
import { Post } from './post.entity';

const mockRepository = {
  findOneBy: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockCacheManager = {
  get: jest.fn().mockResolvedValue(undefined),
  set: jest.fn().mockResolvedValue(undefined),
  del: jest.fn().mockResolvedValue(undefined),
};

const makePost = (postid: number): Post =>
  ({
    postid,
    title: `t${postid}`,
    link: `https://e.com/${postid}`,
    date: new Date(),
    user: { username: 'bob', displayName: 'Bob' },
  }) as unknown as Post;

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCacheManager.get.mockResolvedValue(undefined);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockRepository },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll (keyset pagination)', () => {
    it('orders by postid DESC and fetches limit + 1 rows', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll({ limit: 20 });
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { postid: 'DESC' }, take: 21 }),
      );
    });

    it('trims the extra row and sets nextCursor when more exist', async () => {
      // limit 2 -> repo returns 3 rows (ids 5,4,3); nextCursor = last kept (4)
      mockRepository.find.mockResolvedValueOnce([
        makePost(5),
        makePost(4),
        makePost(3),
      ]);
      const page = await service.findAll({ limit: 2 });
      expect(page.items.map((p) => p.postid)).toEqual([5, 4]);
      expect(page.nextCursor).toBe(4);
    });

    it('returns nextCursor null on the last page', async () => {
      mockRepository.find.mockResolvedValueOnce([makePost(2), makePost(1)]);
      const page = await service.findAll({ limit: 20 });
      expect(page.items.map((p) => p.postid)).toEqual([2, 1]);
      expect(page.nextCursor).toBeNull();
    });

    it('applies a LessThan filter when a cursor is given', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll({ limit: 20, cursor: 10 });
      const arg = mockRepository.find.mock.calls[0][0];
      expect(arg.where.postid).toBeDefined();
    });

    it('caches only the first default page', async () => {
      mockRepository.find.mockResolvedValue([makePost(1)]);
      await service.findAll({ limit: 20 });
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        'posts_first_page',
        expect.any(Object),
        expect.any(Number),
      );

      mockCacheManager.set.mockClear();
      await service.findAll({ limit: 20, cursor: 5 });
      expect(mockCacheManager.set).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('invalidates the first-page cache', async () => {
      mockRepository.create.mockReturnValue(makePost(1));
      mockRepository.save.mockResolvedValue(makePost(1));
      await service.create({ title: 't', link: 'https://e.com' }, 1);
      expect(mockCacheManager.del).toHaveBeenCalledWith('posts_first_page');
    });
  });
});
