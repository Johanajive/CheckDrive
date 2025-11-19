import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesDocumentsController } from './vehicles-documents.controller';

describe('VehiclesDocumentsController', () => {
  let controller: VehiclesDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesDocumentsController],
    }).compile();

    controller = module.get<VehiclesDocumentsController>(VehiclesDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
