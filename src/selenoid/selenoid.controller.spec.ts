import { Test, TestingModule } from '@nestjs/testing';
import { SelenoidController } from './selenoid.controller';

describe('SelenoidController', () => {
  let controller: SelenoidController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SelenoidController],
    }).compile();

    controller = module.get<SelenoidController>(SelenoidController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
