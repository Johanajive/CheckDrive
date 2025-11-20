import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payments } from './entity/payments.entity';
import { VehicleEntity } from '../vehicles-documents/entity/vehicle.entity';
import { ServiceTypeEnum } from '../../common/enum/service.type.enum';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentsRepository: Repository<Payments>;
  let vehicleRepository: Repository<VehicleEntity>;

  // Mocks de los repositorios
  const mockPaymentsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockVehicleRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payments),
          useValue: mockPaymentsRepository,
        },
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: mockVehicleRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    paymentsRepository = module.get<Repository<Payments>>(
      getRepositoryToken(Payments),
    );
    vehicleRepository = module.get<Repository<VehicleEntity>>(
      getRepositoryToken(VehicleEntity),
    );

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ==========================================
  // TESTS PARA findAll()
  // ==========================================
  describe('findAll', () => {
    it('debe retornar un array de pagos', async () => {
      const mockPayments = [
        { id_payment: 1, amount: 100000, serviceType: ServiceTypeEnum.SOAT },
        { id_payment: 2, amount: 50000, serviceType: ServiceTypeEnum.REVISION },
      ];

      mockPaymentsRepository.find.mockResolvedValue(mockPayments);

      const result = await service.findAll();

      expect(result).toEqual(mockPayments);
      expect(mockPaymentsRepository.find).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío si no hay pagos', async () => {
      mockPaymentsRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockPaymentsRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // TESTS PARA findOne()
  // ==========================================
  describe('findOne', () => {
    it('debe retornar un pago por ID', async () => {
      const mockPayment = { id_payment: 1, amount: 100000 };
      mockPaymentsRepository.findOne.mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentsRepository.findOne).toHaveBeenCalledWith({
        where: { id_payment: 1 },
      });
    });

    it('debe retornar null si el pago no existe', async () => {
      mockPaymentsRepository.findOne.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  // ==========================================
  // TESTS PARA createPay() - CASOS NO SOAT
  // ==========================================
  describe('createPay - Pagos NO SOAT', () => {
    it('debe crear un pago de TECNOMECANICA con el monto proporcionado', async () => {
      const C: CreatePaymentDto = {
        amount: 75000,
        serviceType: ServiceTypeEnum.REVISION,
        id_vehicle: 1,
      };

      const mockCreatedPayment = { id_payment: 1, ...createDto };

      mockPaymentsRepository.create.mockReturnValue(mockCreatedPayment);
      mockPaymentsRepository.save.mockResolvedValue(mockCreatedPayment);

      const result = await service.createPay(createDto);

      expect(result).toEqual(mockCreatedPayment);
      expect(mockPaymentsRepository.create).toHaveBeenCalledWith({
        ...createDto,
        amount: 75000, // Mantiene el monto original
      });
      expect(mockPaymentsRepository.save).toHaveBeenCalledWith(mockCreatedPayment);
    });
  });

  // ==========================================
  // TESTS PARA createPay() - SOAT MOTOS
  // ==========================================
  describe('createPay - SOAT Motos', () => {
    it('debe calcular SOAT para moto < 100cc (243700)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 1,
        type: 'Moto',
        engine_displacement: 90,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 243700,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 1,
        ...createDto,
        amount: 243700,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(243700);
      expect(mockVehicleRepository.findOne).toHaveBeenCalledWith({
        where: { id_vehicle: 1 },
      });
    });

    it('debe calcular SOAT para moto 100-200cc (326600)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 2,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 2,
        type: 'Moto',
        engine_displacement: 150,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 326600,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 2,
        ...createDto,
        amount: 326600,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(326600);
    });

    it('debe calcular SOAT para moto > 200cc (758600)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 3,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 3,
        type: 'Moto',
        engine_displacement: 650,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 758600,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 3,
        ...createDto,
        amount: 758600,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(758600);
    });
  });

  // ==========================================
  // TESTS PARA createPay() - SOAT CARROS
  // ==========================================
  describe('createPay - SOAT Carros', () => {
    it('debe calcular SOAT para carro < 1500cc (590400)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 4,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 4,
        type: 'Carro',
        engine_displacement: 1400,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 590400,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 4,
        ...createDto,
        amount: 590400,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(590400);
    });

    it('debe calcular SOAT para carro 1500-2500cc (674700)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 5,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 5,
        type: 'Carro',
        engine_displacement: 2000,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 674700,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 5,
        ...createDto,
        amount: 674700,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(674700);
    });

    it('debe calcular SOAT para carro > 2500cc (751300)', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 6,
      };

      const mockVehicle: VehicleEntity = {
        id_vehicle: 6,
        type: 'Carro',
        engine_displacement: 3500,
      } as VehicleEntity;

      mockVehicleRepository.findOne.mockResolvedValue(mockVehicle);
      mockPaymentsRepository.create.mockReturnValue({
        ...createDto,
        amount: 751300,
      });
      mockPaymentsRepository.save.mockResolvedValue({
        id_payment: 6,
        ...createDto,
        amount: 751300,
      });

      const result = await service.createPay(createDto);

      expect(result.amount).toBe(751300);
    });
  });

  // ==========================================
  // TESTS PARA createPay() - CASOS DE ERROR
  // ==========================================
  describe('createPay - Validaciones de error', () => {
    it('debe lanzar error si SOAT sin id_vehicle', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: undefined,
      };

      await expect(service.createPay(createDto)).rejects.toThrow(
        'Para pagar el SOAT se requiere un id_vehicle',
      );
    });

    it('debe lanzar error si el vehículo no existe', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 999,
      };

      mockVehicleRepository.findOne.mockResolvedValue(null);

      await expect(service.createPay(createDto)).rejects.toThrow(
        'El vehículo con ese id no existe',
      );
    });
  });

  // ==========================================
  // TESTS PARA updatePay()
  // ==========================================
  describe('updatePay', () => {
    it('debe actualizar un pago y retornarlo', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 150000,
      };

      const updatedPayment = {
        id_payment: 1,
        amount: 150000,
        serviceType: ServiceTypeEnum.SOAT,
      };

      mockPaymentsRepository.update.mockResolvedValue({ affected: 1 });
      mockPaymentsRepository.findOne.mockResolvedValue(updatedPayment);

      const result = await service.updatePay(1, updateDto);

      expect(result).toEqual(updatedPayment);
      expect(mockPaymentsRepository.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockPaymentsRepository.findOne).toHaveBeenCalledWith({
        where: { id_payment: 1 },
      });
    });

    it('debe retornar null si el pago a actualizar no existe', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 150000,
      };

      mockPaymentsRepository.update.mockResolvedValue({ affected: 0 });
      mockPaymentsRepository.findOne.mockResolvedValue(null);

      const result = await service.updatePay(999, updateDto);

      expect(result).toBeNull();
    });
  });
});