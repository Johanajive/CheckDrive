import { Test, TestingModule } from '@nestjs/testing';
// The service name is being corrected from 'QuotesService' 
// to 'AppointmentsService' to match the file/folder name 'appointments'
import { AppointmentsService } from './appointments.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});