import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedChannelsScheduler } from './archived-channels.scheduler';

describe('ArchivedChannelsScheduler', () => {
  let scheduler: ArchivedChannelsScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedChannelsScheduler],
    }).compile();

    scheduler = module.get<ArchivedChannelsScheduler>(ArchivedChannelsScheduler);
  });

  it('should be defined', () => {
    expect(scheduler).toBeDefined();
  });
});
