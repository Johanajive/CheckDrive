import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesDocumentsController } from '../vehicles-documents.controller';
import { VehiclesDocumentsService } from '../vehicles-documents.service';

describe('VehiclesDocumentsController', () => {
  let controller: VehiclesDocumentsController;
  let service: jest.Mocked<VehiclesDocumentsService>;

  beforeEach(async () => {
    const mockService = {
      getAllVehicles: jest.fn(),
      getAllVehiclesWithDocuments: jest.fn(),
      getVehicleByPlate: jest.fn(),
      createVehicle: jest.fn(),
      updateVehicle: jest.fn(),
      createDocument: jest.fn(),
      getDocumentsByVehiclePlate: jest.fn(),
      getAllDocumentTypes: jest.fn(),
      createDocumentType: jest.fn(),
      updateDocumentType: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesDocumentsController],
      providers: [
        { provide: VehiclesDocumentsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<VehiclesDocumentsController>(VehiclesDocumentsController);
    service = module.get(VehiclesDocumentsService) as jest.Mocked<VehiclesDocumentsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllVehicles should return vehicles list (typed)', async () => {
    // IMPORTANT: the mock object must match the actual structure expected by your code
    const expected = [
      { id_vehicle: 1, plate: 'ABC123', brand: 'Toyota', model: 'Corolla', type: 'Sedan', created_at: new Date(), updated_at: new Date() },
    ];
    service.getAllVehicles.mockResolvedValue(expected as any);

    const result = await controller.getAllVehicles();
    expect(result).toEqual(expected);
    expect(service.getAllVehicles).toHaveBeenCalled();
  });

  it('getAllVehiclesWithDocuments should return list (with documents array)', async () => {
    const expected = [
      {
        id_vehicle: 1,
        plate: 'ABC123',
        brand: 'Toyota',
        model: 'Corolla',
        type: 'Sedan',
        created_at: new Date(),
        updated_at: new Date(),
        documents: [] as any[], // avoid never[] by typing
      },
    ];
    service.getAllVehiclesWithDocuments.mockResolvedValue(expected as any);

    const result = await controller.getAllVehiclesWithDocuments();
    expect(result).toEqual(expected);
    expect(service.getAllVehiclesWithDocuments).toHaveBeenCalled();
  });

  it('getVehicleByPlate should forward plate', async () => {
    const plate = 'ABC123';
    const expected = {
      id_vehicle: 1,
      plate,
      brand: 'Toyota',
      model: 'Corolla',
      type: 'Sedan',
      created_at: new Date(),
      updated_at: new Date(),
      documents: [] as any[],
    };

    service.getVehicleByPlate.mockResolvedValue(expected as any);

    const result = await controller.getVehicleByPlate(plate);
    expect(result).toEqual(expected);
    expect(service.getVehicleByPlate).toHaveBeenCalledWith(plate);
  });

  it('createVehicle should forward dto', async () => {
    const dto = { plate: 'ABC123', brand: 'Toyota', model: 'Corolla', type: 'Sedan' };
    const expected = { id_vehicle: 1, ...dto, created_at: new Date(), updated_at: new Date() };

    service.createVehicle.mockResolvedValue(expected as any);

    const result = await controller.createVehicle(dto as any);
    expect(result).toEqual(expected);
    expect(service.createVehicle).toHaveBeenCalledWith(dto);
  });

  it('updateVehicle should forward plate and dto', async () => {
    const plate = 'ABC123';
    const dto = { brand: 'Honda' };
    const expected = { id_vehicle: 1, plate, brand: 'Honda', created_at: new Date(), updated_at: new Date() };

    service.updateVehicle.mockResolvedValue(expected as any);

    const result = await controller.updateVehicle(plate, dto as any);
    expect(result).toEqual(expected);
    expect(service.updateVehicle).toHaveBeenCalledWith(plate, dto);
  });

  it('createDocument should forward dto', async () => {
    const dto = {
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      vehicle_id: 1,
      document_type_id: 1,
    };

    const expected = {
      id_document: 1,
      start_date: new Date(dto.start_date),
      end_date: new Date(dto.end_date),
      document_type: { id_document_type: 1, name: 'SOAT' },
      created_at: new Date(),
    };

    service.createDocument.mockResolvedValue(expected as any);

    const result = await controller.createDocument(dto as any);
    expect(result).toEqual(expected);
    expect(service.createDocument).toHaveBeenCalledWith(dto);
  });

  it('getDocumentsByVehiclePlate should forward plate', async () => {
    const plate = 'ABC123';
    const expected = [{ id_document: 1, start_date: new Date(), end_date: new Date() }];

    service.getDocumentsByVehiclePlate.mockResolvedValue(expected as any);

    const result = await controller.getDocumentsByVehiclePlate(plate);
    expect(result).toEqual(expected);
    expect(service.getDocumentsByVehiclePlate).toHaveBeenCalledWith(plate);
  });

  it('getAllDocumentTypes should return list', async () => {
    const expected = [{ id_document_type: 1, name: 'SOAT', created_at: new Date(), updated_at: new Date() }];

    service.getAllDocumentTypes.mockResolvedValue(expected as any);

    const result = await controller.getAllDocumentTypes();
    expect(result).toEqual(expected);
    expect(service.getAllDocumentTypes).toHaveBeenCalled();
  });

  it('createDocumentType should forward dto', async () => {
    const dto = { name: 'SOAT' };
    const expected = { id_document_type: 1, name: 'SOAT', created_at: new Date() };

    service.createDocumentType.mockResolvedValue(expected as any);

    const result = await controller.createDocumentType(dto as any);
    expect(result).toEqual(expected);
    expect(service.createDocumentType).toHaveBeenCalledWith(dto);
  });

  it('updateDocumentType should convert id correctly', async () => {
    const id = '1';
    const dto = { name: 'Updated' };
    const expected = { id_document_type: 1, name: 'Updated', updated_at: new Date() };

    service.updateDocumentType.mockResolvedValue(expected as any);

    const result = await controller.updateDocumentType(id, dto as any);
    expect(result).toEqual(expected);
    expect(service.updateDocumentType).toHaveBeenCalledWith(1, dto);
  });
});
