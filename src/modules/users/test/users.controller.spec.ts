
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userMock } from './user.mock';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findName: jest.fn(),
    findDocument: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    disabled: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('Debe estar definido', () => expect(controller).toBeDefined());

  it('Debe retornar todos los usuarios', async () => {
    mockUsersService.findAll.mockResolvedValue([userMock]);
    expect(await controller.findAll()).toEqual([userMock]);
  });

  it('Debe retornar usuario por ID', async () => {
    mockUsersService.findOne.mockResolvedValue(userMock);
    expect(await controller.findOne(1)).toEqual(userMock);
  });

  it('Debe retornar por nombre', async () => {
    mockUsersService.findName.mockResolvedValue([userMock]);
    expect(await controller.findName('Johana')).toEqual([userMock]);
  });

  it('Debe retornar por documento', async () => {
    mockUsersService.findDocument.mockResolvedValue([userMock]);
    expect(await controller.findDocument(123456789)).toEqual([userMock]);
  });

  it('Debe crear usuario', async () => {
    mockUsersService.create.mockResolvedValue(userMock);
    expect(await controller.create(userMock)).toEqual(userMock);
  });

  it('Debe actualizar usuario', async () => {
    mockUsersService.update.mockResolvedValue(userMock);
    expect(await controller.update(1, userMock)).toEqual(userMock);
  });

  it('Debe desactivar usuario', async () => {
    mockUsersService.disabled.mockResolvedValue({
      message: `Usuario con ID 1 desactivado correctamente`,
    });

    expect(await controller.disabled(1)).toEqual({
      message: `Usuario con ID 1 desactivado correctamente`,
    });
  });
});


