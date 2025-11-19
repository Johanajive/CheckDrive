import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { userMock } from './user.mock';
import { NotFoundException } from '@nestjs/common';
import { LogsService } from 'src/modules/logs/logs.service';
import { mockLogsService } from './logs.mock';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    update: jest.fn(),    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository,
        },
        {
          provide: LogsService,
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));

    jest.clearAllMocks();
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  // GET ALL
  it('Debe retornar todos los usuarios', async () => {
    mockRepository.find.mockResolvedValue([userMock]);

    const result = await service.findAll();

    expect(result).toEqual([userMock]);
  });

  // FIND ONE
  it('Debe retornar un usuario por ID', async () => {
    mockRepository.findOne.mockResolvedValue(userMock);

    const result = await service.findOne(1);

    expect(result).toEqual(userMock);
  });

  it('Debe lanzar error si el usuario no existe', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  // UPDATE (CORREGIDO)
  it('Debe actualizar usuario', async () => {
    mockRepository.findOne.mockResolvedValue(userMock);
    mockRepository.preload.mockResolvedValue(userMock);
    mockRepository.save.mockResolvedValue(userMock);

    const result = await service.update(1, userMock);

    expect(result).toEqual(userMock);
  });

  it('Debe lanzar error al actualizar si no existe', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.preload.mockResolvedValue(null);

    await expect(service.update(1, userMock)).rejects.toThrow(NotFoundException);
  });

  // DISABLED (CORREGIDO)
  it('Debe desactivar un usuario', async () => {
    const disabledUser = { ...userMock, status: false };

    mockRepository.findOne.mockResolvedValue(userMock);
    mockRepository.save.mockResolvedValue(disabledUser);

    const result = await service.disabled(1);

    expect(result).toEqual({
      message: `Usuario con el ID 1 ha sido desactivado correctamente`,
      userFind: disabledUser,
    });
  });

  it('Debe lanzar error si el usuario no existe al desactivar', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    await expect(service.disabled(1)).rejects.toThrow(NotFoundException);
  });
});

