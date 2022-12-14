import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedVideosController } from './archived-videos.controller';

describe('ArchivedVideosController', () => {
  let controller: ArchivedVideosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivedVideosController],
    }).compile();

    controller = module.get<ArchivedVideosController>(ArchivedVideosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
