// src/appointments/appointments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity.ts';
import { CreateAppointmentDto } from '../../../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../../../dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  /** 📝 Create Appointment */
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const newAppointment = this.appointmentsRepository.create(createAppointmentDto);
    return this.appointmentsRepository.save(newAppointment);
  }

  /** 📝 Get all Appointments */
  findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['user', 'vehicle', 'reviewCenter'], // Load related data
    });
  }

  /** 📝 Get Appointment by ID */
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { appointment_id: id },
      relations: ['user', 'vehicle', 'reviewCenter'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  /** 📝 Update Appointment */
  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    await this.appointmentsRepository.update(id, updateAppointmentDto);
    const updatedAppointment = await this.findOne(id);
    return updatedAppointment;
  }

  /** 📝 Delete Appointment (Soft deletion is more common, here we use hard delete) */
  async remove(id: number): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.appointmentsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return { deleted: true };
  }
}