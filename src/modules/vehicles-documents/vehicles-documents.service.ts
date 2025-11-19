
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './entity/vehicle.entity';
import { DocumentEntity } from './entity/document.entity';
import { DocumentTypeEntity } from './entity/document-type.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class VehiclesDocumentsService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
    private readonly logsService: LogsService,
  ) {}

  // ==================== VEHICLES ====================

  async getAllVehicles() {
    const result = await this.vehicleRepository.find({
      where: { status: true },
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: 'Consulta general de vehículos activos.',
    });

    return result;
  }

  async getAllVehiclesWithDocuments() {
    const result = await this.vehicleRepository.find({
      where: { status: true },
      relations: ['documents', 'documents.document_type'],
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: 'Consulta de vehículos con documentos.',
    });

    return result;
  }

  async getVehicleByPlate(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      relations: ['documents', 'documents.document_type'],
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Consulta de vehículo por placa: ${plate}`,
    });

    return vehicle;
  }

  async getVehicleByPlateBasic(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Consulta básica de vehículo por placa: ${plate}`,
    });

    return vehicle;
  }

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    const normalizedPlate = createVehicleDto.plate.toUpperCase();

    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: normalizedPlate },
    });

    if (existingVehicle) {
      throw new BadRequestException(`Vehicle with plate ${normalizedPlate} already exists`);
    }

    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      plate: normalizedPlate,
    });

    await this.vehicleRepository.save(vehicle);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Vehículo creado con placa: ${normalizedPlate}`,
    });

    return {
      id_vehicle: vehicle.id_vehicle,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at,
    };
  }

  async updateVehicle(plate: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    if (updateVehicleDto.brand !== undefined) {
      vehicle.brand = updateVehicleDto.brand;
    }
    if (updateVehicleDto.model !== undefined) {
      vehicle.model = updateVehicleDto.model;
    }
    if (updateVehicleDto.type !== undefined) {
      vehicle.type = updateVehicleDto.type;
    }

    await this.vehicleRepository.save(vehicle);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Vehículo actualizado con placa: ${plate}`,
    });

    return {
      id_vehicle: vehicle.id_vehicle,
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      type: vehicle.type,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at,
    };
  }

  // ==================== DOCUMENTS ====================

  async createDocument(createDocumentDto: CreateDocumentDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id_vehicle: createDocumentDto.vehicle_id, status: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const docType = await this.documentTypeRepository.findOne({
      where: { id_document_type: createDocumentDto.document_type_id, status: true },
    });

    if (!docType) {
      throw new NotFoundException('Document type not found');
    }

    const startDate = new Date(createDocumentDto.start_date);
    const endDate = new Date(createDocumentDto.end_date);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const document = this.documentRepository.create({
      start_date: startDate,
      end_date: endDate,
      vehicle,
      document_type: docType,
    });

    await this.documentRepository.save(document);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Documento creado para vehículo ID: ${createDocumentDto.vehicle_id}`,
    });

    return {
      id_document: document.id_document,
      start_date: document.start_date,
      end_date: document.end_date,
      document_type: {
        id_document_type: docType.id_document_type,
        name: docType.name,
      },
      created_at: document.created_at,
    };
  }

  async getDocumentsByVehiclePlate(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      relations: ['documents', 'documents.document_type'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Consulta de documentos del vehículo con placa: ${plate}`,
    });

    return vehicle.documents;
  }

  // ==================== DOCUMENT TYPES ====================

  async getAllDocumentTypes() {
    const result = await this.documentTypeRepository.find({
      where: { status: true },
      select: ['id_document_type', 'name', 'created_at', 'updated_at'],
    });

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: 'Consulta de todos los tipos de documentos.',
    });

    return result;
  }

  async createDocumentType(createDocumentTypeDto: CreateDocumentTypeDto) {
    const existingType = await this.documentTypeRepository.findOne({
      where: { name: createDocumentTypeDto.name },
    });

    if (existingType) {
      throw new BadRequestException(`Document type "${createDocumentTypeDto.name}" already exists`);
    }

    const docType = this.documentTypeRepository.create(createDocumentTypeDto);
    await this.documentTypeRepository.save(docType);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Tipo de documento creado: ${createDocumentTypeDto.name}`,
    });

    return {
      id_document_type: docType.id_document_type,
      name: docType.name,
      created_at: docType.created_at,
    };
  }

  async updateDocumentType(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    const docType = await this.documentTypeRepository.findOne({
      where: { id_document_type: id, status: true },
    });

    if (!docType) {
      throw new NotFoundException('Document type not found');
    }

    if (updateDocumentTypeDto.name !== undefined) {
      const existingType = await this.documentTypeRepository.findOne({
        where: { name: updateDocumentTypeDto.name },
      });

      if (existingType && existingType.id_document_type !== id) {
        throw new BadRequestException(`Document type "${updateDocumentTypeDto.name}" already exists`);
      }

      docType.name = updateDocumentTypeDto.name;
    }

    await this.documentTypeRepository.save(docType);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'VehiclesDocumentsService',
      content: `Tipo de documento actualizado ID: ${id}`,
    });

    return {
      id_document_type: docType.id_document_type,
      name: docType.name,
      updated_at: docType.updated_at,
    };
  }
};