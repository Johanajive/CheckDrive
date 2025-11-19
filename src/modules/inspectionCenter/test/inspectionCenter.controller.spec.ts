import { Test, TestingModule } from "@nestjs/testing";
import { InspectionCenterController } from "../inspectionCenter.controller";
import { InspectionCenterService } from "../inspectionCenter.service";
import { CreateInspectionCenterDto } from "../dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "../dto/update-inspectionCenter.dto";
import { CreateScheduleDTO } from "../dto/create-schedule.dto";
import { UpdateScheduleDTO } from "../dto/update-schedule.dto";

describe('InspectionCenterController', () => {
  let controller: InspectionCenterController;
  let service: InspectionCenterService;
  
  const mockService = {
    findAllActiveCenters: jest.fn(),
    findAllCenters: jest.fn(),
    findOneCenterById: jest.fn(),
    findOneCenterByName: jest.fn(),
    findCentersByCity: jest.fn(),
    createInspectionCenter: jest.fn(),
    updateInspectionCenter: jest.fn(),
    inactiveInspectionCenter: jest.fn(),
    findActiveSchedulesByCenterName: jest.fn(),
    findAllSchedulesByCenterName: jest.fn(),
    findActiveSchedulesByDay: jest.fn(),
    findAllSchedulesByDay: jest.fn(),
    createScheduleCenter: jest.fn(),
    updateScheduleCenter: jest.fn(),
    inactivatedScheduleCenter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionCenterController],
      providers: [
        {
          provide: InspectionCenterService,
          useValue: mockService,
        }
      ],
    }).compile();

    controller = module.get<InspectionCenterController>(InspectionCenterController);
    service = module.get<InspectionCenterService>(InspectionCenterService);
  });

  afterEach(() => jest.clearAllMocks());

  // ===============================================================
  //  PRUEBAS CONTROLADORES / ENDPOINTS MÓDULO CENTRO DE REVISIÓN
  // ===============================================================

  //Prueba unitaria del endpoint findAllActiveCenters
  it('Debe llamar a findAllActiveCenters', async () => {
    const result = [{ id: 1 }];
    mockService.findAllActiveCenters.mockResolvedValue(result);

    expect(await controller.findAllActiveCenters()).toEqual(result);
    expect(service.findAllActiveCenters).toHaveBeenCalled();
  });

  //Prueba unitaria del endpoint findAllCenters
  it('Debe llamar a findAllCenters', async () => {
    const result = [{ id: 1 }];
    mockService.findAllCenters.mockResolvedValue(result);

    expect(await controller.findAllCenters()).toEqual(result);
    expect(service.findAllCenters).toHaveBeenCalled();
  });

  //Prueba unitaria del endpoint findOneCenterById
  it('Debe llamar a findOneCenterById con el ID correcto', async () => {
    const result = { id: 5 };
    mockService.findOneCenterById.mockResolvedValue(result);

    expect(await controller.findOneCenterById(5)).toEqual(result);
    expect(service.findOneCenterById).toHaveBeenCalledWith(5);
  });

  //Prueba unitaria del endpoint findOneCenterByName
  it('Debe llamar a findOneCenterByName', async () => {
    const result = { id: 1, name: "CentroAutos" };
    mockService.findOneCenterByName.mockResolvedValue(result);

    expect(await controller.findOneCenterByName("CentroAutos")).toEqual(result);
    expect(service.findOneCenterByName).toHaveBeenCalledWith("CentroAutos");
  });

  //Prueba unitaria del endpoint findCentersByCity
  it('Debe llamar a findCentersByCity', async () => {
    const result = [{ id: 1 }];
    mockService.findCentersByCity.mockResolvedValue(result);

    expect(await controller.findCentersByCity("Bogota")).toEqual(result);
    expect(service.findCentersByCity).toHaveBeenCalledWith("Bogota");
  });

  //Prueba unitaria del endpoint createInspectionCenter
  it('Debe crear un centro de revisión', async () => {
    const dto: CreateInspectionCenterDto = { name: "Nuevo", city: "Bogotá" } as any;
    const result = { id: 1 };

    mockService.createInspectionCenter.mockResolvedValue(result);

    expect(await controller.createInspectionCenter(dto)).toEqual(result);
    expect(service.createInspectionCenter).toHaveBeenCalledWith(dto);
  });

  //Prueba unitaria del endpoint updateInspectionCenter
  it('Debe actualizar un centro de revisión', async () => {
    const dto: UpdateInspectionCenterDto = { name: "Actualizado" } as any;
    const result = { id: 1 };

    mockService.updateInspectionCenter.mockResolvedValue(result);

    expect(await controller.updateInspectionCenter(1, dto)).toEqual(result);
    expect(service.updateInspectionCenter).toHaveBeenCalledWith(1, dto);
  });

  //Prueba unitaria del endpoint inactiveInspectionCenter
  it('Debe inactivar un centro de revisión', async () => {
    mockService.inactiveInspectionCenter.mockResolvedValue({ success: true });

    expect(await controller.inactiveInspectionCenter(2)).toEqual({ success: true });
    expect(service.inactiveInspectionCenter).toHaveBeenCalledWith(2);
  });

  // ===============================================================
  //  PRUEBAS CONTROLADORES / ENDPOINTS MÓDULO HORARIOS
  // ===============================================================

  //Prueba unitaria del endpoint findActiveSchedulesByCenterName
  it('Debe obtener horarios activos por nombre', async () => {
    mockService.findActiveSchedulesByCenterName.mockResolvedValue([]);

    expect(await controller.findActiveSchedulesByCenterName("CENTROREV")).toEqual([]);
    expect(service.findActiveSchedulesByCenterName).toHaveBeenCalledWith("CENTROREV");
  });

  //Prueba unitaria del endpoint findAllSchedulesByCenterName
  it('Debe obtener todos los horarios por nombre', async () => {
    mockService.findAllSchedulesByCenterName.mockResolvedValue([]);

    expect(await controller.findAllSchedulesByCenterName("CENTROREV")).toEqual([]);
    expect(service.findAllSchedulesByCenterName).toHaveBeenCalledWith("CENTROREV");
  });

  //Prueba unitaria del endpoint findActiveSchedulesByDay
  it('Debe obtener horarios activos por día', async () => {
    mockService.findActiveSchedulesByDay.mockResolvedValue([]);

    expect(await controller.findActiveSchedulesByDay("CentroAutos", "Martes")).toEqual([]);
    expect(service.findActiveSchedulesByDay).toHaveBeenCalledWith("CentroAutos", "Martes");
  });

  //Prueba unitaria del endpoint findAllSchedulesByDay
  it('Debe obtener todos los horarios por día', async () => {
    mockService.findAllSchedulesByDay.mockResolvedValue([]);

    expect(await controller.findAllSchedulesByDay("CentroAutos", "Martes")).toEqual([]);
    expect(service.findAllSchedulesByDay).toHaveBeenCalledWith("CentroAutos", "Martes");
  });

  //Prueba unitaria del endpointcreateScheduleCenter
  it('Debe crear un nuevo horario', async () => {
    const dto: CreateScheduleDTO = { day: "lunes" } as any;
    const result = { message: "Horario creado" };

    mockService.createScheduleCenter.mockResolvedValue(result);

    expect(await controller.createScheduleCenter(1, dto)).toEqual(result);
    expect(service.createScheduleCenter).toHaveBeenCalledWith(1, dto);
  });

  //Prueba unitaria del endpointupdateScheduleCenter
  it('Debe actualizar un horario', async () => {
    const dto: UpdateScheduleDTO = { start_time: "08:00" } as any;

    mockService.updateScheduleCenter.mockResolvedValue({ success: true });

    expect(await controller.updateScheduleCenter(3, dto)).toEqual({ success: true });
    expect(service.updateScheduleCenter).toHaveBeenCalledWith(3, dto);
  });

  //Prueba unitaria del endpoint inactivatedScheduleCenter
  it('Debe inactivar un horario', async () => {
    mockService.inactivatedScheduleCenter.mockResolvedValue({ ok: true });

    expect(await controller.inactivatedScheduleCenter(4)).toEqual({ ok: true });
    expect(service.inactivatedScheduleCenter).toHaveBeenCalledWith(4);
  });
});

