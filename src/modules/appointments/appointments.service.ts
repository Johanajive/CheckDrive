// src/appointments/appointments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from './entity/appointments.entity'; 
import { CreateAppointmentDto } from './dto/create-appointments.dto'; 
import { UpdateAppointmentDto } from './dto/update-appointments.dto'; 


@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,
  ) {}

  
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointments> {
  const newAppointment = this.appointmentsRepository.create(createAppointmentDto);
    return await this.appointmentsRepository.save(newAppointment);
  }

  
  findAll(): Promise<Appointments[]> {
    return this.appointmentsRepository.find({
      relations: ['user', 'vehicle', 'reviewCenter'], // Load related data
    });
  }

 
  async findOne(id: number): Promise<Appointments> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id_appointment: id },
      relations: ['user', 'vehicle', 'reviewCenter'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }


  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointments> {
    await this.appointmentsRepository.update(id, updateAppointmentDto);
    const updatedAppointments = await this.findOne(id);
    return updatedAppointments;
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