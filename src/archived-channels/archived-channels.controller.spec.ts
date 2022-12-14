import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedChannelsController } from './archived-channels.controller';

describe('ArchivedChannelsController', () => {
  let controller: ArchivedChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivedChannelsController],
    }).compile();

    controller = module.get<ArchivedChannelsController>(ArchivedChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
