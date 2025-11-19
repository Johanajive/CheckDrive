import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesDocumentsController } from './vehicles-documents.controller';
import { VehiclesDocumentsService } from './vehicles-documents.service';

describe('VehiclesDocumentsController', () => {
  let controller: VehiclesDocumentsController;
  let service: any;

  beforeEach(async () => {
    service = {
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
      providers: [{ provide: VehiclesDocumentsService, useValue: service }],
    }).compile();

    controller = module.get<VehiclesDocumentsController>(VehiclesDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllVehicles should return list from service', async () => {
    const expected = [{ id_vehicle: 1, plate: 'ABC123' }];
    service.getAllVehicles.mockResolvedValue(expected);

    await expect(controller.getAllVehicles()).resolves.toEqual(expected);
    expect(service.getAllVehicles).toHaveBeenCalled();
  });

  it('getAllVehiclesWithDocuments should return list from service', async () => {
    const expected = [{ id_vehicle: 1, plate: 'ABC123', documents: [] }];
    service.getAllVehiclesWithDocuments.mockResolvedValue(expected);

    await expect(controller.getAllVehiclesWithDocuments()).resolves.toEqual(expected);
    expect(service.getAllVehiclesWithDocuments).toHaveBeenCalled();
  });

  it('getVehicleByPlate should forward plate to service', async () => {
    const plate = 'ABC123';
    const expected = { id_vehicle: 1, plate };
    service.getVehicleByPlate.mockResolvedValue(expected);

    await expect(controller.getVehicleByPlate(plate)).resolves.toEqual(expected);
    expect(service.getVehicleByPlate).toHaveBeenCalledWith(plate);
  });

  it('createVehicle should forward dto to service', async () => {
    const dto = { plate: 'ABC123', brand: 'Toyota', model: 'Corolla', type: 'Sedan' };
    const expected = { id_vehicle: 1, ...dto };
    service.createVehicle.mockResolvedValue(expected);

    await expect(controller.createVehicle(dto)).resolves.toEqual(expected);
    expect(service.createVehicle).toHaveBeenCalledWith(dto);
  });

  it('updateVehicle should forward plate and dto to service', async () => {
    const plate = 'ABC123';
    const dto = { brand: 'Honda' };
    const expected = { id_vehicle: 1, plate, brand: 'Honda' };
    service.updateVehicle.mockResolvedValue(expected);

    await expect(controller.updateVehicle(plate, dto)).resolves.toEqual(expected);
    expect(service.updateVehicle).toHaveBeenCalledWith(plate, dto);
  });

  it('createDocument should forward dto to service', async () => {
    const dto = { start_date: '2025-01-01', end_date: '2025-12-31', vehicle_id: 1, document_type_id: 1 };
    const expected = { id_document: 1, start_date: dto.start_date };
    service.createDocument.mockResolvedValue(expected);

    await expect(controller.createDocument(dto)).resolves.toEqual(expected);
    expect(service.createDocument).toHaveBeenCalledWith(dto);
  });

  it('getDocumentsByVehiclePlate should forward plate to service', async () => {
    const plate = 'ABC123';
    const expected = [{ id_document: 1 }];
    service.getDocumentsByVehiclePlate.mockResolvedValue(expected);

    await expect(controller.getDocumentsByVehiclePlate(plate)).resolves.toEqual(expected);
    expect(service.getDocumentsByVehiclePlate).toHaveBeenCalledWith(plate);
  });

  it('getAllDocumentTypes should return types from service', async () => {
    const expected = [{ id_document_type: 1, name: 'SOAT' }];
    service.getAllDocumentTypes.mockResolvedValue(expected);

    await expect(controller.getAllDocumentTypes()).resolves.toEqual(expected);
    expect(service.getAllDocumentTypes).toHaveBeenCalled();
  });

  it('createDocumentType should forward dto to service', async () => {
    const dto = { name: 'SOAT' };
    const expected = { id_document_type: 1, name: 'SOAT' };
    service.createDocumentType.mockResolvedValue(expected);

    await expect(controller.createDocumentType(dto)).resolves.toEqual(expected);
    expect(service.createDocumentType).toHaveBeenCalledWith(dto);
  });

  it('updateDocumentType should convert id and forward to service', async () => {
    const id = '1';
    const dto = { name: 'Updated' };
    const expected = { id_document_type: 1, name: 'Updated' };
    service.updateDocumentType.mockResolvedValue(expected);

    await expect(controller.updateDocumentType(id, dto)).resolves.toEqual(expected);
    expect(service.updateDocumentType).toHaveBeenCalledWith(1, dto);
  });
});
