import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedVideosScheduler } from './archived-videos.scheduler';

describe('ArchivedVideosScheduler', () => {
  let scheduler: ArchivedVideosScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedVideosScheduler],
    }).compile();

    scheduler = module.get<ArchivedVideosScheduler>(ArchivedVideosScheduler);
  });

  it('should be defined', () => {
    expect(scheduler).toBeDefined();
  });
});
