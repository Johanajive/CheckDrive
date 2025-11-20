
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { VehiclesDocumentsService } from './vehicles-documents.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

@Controller('/api/vehicles-documents')
export class VehiclesDocumentsController {
  constructor(private readonly service: VehiclesDocumentsService) {}

  // ==================== VEHICLES ====================

  /**
   * GET /vehicles-documents/vehicles
   * Get all vehicles without documents
   */
  @Get('vehicles')
  async getAllVehicles() {
    return this.service.getAllVehicles();
  }

  /**
   * GET /vehicles-documents/vehicles/with-documents
   * Get all vehicles WITH documents
   */
  @Get('vehicles/with-documents')
  async getAllVehiclesWithDocuments() {
    return this.service.getAllVehiclesWithDocuments();
  }

  /**
   * GET /vehicles-documents/vehicles/:plate
   * Get vehicle by plate WITH documents
   */
  @Get('vehicles/:plate')
  async getVehicleByPlate(@Param('plate') plate: string) {
    return this.service.getVehicleByPlate(plate);
  }

  /**
   * POST /vehicles-documents/vehicles
   * Create a new vehicle
   */
  @Post('vehicles')
  async createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.service.createVehicle(createVehicleDto);
  }

  /**
   * PATCH /vehicles-documents/vehicles/:plate
   * Update vehicle by plate (plate cannot be modified)
   */
  @Patch('vehicles/:plate')
  async updateVehicle(
    @Param('plate') plate: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.service.updateVehicle(plate, updateVehicleDto);
  }

  // ==================== DOCUMENTS ====================

  /**
   * POST /vehicles-documents/documents
   * Create a document for a vehicle
   */
  @Post('documents')
  async createDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return this.service.createDocument(createDocumentDto);
  }

  /**
   * GET /vehicles-documents/documents/:plate
   * Get all documents for a vehicle (by plate)
   */
  @Get('documents/:plate')
  async getDocumentsByVehiclePlate(@Param('plate') plate: string) {
    return this.service.getDocumentsByVehiclePlate(plate);
  }

  // ==================== DOCUMENT TYPES ====================

  /**
   * GET /vehicles-documents/document-types
   * Get all document types
   */
  @Get('document-types')
  async getAllDocumentTypes() {
    return this.service.getAllDocumentTypes();
  }

  /**
   * POST /vehicles-documents/document-types
   * Create a new document type
   */
  @Post('document-types')
  async createDocumentType(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.service.createDocumentType(createDocumentTypeDto);
  }

  /**
   * PATCH /vehicles-documents/document-types/:id
   * Update a document type
   */
  @Patch('document-types/:id')
  async updateDocumentType(
    @Param('id') id: string,
    @Body() updateDocumentTypeDto: UpdateDocumentTypeDto,
  ) {
    return this.service.updateDocumentType(Number(id), updateDocumentTypeDto);
  }
}

