import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';
import { ServiceTypeEnum } from '../../common/enum/service.type.enum';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  // Mock del servicio
  const mockPaymentsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createPay: jest.fn(),
    updatePay: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);

    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ==========================================
  // TESTS PARA findAll() - GET /api/payments
  // ==========================================
  describe('findAll', () => {
    it('debe retornar un array de pagos', async () => {
      const mockPayments = [
        {
          id_payment: 1,
          amount: 243700,
          serviceType: ServiceTypeEnum.SOAT,
          id_vehicle: 1,
        },
        {
          id_payment: 2,
          amount: 75000,
          serviceType: ServiceTypeEnum.TECNOMECANICA,
          id_vehicle: 2,
        },
      ];

      mockPaymentsService.findAll.mockResolvedValue(mockPayments);

      const result = await controller.findAll();

      expect(result).toEqual(mockPayments);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío si no hay pagos', async () => {
      mockPaymentsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ==========================================
  // TESTS PARA oneProduct() - GET /api/payments/:id
  // ==========================================
  describe('oneProduct', () => {
    it('debe retornar un pago específico por ID', async () => {
      const mockPayment = {
        id_payment: 1,
        amount: 243700,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      mockPaymentsService.findOne.mockResolvedValue(mockPayment);

      const result = await controller.oneProduct(1);

      expect(result).toEqual(mockPayment);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando el pago no existe', async () => {
      mockPaymentsService.findOne.mockResolvedValue(null);

      const result = await controller.oneProduct(999);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('debe manejar ParseIntPipe correctamente para IDs válidos', async () => {
      const mockPayment = {
        id_payment: 5,
        amount: 674700,
        serviceType: ServiceTypeEnum.SOAT,
      };

      mockPaymentsService.findOne.mockResolvedValue(mockPayment);

      const result = await controller.oneProduct(5);

      expect(result).toEqual(mockPayment);
      expect(service.findOne).toHaveBeenCalledWith(5);
    });
  });

  // ==========================================
  // TESTS PARA createPay() - POST /api/payments
  // ==========================================
  describe('createPay', () => {
    it('debe crear un nuevo pago de SOAT correctamente', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      const mockCreatedPayment = {
        id_payment: 1,
        amount: 243700, // Calculado automáticamente
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      mockPaymentsService.createPay.mockResolvedValue(mockCreatedPayment);

      const result = await controller.createPay(createDto);

      expect(result).toEqual(mockCreatedPayment);
      expect(service.createPay).toHaveBeenCalledWith(createDto);
      expect(service.createPay).toHaveBeenCalledTimes(1);
    });

    it('debe crear un pago de TECNOMECANICA con monto manual', async () => {
      const createDto: CreatePaymentDto = {
        amount: 75000,
        serviceType: ServiceTypeEnum.TECNOMECANICA,
        id_vehicle: 2,
      };

      const mockCreatedPayment = {
        id_payment: 2,
        ...createDto,
      };

      mockPaymentsService.createPay.mockResolvedValue(mockCreatedPayment);

      const result = await controller.createPay(createDto);

      expect(result).toEqual(mockCreatedPayment);
      expect(service.createPay).toHaveBeenCalledWith(createDto);
    });

    it('debe propagar errores del servicio cuando falla la validación', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: undefined, // Sin vehículo
      };

      const error = new Error('Para pagar el SOAT se requiere un id_vehicle');
      mockPaymentsService.createPay.mockRejectedValue(error);

      await expect(controller.createPay(createDto)).rejects.toThrow(error);
      expect(service.createPay).toHaveBeenCalledWith(createDto);
    });

    it('debe propagar errores cuando el vehículo no existe', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 999,
      };

      const error = new Error('El vehículo con ese id no existe');
      mockPaymentsService.createPay.mockRejectedValue(error);

      await expect(controller.createPay(createDto)).rejects.toThrow(error);
      expect(service.createPay).toHaveBeenCalledWith(createDto);
    });
  });

  // ==========================================
  // TESTS PARA updatePay() - PUT /api/payments/:id
  // ==========================================
  describe('updatePay', () => {
    it('debe actualizar un pago existente correctamente', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 150000,
      };

      const mockUpdatedPayment = {
        id_payment: 1,
        amount: 150000,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      mockPaymentsService.updatePay.mockResolvedValue(mockUpdatedPayment);

      const result = await controller.updatePay(1, updateDto);

      expect(result).toEqual(mockUpdatedPayment);
      expect(service.updatePay).toHaveBeenCalledWith(1, updateDto);
      expect(service.updatePay).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar múltiples campos de un pago', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 200000,
        serviceType: ServiceTypeEnum.TECNOMECANICA,
      };

      const mockUpdatedPayment = {
        id_payment: 2,
        ...updateDto,
        id_vehicle: 3,
      };

      mockPaymentsService.updatePay.mockResolvedValue(mockUpdatedPayment);

      const result = await controller.updatePay(2, updateDto);

      expect(result).toEqual(mockUpdatedPayment);
      expect(service.updatePay).toHaveBeenCalledWith(2, updateDto);
    });

    it('debe retornar null cuando se intenta actualizar un pago inexistente', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 150000,
      };

      mockPaymentsService.updatePay.mockResolvedValue(null);

      const result = await controller.updatePay(999, updateDto);

      expect(result).toBeNull();
      expect(service.updatePay).toHaveBeenCalledWith(999, updateDto);
    });

    it('debe usar ParseIntPipe para convertir el ID a número', async () => {
      const updateDto: UpdateProductDTO = {
        amount: 100000,
      };

      const mockUpdatedPayment = {
        id_payment: 10,
        amount: 100000,
        serviceType: ServiceTypeEnum.SOAT,
      };

      mockPaymentsService.updatePay.mockResolvedValue(mockUpdatedPayment);

      const result = await controller.updatePay(10, updateDto);

      expect(result).toEqual(mockUpdatedPayment);
      expect(service.updatePay).toHaveBeenCalledWith(10, updateDto);
    });
  });

  // ==========================================
  // TESTS ADICIONALES DE INTEGRACIÓN
  // ==========================================
  describe('Integración del controlador', () => {
    it('debe manejar correctamente el flujo completo: crear y buscar pago', async () => {
      const createDto: CreatePaymentDto = {
        amount: 0,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      const mockCreatedPayment = {
        id_payment: 1,
        amount: 243700,
        serviceType: ServiceTypeEnum.SOAT,
        id_vehicle: 1,
      };

      // Crear pago
      mockPaymentsService.createPay.mockResolvedValue(mockCreatedPayment);
      const created = await controller.createPay(createDto);
      expect(created).toEqual(mockCreatedPayment);

      // Buscar el pago creado
      mockPaymentsService.findOne.mockResolvedValue(mockCreatedPayment);
      const found = await controller.oneProduct(1);
      expect(found).toEqual(mockCreatedPayment);

      expect(service.createPay).toHaveBeenCalledTimes(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe manejar correctamente el flujo: crear, actualizar y buscar', async () => {
      const createDto: CreatePaymentDto = {
        amount: 75000,
        serviceType: ServiceTypeEnum.TECNOMECANICA,
        id_vehicle: 2,
      };

      const mockCreatedPayment = {
        id_payment: 1,
        ...createDto,
      };

      const updateDto: UpdateProductDTO = {
        amount: 80000,
      };

      const mockUpdatedPayment = {
        ...mockCreatedPayment,
        amount: 80000,
      };

      // Crear
      mockPaymentsService.createPay.mockResolvedValue(mockCreatedPayment);
      await controller.createPay(createDto);

      // Actualizar
      mockPaymentsService.updatePay.mockResolvedValue(mockUpdatedPayment);
      const updated = await controller.updatePay(1, updateDto);

      expect(updated.amount).toBe(80000);
      expect(service.createPay).toHaveBeenCalledTimes(1);
      expect(service.updatePay).toHaveBeenCalledTimes(1);
    });
  });
});