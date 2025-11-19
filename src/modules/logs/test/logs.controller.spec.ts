import { Test, TestingModule } from '@nestjs/testing';
import { LogsController } from '../logs.controller';
import { LogsService } from '../logs.service';
import { logMock } from './log.mock';

describe('LogsController', () => {
  let controller: LogsController;

  const mockService = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogsController],
      providers: [
        {
          provide: LogsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LogsController>(LogsController);
    jest.clearAllMocks();
  });

  it('Debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  // GET ALL
  it('Debe obtener todos los logs', async () => {
    mockService.findAll.mockResolvedValue([logMock]);

    const result = await controller.getAllLogs();

    expect(result).toEqual([logMock]);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  // CREATE
  it('Debe crear un log', async () => {
    mockService.create.mockResolvedValue(logMock);

    const dto = {
      date: logMock.date,
      host: logMock.host,
      service: logMock.service,
      content: logMock.content,
    };

    const result = await controller.createLog(dto);

    expect(result).toEqual(logMock);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });
});

