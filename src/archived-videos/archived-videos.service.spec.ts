import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedVideosService } from './archived-videos.service';

describe('ArchivedVideosService', () => {
  let service: ArchivedVideosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedVideosService],
    }).compile();

    service = module.get<ArchivedVideosService>(ArchivedVideosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
