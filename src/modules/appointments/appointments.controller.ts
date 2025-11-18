// src/appointments/appointments.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  HttpStatus, // <-- Importar HttpStatus para las respuestas
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';
import { Appointments } from './entity/appointments.entity'; // <-- Importar la entidad/esquema de respuesta
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth, // <-- Importar para documentar JWT
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

// Controlador del módulo de citas (Appointments)
@ApiTags('Appointments (Citas)') // Etiqueta principal para Swagger
@ApiBearerAuth() // Indica que todas las rutas requieren autenticación con token
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // --- POST /appointments ---
  @Post()
  @Roles(RolesEnum.USER)
  @ApiOperation({
    summary: 'Crear una nueva cita.',
    description: 'Solo usuarios con el rol **USER** pueden programar una cita.',
  })
  @ApiBody({
    type: CreateAppointmentDto,
    description: 'Datos necesarios para crear la cita.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Cita creada exitosamente.',
    type: Appointments,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado. Se requiere el rol USER.',
  })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  // --- GET /appointments ---
  @Get()
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({
    summary: 'Obtener todas las citas.',
    description:
      'Usuarios con rol **ADMIN** ven todas las citas. Usuarios con rol **USER** podrían ver solo las propias (depende de la lógica del servicio).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de citas obtenida.',
    type: [Appointments], // Array del esquema
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token de autenticación inválido o ausente.',
  })
  findAll() {
    return this.appointmentsService.findAll();
  }

  // --- GET /appointments/:id ---
  @Get(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  @ApiOperation({
    summary: 'Obtener una cita por ID.',
    description: 'Permite la visualización a usuarios y administradores.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita a buscar.',
    type: Number,
    example: 789,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cita encontrada.',
    type: Appointments,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cita no encontrada o ID inválido.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  // --- PATCH /appointments/:id ---
  @Patch(':id')
  @Roles(RolesEnum.USER)
  @ApiOperation({
    summary: 'Actualizar una cita.',
    description: 'Solo usuarios con rol **USER** (propietario) pueden actualizar los datos de la cita.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita a actualizar.',
    type: Number,
    example: 789,
  })
  @ApiBody({
    type: UpdateAppointmentDto,
    description: 'Campos parciales de la cita a modificar (e.g., solo la hora).',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cita actualizada exitosamente.',
    type: Appointments,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado. Se requiere el rol USER o no es el propietario de la cita.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  // --- DELETE /appointments/:id (Cancelación) ---
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({
    summary: 'Cancelar (Eliminar Lógico) una cita.',
    description:
      'Solo usuarios con rol **ADMIN** pueden cancelar la cita (cambio de estado).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cita a cancelar.',
    type: Number,
    example: 789,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Cita cancelada exitosamente.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado. Se requiere el rol ADMIN.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Cita no encontrada.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    // Si la lógica es "soft delete", el servicio debe manejar el cambio de estado a "Cancelled"
    return this.appointmentsService.remove(id);
  }
}