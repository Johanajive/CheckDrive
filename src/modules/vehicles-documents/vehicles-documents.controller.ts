import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { VehiclesDocumentsService } from './vehicles-documents.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';

// ====== Swagger tag ======
@ApiTags('Vehicles & Documents')

// ====== JWT Bearer auth token ======
@ApiBearerAuth('bearerAuth')

// ====== Global guards for controller ======
@UseGuards(JwtAuthGuard, RolesGuard)


@Controller('/api/vehicles-documents')
export class VehiclesDocumentsController {
  constructor(private readonly service: VehiclesDocumentsService) {}

  // ==================== VEHICLES ====================

  @Get('vehicles')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los vehículos activos (sin documentos)' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos' })
  getAllVehicles() {
    return this.service.getAllVehicles();
  }

  @Get('vehicles/with-documents')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener vehículos con sus documentos asociados' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos con documentos' })
  getAllVehiclesWithDocuments() {
    return this.service.getAllVehiclesWithDocuments();
  }

  @Get('vehicles/:plate')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener vehículo por placa (incluye documentos)' })
  @ApiParam({ name: 'plate', description: 'Placa del vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado' })
  getVehicleByPlate(@Param('plate') plate: string) {
    return this.service.getVehicleByPlate(plate);
  }

  @Post('vehicles')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo vehículo' })
  @ApiBody({ type: CreateVehicleDto })
  createVehicle(@Body() dto: CreateVehicleDto) {
    return this.service.createVehicle(dto);
  }

  @Patch('vehicles/:plate')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar datos de un vehículo por placa' })
  @ApiParam({ name: 'plate', description: 'Placa del vehículo' })
  @ApiBody({ type: UpdateVehicleDto })
  updateVehicle(@Param('plate') plate: string, @Body() dto: UpdateVehicleDto) {
    return this.service.updateVehicle(plate, dto);
  }

  // ==================== DOCUMENTS ====================

  @Post('documents')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear un documento para un vehículo' })
  @ApiBody({ type: CreateDocumentDto })
  createDocument(@Body() dto: CreateDocumentDto) {
    return this.service.createDocument(dto);
  }

  @Get('documents/:plate')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Obtener documentos de un vehículo por placa' })
  @ApiParam({ name: 'plate', description: 'Placa del vehículo' })
  getDocumentsByVehiclePlate(@Param('plate') plate: string) {
    return this.service.getDocumentsByVehiclePlate(plate);
  }

  // ==================== DOCUMENT TYPES ====================

  @Get('document-types')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Listar todos los tipos de documentos' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de documentos' })
  getAllDocumentTypes() {
    return this.service.getAllDocumentTypes();
  }

  @Post('document-types')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo tipo de documento' })
  @ApiBody({ type: CreateDocumentTypeDto })
  createDocumentType(@Body() dto: CreateDocumentTypeDto) {
    return this.service.createDocumentType(dto);
  }

  @Patch('document-types/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Actualizar un tipo de documento' })
  @ApiParam({ name: 'id', description: 'ID del tipo de documento' })
  @ApiBody({ type: UpdateDocumentTypeDto })
  updateDocumentType(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentTypeDto,
  ) {
    return this.service.updateDocumentType(Number(id), dto);
  }
}
