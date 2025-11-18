// src/appointments/appointments.controller.ts
// Controller for managing appointments with role-based access control
// and JWT authentication

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
  // Additional imports for guards and roles
  // Added imports for authentication and authorization
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './/dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesEnum } from 'src/common/enum/roles.enum';
// Applying guards to protect the routes


// Controlador del módulo de citas (Appointments)
// Maneja las rutas HTTP relacionadas con creación, consulta, actualización y cancelación de citas

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
// Aplica autenticación JWT y validación por roles a todas las rutas de este controlador
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  /**
   * Crear una nueva cita
   * - Solo los usuarios con rol USER pueden crear una cita
   * - Recibe un DTO para validar la estructura de los datos
   */
  @Post()
  @Roles(RolesEnum.USER)
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  /**
   * Obtener todas las citas
   * - Solo administradores o usuarios con permisos pueden listar todas las citas
   * - No requiere parámetros
   */
  @Get()
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  findAll() {
    return this.appointmentsService.findAll();
  }

  /**
   * Obtener una cita por ID
   * - Permite a un usuario o administrador visualizar una cita específica
   * - Valida que el ID recibido sea un número mediante ParseIntPipe
   */
  @Get(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  /**
   * Actualizar los datos de una cita
   * - Solo el usuario dueño de la cita o roles autorizados pueden actualizarla
   * - Recibe un DTO parcial (PartialType) con los campos que se desean modificar
   */
  @Patch(':id')
  @Roles(RolesEnum.USER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  /**
   * Cancelar una cita (soft delete)
   * - Solo los administradores pueden cancelar una cita
   * - El servicio no elimina el registro, solo cambia su estado
   */
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}




