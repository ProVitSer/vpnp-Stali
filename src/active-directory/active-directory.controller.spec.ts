import { Test, TestingModule } from '@nestjs/testing';
import { ActiveDirectoryController } from './active-directory.controller';

describe('ActiveDirectoryController', () => {
  let controller: ActiveDirectoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveDirectoryController],
    }).compile();

    controller = module.get<ActiveDirectoryController>(ActiveDirectoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
