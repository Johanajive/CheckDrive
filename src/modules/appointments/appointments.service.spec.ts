// src/appointments/appointments.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointments } from './entity/appointments.entity';
import { LogsService } from '../logs/logs.service';
import { NotFoundException } from '@nestjs/common';

// 1. Mocks de dependencias
const mockAppointmentRepository = {
  // Simular los métodos de TypeORM
  create: jest.fn(dto => dto),
  save: jest.fn(appointment => Promise.resolve({ id_appointment: 1, ...appointment })),
  find: jest.fn(() => Promise.resolve([{ id_appointment: 1, status: 'Active' }])),
  findOne: jest.fn(({ where: { id_appointment } }) => {
    if (id_appointment === 1) {
      return Promise.resolve({ id_appointment: 1, status: 'Active' });
    }
    return Promise.resolve(null);
  }),
  update: jest.fn((id, dto) => Promise.resolve({ affected: id === 1 ? 1 : 0 })),
};

const mockLogsService = {
  create: jest.fn(),
};

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let repository: Repository<Appointments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointments), // Inyección de TypeORM
          useValue: mockAppointmentRepository,
        },
        {
          provide: LogsService, // Inyección del LogsService
          useValue: mockLogsService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    repository = module.get<Repository<Appointments>>(getRepositoryToken(Appointments));
  });

  // Test de inicialización
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Pruebas para create() ---
  describe('create', () => {
    const createDto = { 
        user_id: 1, 
        vehicle_id: 1, 
        center_id: 1, 
        date: '2025-12-01', 
        time: '10:00', 
        status: 'Active' 
    };

    it('should create and return a new appointment', async () => {
      const result = await service.create(createDto as any);
      
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalled();
      expect(mockLogsService.create).toHaveBeenCalled();
      expect(result).toEqual({ id_appointment: 1, ...createDto });
    });
  });

  // --- Pruebas para findOne() ---
  describe('findOne', () => {
    it('should return an appointment when found', async () => {
      // Configuramos el mock para que devuelva un valor conocido
      mockAppointmentRepository.findOne.mockResolvedValueOnce({ id_appointment: 1, status: 'Active' });
      
      const appointment = await service.findOne(1);
      
      expect(appointment.id_appointment).toBe(1);
      expect(mockLogsService.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if appointment is not found', async () => {
      // Configuramos el mock para que devuelva null
      mockAppointmentRepository.findOne.mockResolvedValueOnce(null);
      
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
  
  // --- Pruebas para remove() ---
  describe('remove', () => {
    it('should change status to Cancelled and save', async () => {
      const mockAppointment = { 
        id_appointment: 1, 
        status: 'Active', 
        save: jest.fn(),
        // Mock de findOne
        ...mockAppointmentRepository.findOne({ where: { id_appointment: 1 } }) 
      };
      
      // Mockear findOne para devolver la entidad que vamos a "cancelar"
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockAppointment as any);
      // Mockear save para devolver la entidad ya cancelada
      mockAppointmentRepository.save.mockResolvedValueOnce({ 
        ...mockAppointment, 
        status: 'Cancelled' 
      });

      const result = await service.remove(1);

      expect(result.status).toBe('Cancelled');
      expect(mockAppointmentRepository.save).toHaveBeenCalled();
      expect(mockLogsService.create).toHaveBeenCalled();
    });
  });

  // (Añadir pruebas para findAll y update)
});