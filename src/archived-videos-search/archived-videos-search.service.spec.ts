import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedVideosSearchService } from './archived-videos-search.service';

describe('ArchivedVideosSearchService', () => {
  let service: ArchivedVideosSearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedVideosSearchService],
    }).compile();

    service = module.get<ArchivedVideosSearchService>(ArchivedVideosSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
