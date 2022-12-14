import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedChannelsService } from './archived-channels.service';

describe('ArchivedChannelsService', () => {
  let service: ArchivedChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedChannelsService],
    }).compile();

    service = module.get<ArchivedChannelsService>(ArchivedChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
