// src/modules/appointments/appointments.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

// 1. Mock del servicio
const mockAppointmentsService = {
  // Configurado para devolver promesas vacías/genéricas
  create: jest.fn(), 
  findAll: jest.fn(() => [{ id_appointment: 1, status: 'Active' }]),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: AppointmentsService;

  beforeEach(async () => {
    // Limpiar mocks antes de cada suite
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: mockAppointmentsService,
        },
      ],
    })
      // Sobreescribir Guards para simular el acceso permitido
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) 
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Pruebas para POST /appointments ---
  describe('create', () => {
    it('should call service.create and return the created appointment', async () => {
      const createDto = { 
        user_id: 1, 
        vehicle_id: 1, 
        center_id: 1, 
        date: '2025-12-01', 
        time: '10:00', 
        status: 'Active' 
      };
      const expectedResult = { id_appointment: 1, ...createDto };
      
      mockAppointmentsService.create.mockResolvedValueOnce(expectedResult);
      
      const result = await controller.create(createDto as any);
      
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedResult);
    });
  });

  // --- Pruebas para GET /appointments/:id ---
  describe('findOne', () => {
    it('should call service.findOne with the correct ID (as string)', async () => {
      const idString = '5';
      const idNumber = parseInt(idString, 10);
      
      mockAppointmentsService.findOne.mockResolvedValueOnce({ id_appointment: idNumber, status: 'Active' });
      await controller.findOne(idString);
      
      // CORRECCIÓN: La expectativa es la CADENA, ya que el Pipe no se ejecuta.
      expect(service.findOne).toHaveBeenCalledWith(idString); 
    });

    it('should return the found appointment', async () => {
      const idString = '10';
      const idNumber = parseInt(idString, 10);
      const expectedAppointment = { id_appointment: idNumber, status: 'Active' };
      
      mockAppointmentsService.findOne.mockResolvedValueOnce(expectedAppointment);
      
      const result = await controller.findOne(idString);
      
      expect(result.id_appointment).toBe(idNumber);
      expect(result).toEqual(expectedAppointment);
    });
  });

  // --- Pruebas para DELETE /appointments/:id ---
  describe('remove', () => {
    it('should call service.remove with the correct ID (as string)', async () => {
      const idString = '1';
      const idNumber = parseInt(idString, 10);
      
      mockAppointmentsService.remove.mockResolvedValueOnce({ id_appointment: idNumber, status: 'Cancelled' });
      await controller.remove(idString);
      
      // CORRECCIÓN: La expectativa es la CADENA, ya que el Pipe no se ejecuta.
      expect(service.remove).toHaveBeenCalledWith(idString); 
    });

    it('should return the cancelled appointment data', async () => {
      const idString = '2';
      const idNumber = parseInt(idString, 10);
      const expectedCancellation = { id_appointment: idNumber, status: 'Cancelled' };
      
      mockAppointmentsService.remove.mockResolvedValueOnce(expectedCancellation);
      const result = await controller.remove(idString);
      
      expect(result.status).toBe('Cancelled');
      expect(result).toEqual(expectedCancellation);
    });
  });
  
  // (Añadir pruebas para findAll y update aquí)
  
});