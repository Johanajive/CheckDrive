// src/appointments/appointments.service.ts
// Service for managing appointments with CRUD operations
// and integration with TypeORM
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from './entity/appointments.entity';
import { CreateAppointmentDto } from './dto/create-appointments.dto';
import { UpdateAppointmentDto } from './dto/update-appointments.dto';
import { LogsService } from '../logs/logs.service'; // Import LogsService

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>, // Inyección del repositorio de citas
    private readonly logsService: LogsService, // Inyección del LogsService
  ) {}

  /** * Crear una nueva cita
   * Registra un log después de crear la cita
   */
  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointments> {
    const newAppointment = this.appointmentsRepository.create(createAppointmentDto);
    const savedAppointment = await this.appointmentsRepository.save(newAppointment);

    // LOG: creación de cita
    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'AppointmentsService',
      content: `Cita creada con ID: ${savedAppointment.id_appointment}`,
    });

    return savedAppointment;
  }

  /**
   * Obtener todas las citas
   * Registra acción de consulta general
   */
  async findAll(): Promise<Appointments[]> {
    // Registro de log
    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'AppointmentsService',
      content: 'Consulta general de citas.',
    });

    // Se asume que las relaciones son correctas según tu entidad.
    return this.appointmentsRepository.find({
      relations: ['user', 'vehicle', 'reviewCenter'],
    });
  }

  /**
   * Obtener una cita por ID
   * Registra log por consulta individual
   */
  async findOne(id: number): Promise<Appointments> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id_appointment: id },
      relations: ['user', 'vehicle', 'reviewCenter'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // LOG: consulta individual
    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'AppointmentsService',
      content: `Consulta de la cita con ID: ${id}`,
    });

    return appointment;
  }

  /**
   * Actualizar una cita existente
   * Registra un log después de actualizar
   */
  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointments> {
    // Es mejor usar update o save si el registro ya existe.
    // Usar 'update' y luego 'findOne' es una práctica común para obtener la entidad actualizada.
    const result = await this.appointmentsRepository.update(id, updateAppointmentDto);

    if (result.affected === 0) {
      // Manejar el caso si el ID no existe antes de llamar a findOne.
      // Se lanza una excepción si no se encontró nada para actualizar.
      throw new NotFoundException(`Appointment with ID ${id} not found for update`);
    }

    // Requerimos findOne para obtener la entidad completa y lanzar NotFoundException si falla.
    const updatedAppointments = await this.findOne(id); 

    // LOG: actualización
    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'AppointmentsService',
      content: `Cita actualizada con ID: ${id}`,
    });

    return updatedAppointments;
  }

  /** * Eliminar una cita (Soft Delete: marcar como cancelada)
   * Registra log de cancelación
   */
  // MEJORA DE CONSISTENCIA: Hacer que la función devuelva la cita cancelada 
  // en lugar de un objeto genérico, o cambiar el retorno a `void` si no se necesita el objeto.
  async remove(id: number): Promise<Appointments> {
    const appointment = await this.findOne(id); // findOne ya maneja el NotFoundException

    // Soft delete: cambiar el estado a 'Cancelled'
    appointment.status = 'Cancelled';
    const cancelledAppointment = await this.appointmentsRepository.save(appointment);

    await this.logsService.create({
      date: new Date(),
      host: 'localhost',
      service: 'AppointmentsService',
      content: `Cita cancelada con ID: ${id}`,
    });

    // Devuelve la entidad de la cita cancelada.
    return cancelledAppointment;
  }
}