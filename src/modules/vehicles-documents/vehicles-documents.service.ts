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

@Injectable()
export class VehiclesDocumentsService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(DocumentEntity)
    private documentRepository: Repository<DocumentEntity>,
    @InjectRepository(DocumentTypeEntity)
    private documentTypeRepository: Repository<DocumentTypeEntity>,
  ) {}

  // ==================== VEHICLES ====================

  /**
   * Get all active vehicles without documents
   */
  async getAllVehicles() {
    return this.vehicleRepository.find({
      where: { status: true },
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });
  }

  /**
   * Get all active vehicles WITH documents
   */
  async getAllVehiclesWithDocuments() {
    return this.vehicleRepository.find({
      where: { status: true },
      relations: ['documents', 'documents.document_type'],
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });
  }

  /**
   * Get vehicle by plate with documents
   */
  async getVehicleByPlate(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      relations: ['documents', 'documents.document_type'],
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    return vehicle;
  }

  /**
   * Get vehicle by plate without documents
   */
  async getVehicleByPlateBasic(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      select: ['id_vehicle', 'plate', 'brand', 'model', 'type', 'created_at', 'updated_at'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    return vehicle;
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(createVehicleDto: CreateVehicleDto) {
    const normalizedPlate = createVehicleDto.plate.toUpperCase();

    // Check if plate already exists
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

  /**
   * Update vehicle (placa cannot be updated)
   */
  async updateVehicle(plate: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    // Update only allowed fields
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

  /**
   * Create a document for a vehicle
   */
  async createDocument(createDocumentDto: CreateDocumentDto) {
    // Verify vehicle exists
    const vehicle = await this.vehicleRepository.findOne({
      where: { id_vehicle: createDocumentDto.vehicle_id, status: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Verify document type exists and is active
    const docType = await this.documentTypeRepository.findOne({
      where: { id_document_type: createDocumentDto.document_type_id, status: true },
    });

    if (!docType) {
      throw new NotFoundException('Document type not found');
    }

    // Validate dates
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

  /**
   * Get all documents for a vehicle (by plate)
   */
  async getDocumentsByVehiclePlate(plate: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate: plate.toUpperCase(), status: true },
      relations: ['documents', 'documents.document_type'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with plate ${plate} not found`);
    }

    return vehicle.documents;
  }

  // ==================== DOCUMENT TYPES ====================

  /**
   * Get all active document types
   */
  async getAllDocumentTypes() {
    return this.documentTypeRepository.find({
      where: { status: true },
      select: ['id_document_type', 'name', 'created_at', 'updated_at'],
    });
  }

  /**
   * Create a new document type
   */
  async createDocumentType(createDocumentTypeDto: CreateDocumentTypeDto) {
    // Check if name already exists
    const existingType = await this.documentTypeRepository.findOne({
      where: { name: createDocumentTypeDto.name },
    });

    if (existingType) {
      throw new BadRequestException(`Document type "${createDocumentTypeDto.name}" already exists`);
    }

    const docType = this.documentTypeRepository.create(createDocumentTypeDto);
    await this.documentTypeRepository.save(docType);

    return {
      id_document_type: docType.id_document_type,
      name: docType.name,
      created_at: docType.created_at,
    };
  }

  /**
   * Update a document type
   */
  async updateDocumentType(id: number, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    const docType = await this.documentTypeRepository.findOne({
      where: { id_document_type: id, status: true },
    });

    if (!docType) {
      throw new NotFoundException('Document type not found');
    }

    if (updateDocumentTypeDto.name !== undefined) {
      // Check if new name already exists
      const existingType = await this.documentTypeRepository.findOne({
        where: { name: updateDocumentTypeDto.name },
      });

      if (existingType && existingType.id_document_type !== id) {
        throw new BadRequestException(`Document type "${updateDocumentTypeDto.name}" already exists`);
      }

      docType.name = updateDocumentTypeDto.name;
    }

    await this.documentTypeRepository.save(docType);

    return {
      id_document_type: docType.id_document_type,
      name: docType.name,
      updated_at: docType.updated_at,
    };
  }
}
