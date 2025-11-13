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
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './/dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
import { AuthGuard } from '../auth/auth.guard'; // Import the Auth Guard
import { RolesGuard } from '../auth/roles.guard'; // Import the Roles Guard
import { Roles } from '../auth/roles.decorator'; // Import the Decorator

@Controller('appointments')
@UseGuards(AuthGuard, RolesGuard) // Apply Guards to the entire controller
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('client') // Only clients can create appointments
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles('admin', 'center') // Admins and Centers can view all appointments
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'center', 'client') // Clients can view their own appointments (property verification logic goes in the Service/Guard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('client', 'center') // Clients can reschedule/cancel, Centers can modify the status
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @Roles('admin') // Only administrators can delete appointments
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.remove(id);
  }
}