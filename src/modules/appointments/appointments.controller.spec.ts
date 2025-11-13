import { Test, TestingModule } from '@nestjs/testing';
// The controller name is being corrected from 'QuotesController' 
// to 'AppointmentsController' to match the file/folder name 'appointments'
import { AppointmentsController } from './appointments.controller'; 

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});