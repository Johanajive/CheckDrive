import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogsService } from '../logs.service';
import { Logs } from '../entity/logs.entity';
import { logMock } from './log.mock';

describe('LogsService', () => {
  let service: LogsService;
  let repository: Repository<Logs>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogsService,
        {
          provide: getRepositoryToken(Logs),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LogsService>(LogsService);
    repository = module.get<Repository<Logs>>(getRepositoryToken(Logs));

    jest.clearAllMocks();
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // CREATE
  it('Debe crear un log', async () => {
    mockRepository.create.mockReturnValue(logMock);
    mockRepository.save.mockResolvedValue(logMock);

    const dto = {
      date: logMock.date,
      host: logMock.host,
      service: logMock.service,
      content: logMock.content,
    };

    const result = await service.create(dto);

    expect(result).toEqual(logMock);
    expect(mockRepository.create).toHaveBeenCalledWith(dto);
    expect(mockRepository.save).toHaveBeenCalledWith(logMock);
  });

  // FIND ALL
  it('Debe retornar todos los logs', async () => {
    mockRepository.find.mockResolvedValue([logMock]);

    const result = await service.findAll();

    expect(result).toEqual([logMock]);
    expect(mockRepository.find).toHaveBeenCalledWith({
      order: { date: 'DESC' },
    });
  });
});

