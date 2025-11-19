import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesDocumentsService } from '../vehicles-documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { DocumentEntity } from '../entity/document.entity';
import { DocumentTypeEntity } from '../entity/document-type.entity';
import { LogsService } from '../../logs/logs.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('VehiclesDocumentsService', () => {
  let service: VehiclesDocumentsService;

  let vehicleRepo: any;
  let documentRepo: any;
  let documentTypeRepo: any;
  let logsService: any;

  beforeEach(async () => {
    vehicleRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    documentRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    documentTypeRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    logsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesDocumentsService,
        { provide: getRepositoryToken(VehicleEntity), useValue: vehicleRepo },
        { provide: getRepositoryToken(DocumentEntity), useValue: documentRepo },
        { provide: getRepositoryToken(DocumentTypeEntity), useValue: documentTypeRepo },
        { provide: LogsService, useValue: logsService },
      ],
    }).compile();

    service = module.get<VehiclesDocumentsService>(VehiclesDocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ======================================================
  // VEHICLES
  // ======================================================

  it('getAllVehicles should return active vehicles', async () => {
    const expected = [{ id_vehicle: 1 }];
    vehicleRepo.find.mockResolvedValue(expected);

    const result = await service.getAllVehicles();
    expect(result).toEqual(expected);
    expect(vehicleRepo.find).toHaveBeenCalled();
    expect(logsService.create).toHaveBeenCalled();
  });

  it('getVehicleByPlate should return vehicle', async () => {
    const vehicle = { id_vehicle: 1, plate: 'ABC123' };

    vehicleRepo.findOne.mockResolvedValue(vehicle);

    const result = await service.getVehicleByPlate('ABC123');
    expect(result).toEqual(vehicle);
    expect(vehicleRepo.findOne).toHaveBeenCalled();
  });

  it('getVehicleByPlate should throw NotFoundException', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);

    await expect(service.getVehicleByPlate('XXX000')).rejects.toThrow(NotFoundException);
  });

  it('createVehicle should create and return new vehicle', async () => {
    const dto = { plate: 'abc123', brand: 'Toyota', model: 'Corolla', type: 'Sedan' };

    vehicleRepo.findOne.mockResolvedValue(null);

    // CORRECCIÓN IMPORTANTE (AQUÍ ESTABA EL ERROR)
    vehicleRepo.create.mockReturnValue({
      ...dto,
      plate: 'ABC123', // ← Simula lo que hace el servicio REAL
    });

    vehicleRepo.save.mockResolvedValue({
      id_vehicle: 1,
      ...dto,
      plate: 'ABC123', 
    });

    const result = await service.createVehicle(dto);

    expect(vehicleRepo.save).toHaveBeenCalled();
    expect(result.plate).toBe('ABC123'); 
  });

  it('createVehicle should throw if plate exists', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id_vehicle: 99, plate: 'ABC123' });

    await expect(service.createVehicle({ plate: 'ABC123' } as any))
      .rejects.toThrow(BadRequestException);
  });

  // ======================================================
  // DOCUMENTS
  // ======================================================

  it('createDocument should create document', async () => {
    const dto = {
      vehicle_id: 1,
      document_type_id: 1,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    };

    vehicleRepo.findOne.mockResolvedValue({ id_vehicle: 1 });
    documentTypeRepo.findOne.mockResolvedValue({ id_document_type: 1, name: 'SOAT' });

    const createdDoc = {
      id_document: 1,
      start_date: new Date(dto.start_date),
      end_date: new Date(dto.end_date),
    };

    documentRepo.create.mockReturnValue(createdDoc);
    documentRepo.save.mockResolvedValue(createdDoc);

    const result = await service.createDocument(dto);

    expect(result.id_document).toBe(1);
    expect(documentRepo.save).toHaveBeenCalled();
  });

  it('createDocument should throw if vehicle not found', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);

    await expect(service.createDocument({
      vehicle_id: 1,
      document_type_id: 1,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    })).rejects.toThrow(NotFoundException);
  });

  it('createDocument should throw if start_date >= end_date', async () => {
    vehicleRepo.findOne.mockResolvedValue({ id_vehicle: 1 });
    documentTypeRepo.findOne.mockResolvedValue({ id_document_type: 1 });

    await expect(service.createDocument({
      vehicle_id: 1,
      document_type_id: 1,
      start_date: '2025-12-31',
      end_date: '2025-01-01',
    })).rejects.toThrow(BadRequestException);
  });

  // ======================================================
  // DOCUMENT TYPES
  // ======================================================

  it('createDocumentType should create a type', async () => {
    documentTypeRepo.findOne.mockResolvedValue(null);

    const dto = { name: 'SOAT' };
    const created = { id_document_type: 1, name: 'SOAT' };

    documentTypeRepo.create.mockReturnValue(created);
    documentTypeRepo.save.mockResolvedValue(created);

    const result = await service.createDocumentType(dto);

    expect(result.name).toBe('SOAT');
  });

  it('createDocumentType should throw if type exists', async () => {
    documentTypeRepo.findOne.mockResolvedValue({ id_document_type: 1, name: 'SOAT' });

    await expect(service.createDocumentType({ name: 'SOAT' }))
      .rejects.toThrow(BadRequestException);
  });

  it('updateDocumentType should update type', async () => {
    const dto = { name: 'Updated' };

    documentTypeRepo.findOne.mockResolvedValueOnce({ id_document_type: 1, name: 'Old' });
    documentTypeRepo.findOne.mockResolvedValueOnce(null);

    const saved = { id_document_type: 1, name: 'Updated' };
    documentTypeRepo.save.mockResolvedValue(saved);

    const result = await service.updateDocumentType(1, dto);

    expect(result.name).toBe('Updated');
  });

  it('updateDocumentType should throw if not found', async () => {
    documentTypeRepo.findOne.mockResolvedValue(null);

    await expect(service.updateDocumentType(1, { name: 'Test' }))
      .rejects.toThrow(NotFoundException);
  });
});
