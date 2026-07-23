import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import scrapePreview from 'open-graph-scraper';
import { PostsService } from './posts.service';
import { Post } from './post.entity';

jest.mock('open-graph-scraper');
const mockScrape = scrapePreview as jest.MockedFunction<typeof scrapePreview>;

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

  describe('genLinkPreview', () => {
    const okResponse = (result: Record<string, unknown>) =>
      ({
        error: false,
        html: '',
        response: {},
        result: { success: true, ...result },
      }) as Awaited<ReturnType<typeof scrapePreview>>;

    it('scrapes with a crawler user-agent first and a 10s timeout', async () => {
      mockScrape.mockResolvedValueOnce(okResponse({ ogTitle: 'Example' }));
      await service.genLinkPreview('https://example.com/page');
      expect(mockScrape).toHaveBeenCalledTimes(1);
      const args = mockScrape.mock.calls[0][0];
      expect(args.url).toBe('https://example.com/page');
      expect(args.timeout).toBe(10);
      const headers = (args.fetchOptions?.headers ?? {}) as Record<
        string,
        string
      >;
      expect(headers['user-agent']).toContain('facebookexternalhit');
      expect(headers['accept-language']).toBeDefined();
    });

    it('retries with a browser user-agent when the crawler hits a bot wall', async () => {
      mockScrape
        .mockResolvedValueOnce(okResponse({ ogTitle: 'Just a moment...' }))
        .mockResolvedValueOnce(okResponse({ ogTitle: 'Real Title' }));
      const preview = await service.genLinkPreview('https://example.com/');
      expect(preview.title).toBe('Real Title');
      expect(mockScrape).toHaveBeenCalledTimes(2);
      const headers = (mockScrape.mock.calls[1][0].fetchOptions?.headers ??
        {}) as Record<string, string>;
      expect(headers['user-agent']).toContain('Mozilla/5.0');
    });

    it('maps OG fields and always uses the S2 favicon', async () => {
      mockScrape.mockResolvedValueOnce(
        okResponse({
          ogTitle: 'Example Title',
          ogDescription: 'desc',
          ogImage: [{ url: 'https://example.com/og.png' }],
          ogUrl: 'https://example.com/',
          ogSiteName: 'Example',
          favicon: '/icon.png',
        }),
      );
      const preview = await service.genLinkPreview('https://example.com/');
      expect(preview).toEqual({
        title: 'Example Title',
        description: 'desc',
        image: 'https://example.com/og.png',
        url: 'https://example.com/',
        siteName: 'Example',
        siteUrl: 'example.com',
        favicon: 'https://www.google.com/s2/favicons?domain=example.com&sz=256',
      });
    });

    it('uses the S2 favicon even when the page provides none', async () => {
      mockScrape.mockResolvedValueOnce(okResponse({ ogTitle: 'Google' }));
      const preview = await service.genLinkPreview('https://www.google.com');
      expect(preview?.favicon).toBe(
        'https://www.google.com/s2/favicons?domain=www.google.com&sz=256',
      );
    });

    it('replaces bot-interstitial pages with a minimal domain preview', async () => {
      const blocked = okResponse({
        ogTitle: 'Reddit - Please wait for verification',
        ogDescription: 'Checking your browser before accessing',
        ogImage: [{ url: 'https://www.reddit.com/block.png' }],
      });
      mockScrape.mockResolvedValueOnce(blocked).mockResolvedValueOnce(blocked);
      const preview = await service.genLinkPreview('https://www.reddit.com/');
      expect(preview).toEqual({
        url: 'https://www.reddit.com/',
        siteName: 'www.reddit.com',
        siteUrl: 'www.reddit.com',
        favicon:
          'https://www.google.com/s2/favicons?domain=www.reddit.com&sz=256',
      });
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        preview,
        expect.any(Number),
      );
    });

    it('returns a minimal domain preview when the scrape rejects', async () => {
      mockScrape
        .mockRejectedValueOnce(
          new Error('The operation was aborted due to timeout'),
        )
        .mockRejectedValueOnce(
          new Error('The operation was aborted due to timeout'),
        );
      const preview = await service.genLinkPreview('https://www.reddit.com/');
      expect(preview).toEqual(
        expect.objectContaining({
          siteUrl: 'www.reddit.com',
          favicon:
            'https://www.google.com/s2/favicons?domain=www.reddit.com&sz=256',
        }),
      );
    });

    it('returns a minimal domain preview when the scrape reports failure', async () => {
      const failed = {
        error: true,
        html: '',
        response: {},
        result: { success: false },
      } as unknown as Awaited<ReturnType<typeof scrapePreview>>;
      mockScrape.mockResolvedValueOnce(failed).mockResolvedValueOnce(failed);
      const preview = await service.genLinkPreview('https://example.com/');
      expect(preview).toEqual(
        expect.objectContaining({ siteName: 'example.com' }),
      );
    });

    it('returns the cached preview without scraping', async () => {
      const cached = { title: 'Cached', siteUrl: 'e.com' };
      mockCacheManager.get.mockResolvedValueOnce(cached);
      const preview = await service.genLinkPreview('https://e.com/');
      expect(preview).toBe(cached);
      expect(mockScrape).not.toHaveBeenCalled();
    });

    it('caches a preview that has an image for one hour', async () => {
      mockScrape.mockResolvedValueOnce(
        okResponse({
          ogTitle: 'Example Title',
          ogImage: [{ url: 'https://example.com/og.png' }],
        }),
      );
      await service.genLinkPreview('https://example.com/');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ image: 'https://example.com/og.png' }),
        3_600_000,
      );
    });

    it('caches a preview without an image for five minutes', async () => {
      mockScrape.mockResolvedValueOnce(okResponse({ ogTitle: 'No Image' }));
      await service.genLinkPreview('https://example.com/');
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ title: 'No Image' }),
        300_000,
      );
    });
  });
});
