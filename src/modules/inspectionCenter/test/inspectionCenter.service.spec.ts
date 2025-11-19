import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { LogsService } from "../../logs/logs.service";
import { InspectionCenterService } from "../inspectionCenter.service"

const inspectionCentersFake=[
    {
        id:1, 
        name:"Centro Carros", 
        city:"Bogotá", 
        address:"Calle 48 #89-89", 
        phone:"555-12345", 
        status:true,
        schedule:[
            {id:1,  day:"Lunes", opening_time:"08:00" ,closing_time:"19:00" , status: false}, 
            {id:2,  day:"Miércoles", opening_time:"08:00" ,closing_time:"19:00" , status: true}, 
            {id:3,  day:"Domingo", opening_time:"10:00" ,closing_time:"15:00" , status: true}
        ]
    }, 
    {
        id:2, 
        name:"SOAT SAS", 
        city:"Bogotá", 
        address:"Calle 78 #10-85", 
        phone:"555-12895", 
        status:true, 
        schedule:[
            {id:1,  day:"Martes", opening_time:"08:00" ,closing_time:"19:00" , status: true}, 
            {id:2,  day:"Jueves", opening_time:"08:00" ,closing_time:"19:00" , status: false}, 
            {id:3,  day:"Sábado", opening_time:"10:00" ,closing_time:"15:00" , status: true}
        ]
    }, 
    {
        id:3, 
        name:"Centro Arregla Todo", 
        city:"Medellín", 
        address:"Cra 10 #67-95", 
        phone:"555-18542", 
        status:false, 
        schedule:[
            {id:1,  day:"Lunes", opening_time:"07:00" ,closing_time:"18:00" , status: false}, 
            {id:2,  day:"Miércoles", opening_time:"07:00" ,closing_time:"18:00" , status: false}, 
            {id:3,  day:"Domingo", opening_time:"09:00" ,closing_time:"13:00" , status: false}
        ]
    },
    {
        id:4, 
        name:"Centro La 23", 
        city:"Bogotá", 
        address:"Cra 59 #78-89", 
        phone:"555-18542", 
        status:true, 
        schedule:[]
    }
]; 
const logFake= {
    id_log:4, 
    date: new Date(), 
    host:"localhost", 
    service:"InspectionCenterService", 
    content:"Se creó un nuevo centro de revisión: Centro Autos Bogotá"
}

describe ('InspectionCenterService', ()=>{
    let service:InspectionCenterService; 
    let fakeRepository; 
    let fakeSchedulesRepository;
    let logsService:LogsService;
    let fakeLogsRepository;

    beforeEach(async()=>{
        jest.clearAllMocks(); 
        fakeRepository={
            find:jest.fn().mockResolvedValue(inspectionCentersFake), 
            findOne:jest.fn().mockResolvedValue(inspectionCentersFake), 
            create:jest.fn().mockResolvedValue(inspectionCentersFake), 
            save:jest.fn().mockResolvedValue(inspectionCentersFake), 
            update:jest.fn().mockResolvedValue(inspectionCentersFake), 
        }; 
        fakeLogsRepository={
            find:jest.fn().mockResolvedValue(logFake),
            create:jest.fn().mockResolvedValue(logFake), 
            save:jest.fn().mockResolvedValue(logFake),
        };
        fakeSchedulesRepository={
            find:jest.fn().mockResolvedValue(inspectionCentersFake), 
            findOne:jest.fn().mockResolvedValue(inspectionCentersFake), 
            create:jest.fn().mockResolvedValue(inspectionCentersFake), 
            save:jest.fn().mockResolvedValue(inspectionCentersFake), 
            update:jest.fn().mockResolvedValue(inspectionCentersFake), 
        }; 
    
        logsService = {
            create: jest.fn().mockResolvedValue({ id_log: 4 }),
            find: jest.fn(),
            findOne: jest.fn(),
            logRepository: {} 
        } as unknown as LogsService;

        service=new InspectionCenterService (fakeRepository, fakeSchedulesRepository, logsService)  
    }); 

    // ===============================================================
    //  PRUEBAS MÓDULO CENTRO DE REVISIÓN
    // ===============================================================

    //Prueba unitaria del servicio findAllActiveCenters
    it("Deberia retornar todos los centros de revisión activos", async()=>{
        const inspectionCenters= await service.findAllActiveCenters();

        expect (inspectionCenters.length).toBeGreaterThan(0); 
        expect(fakeRepository.find).toHaveBeenCalled();
    });

    //Prueba unitaria del servicio findAllCenters
    it("Deberia retornar todos los centros de revisión activos e inactivos", async()=>{
        const inspectionCenters= await service.findAllCenters();

        expect (inspectionCenters.length).toBeGreaterThan(0); 
        expect(fakeRepository.find).toHaveBeenCalled();
    });

    //Prueba unitaria del servicio findOneCenterById
    it("Deberia retornar un centro de revisión por su id", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[0]);
        const inspectionCenterFind=await service.findOneCenterById(1); 

        expect(inspectionCenterFind.name).toEqual("Centro Carros");
    });
    // Prueba unitaria de la excepción NotFoundExcepción cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no se encuentra registrado", async()=>{
        fakeRepository.findOne.mockResolvedValue(null);
        await expect(service.findOneCenterById(99)).rejects.toThrow(NotFoundException)
    });
    // Prueba unitaria de la excepción BadRequestExcepción cuando el centro de revisión no se encuentra activo
    it("Deberia retornar un BadRequestExcepcion cuando el centro de revisión no se encuentra activo", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[2]); 
        await expect(service.findOneCenterById(3)).rejects.toThrow(BadRequestException)
    })

    //Prueba unitaria del servicio findOneCenterByName
    it("Deberia retornar un centro de revisión por su nombre", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[1]);
        const inspectionCenterFind=await service.findOneCenterByName("SOAT SAS"); 

        expect(inspectionCenterFind.address).toEqual("Calle 78 #10-85");
    });

    //Prueba unitaria del servicio findCentersByCity
    it("Deberia retornar todos los centros de revisión en una ciudad específica", async()=>{
        fakeRepository.find.mockResolvedValue([
            {id:1, name:"Centro Carros", city:"Bogotá", address:"Calle 48 #89-89", phone:"555-12345", status:true},
            {id:2, name:"SOAT SAS", city:"Bogotá", address:"Calle 78 #10-85", phone:"555-12895", status:true }
        ]);

        const result=await service.findCentersByCity("Bogotá"); 

        expect(result).toEqual([
            {id:1, name:"Centro Carros", city:"Bogotá", address:"Calle 48 #89-89", phone:"555-12345", status:true }, 
            {id:2, name:"SOAT SAS", city:"Bogotá", address:"Calle 78 #10-85", phone:"555-12895", status:true }
        ]);
    })
    // Prueba unitaria de la excepción NotFoundExcepción cuando no se encuentran centros de revisión activos en la ciudad
    it("Deberia retornar un BadRequestExcepcion cuando no se encuentran centros de revisión activos en la ciudad", async()=>{
        fakeRepository.find.mockResolvedValue([
            {id:1, name:"Centro A", status:false, city:"Bogotá"}, 
            {id:2, name:"Centro B", status:false, city:"Bogotá"}
        ]);
        await expect(service.findCentersByCity("Bogotá")).rejects.toThrow(NotFoundException)
    })

    //Prueba unitaria del servicio createInspectionCenter
    it("Deberia permitir la creación de un nuevo centro de revisión", async()=>{
        const newInspectionCenter={id:4, name:"Centro Revisiones", city:"Bogotá", address:"Calle 8 #85-96", phone:"555-789456", status:true}

        fakeRepository.findOne.mockResolvedValue(null);

        fakeRepository.create.mockReturnValue(newInspectionCenter);
        fakeRepository.save.mockResolvedValue(newInspectionCenter); 
        const result=await service.createInspectionCenter(newInspectionCenter as any); 

        expect(result.message).toEqual("El centro de revisión ha sido creado correctamente");

        const newLog={id:1, date:2025/11/16, host:"localhost", service:"InspectionCenterService", content:"Se creó un nuevo centro de revisión: Centro Arreglo Autos"}
        fakeLogsRepository.save.mockResolvedValue(newLog); 
        const resultLog=await logsService.create(newLog as any); 

        expect(resultLog.id_log).toEqual(4);
    })
    //Prueba unitaria de la excepción BadRequestException cuando el centro de revisión ya se encuentra registrado
    it("Deberia retornar un BadRequestExcepcion cuando el centro de revisión ya se encuentra registrado", async()=>{
        const newInspectionCenter={name:"Centro Arregla Todo", city:"Bogotá", address:"Calle 8 #85-96", phone:"555-789456", status:true}

        fakeRepository.findOne.mockResolvedValue(newInspectionCenter);
        await expect(service.createInspectionCenter(newInspectionCenter as any)).rejects.toThrow(BadRequestException);
    })


    //Prueba unitaria del servicio updateInspectionCenter
    it("Deberia permitir la actualización de un centro de revisión", async()=>{
        const updatedInspectionCenter={city:"Cali"}
        fakeRepository.update.mockResolvedValue({affeted:1});
        fakeRepository.findOne.mockResolvedValue(updatedInspectionCenter); 

        const result=await service.updateInspectionCenter(1, {city:"Cali"});
        
        expect(fakeRepository.update).toHaveBeenCalledWith(1, {city:"Cali"});
        expect(result.message).toEqual("El centro de revisión se actualizo correctamente")
        
        const newLog={id:2, date:2025/11/17, host:"localhost", service:"InspectionCenterService", content:"Centro de revisión actualizado: Centro Arreglo Autos"}
        fakeLogsRepository.save.mockResolvedValue(newLog); 
        const resultLog=await logsService.create(newLog as any); 

        expect(resultLog.id_log).toEqual(4);
    
    })
    //Prueba unitaria de la excepción ConflictException cuando no se pudo actualizar la información del centro de revisión
    it("Deberia retornar un ConflictException cuando no se pudo actualizar la información del centro de revisión", async()=>{
        const updatedInspectionCenter={city:"Cali"}
        fakeRepository.findOne.mockResolvedValue(updatedInspectionCenter); 

        fakeRepository.update.mockResolvedValue({affected:0});
        await expect(service.updateInspectionCenter(2, {city:"Cali"})).rejects.toThrow(ConflictException)
    })

    //Prueba unitaria del servicio inactiveInspectionCenter
    it("Deberia permitir la inactivación de un centro de revisión", async()=>{
        const updatedStatusCenter={id:1, status:false}; 

        fakeRepository.update.mockResolvedValue({affected:1}); 
        fakeRepository.findOne.mockResolvedValue(updatedStatusCenter);

        const result= await service.inactiveInspectionCenter(1);
        expect(fakeRepository.update).toHaveBeenCalledWith(1, {status:false});
        expect(result.message).toEqual("El centro de revisión ha sido inactivado correctamente");

        const newLog={id:1, date:2025/11/17, host:"localhost", service:"InspectionCenterService", content:"Centro de revisión inactivado: Centro Carros"}
        fakeLogsRepository.save.mockResolvedValue(newLog); 
        const resultLog=await logsService.create(newLog as any); 

        expect(resultLog.id_log).toEqual(4);

    })
    //Prueba unitaria de la excepción NotFoundException del servicio inactiveInspectionCenter cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un NotFoundException cuando el centro de revisión no se encuentra registrado", async()=>{
        fakeRepository.findOne.mockResolvedValue(0);
        await expect(service.inactiveInspectionCenter(99)).rejects.toThrow(NotFoundException);
    })
    //Prueba unitaria de la excepción ConflictException cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un ConflictException cuando el centro de revisión no se encuentra registrado", async()=>{
        fakeRepository.update.mockResolvedValue({affected:0});
        await expect(service.inactiveInspectionCenter(99)).rejects.toThrow(ConflictException);
    })

    // ===============================================================
    //  PRUEBAS MÓDULO HORARIOS
    // ===============================================================

    //Prueba unitaria del servicio findActiveSchedulesByCenterName
    it("Deberia retornar los horarios activos de un centro de revisión por su nombre", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[0]); 
        const result=await service.findActiveSchedulesByCenterName("Centro Carros");

        expect(result.message).toEqual(`El centro de revisión Centro Carros tiene los siguientes horarios registrados`)
        expect(result.schedules).toEqual([
            {id:2,  day:"Miércoles", opening_time:"08:00" ,closing_time:"19:00" , status: true}, 
            {id:3,  day:"Domingo", opening_time:"10:00" ,closing_time:"15:00" , status: true}
        ])
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios activos registrados
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios activos registrados", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[2].status=true);
        await expect (service.findActiveSchedulesByCenterName("Centro Arregla Todo")).rejects.toThrow(NotFoundException);
    });

    //Prueba unitaria del servicio findAllSchedulesByCenterName
    it("Deberia retornar los horarios (activos e inactivos) de un centro de revisión por su nombre", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[0]); 
        const result=await service.findAllSchedulesByCenterName("Centro Carros");

        expect(result.message).toEqual(`El centro de revisión Centro Carros tiene los siguientes horarios registrados`)
        expect(result.schedules).toEqual([
            {id:1,  day:"Lunes", opening_time:"08:00" ,closing_time:"19:00" , status: false}, 
            {id:2,  day:"Miércoles", opening_time:"08:00" ,closing_time:"19:00" , status: true}, 
            {id:3,  day:"Domingo", opening_time:"10:00" ,closing_time:"15:00" , status: true}
        ])
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios registrados
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios registrados", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[3]);
        await expect(service.findAllSchedulesByCenterName("Centro La 23")).rejects.toThrow(NotFoundException)
    });

    //Prueba unitaria del servicio findActiveSchedulesByDay
    it("Deberia retornar los horarios activos de un centro de revisión por su nombre y día específico", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[0]);
        const result =await service.findActiveSchedulesByDay("Centro Carros", "Domingo")

        expect(result.message).toEqual("El centro de revisión Centro Carros tiene los siguientes horarios registrados");
        expect(result.schedules).toEqual([
            {id:3,  day:"Domingo", opening_time:"10:00" ,closing_time:"15:00" , status: true}
        ])
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios activos registrados para el día seleccionado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios activos registrados para el día seleccionado", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[2].status=true);
        await expect(service.findActiveSchedulesByDay("Centro Arregla Todo", "Miércoles")).rejects.toThrow(NotFoundException)
    });

    //Prueba unitaria del servicio findAllSchedulesByDay
    it("Deberia retornar los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[0]);
        const result =await service.findAllSchedulesByDay("Centro Carros", "Lunes")

        expect(result.message).toEqual("El centro de revisión Centro Carros tiene los siguientes horarios registrados para el día lunes");
        expect(result.schedules).toEqual([
            {id:1,  day:"Lunes", opening_time:"08:00" ,closing_time:"19:00" , status: false},
        ])
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios registrados para el día seleccionado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios registrados para el día seleccionado", async()=>{
        fakeRepository.findOne.mockResolvedValue(inspectionCentersFake[3]);
        await expect(service.findAllSchedulesByDay("Centro La 23", "Domingo")).rejects.toThrow(NotFoundException);
    });

    //Prueba unitaria del servicio createScheduleCenter
    it("Deberia permitir la creación de un nuevo horario en el centro de revisión seleccionado", async()=>{
        const newSchedule={id:4,  day:"Viernes", opening_time:"8:00" ,closing_time:"18:00" , status: true}; 

        fakeSchedulesRepository.findOne.mockResolvedValue(null);

        fakeSchedulesRepository.save.mockResolvedValue({newSchedule});
        const result =await service.createScheduleCenter(1, newSchedule as any);

        expect(result.message).toEqual("El horario para el centro de revisión Nº 1 ha sido creado correctamente");
    })
    //Prueba unitaria de la excepción BadRequestException cuando el horario para el día seleccionado para centro de revisión ya se encuentra registrado
    it("Deberia retornar un BadRequestExcepcion cuando el horario para el día seleccionado para centro de revisión ya se encuentra registrado", async()=>{
        const newSchedule={id:4,  day:"Viernes", opening_time:"8:00" ,closing_time:"18:00" , status: true}; 

        fakeSchedulesRepository.findOne.mockResolvedValue(newSchedule); 
        await expect(service.createScheduleCenter(1, newSchedule as any)).rejects.toThrow(BadRequestException);
    });

    //Prueba unitaria del servicio updateScheduleCenter
    it("Deberia permitir la actualización de un horario en un centro de revisión", async()=>{
        const updatedSchedule={id:5,  day:"Viernes", opening_time:"8:00" ,closing_time:"18:00" , status: true}
        fakeSchedulesRepository.findOne.mockResolvedValue(updatedSchedule);
        fakeSchedulesRepository.update.mockResolvedValue({affected:1})

        const result=await service.updateScheduleCenter(5, {opening_time:"07:00"});

        expect(result.message).toEqual("El horario ha sido actualizado correctamente");

    })
    //Prueba unitaria de la excepción ConflictException del servicio updateScheduleCenter
    it("Deberia retornar un ConflictException cuando no se pudo actualizar el horario seleccionado del centro de revisión", async()=>{
        const updatedSchedule={id:5,  day:"Viernes", opening_time:"8:00" ,closing_time:"18:00" , status: true}
        fakeSchedulesRepository.findOne.mockResolvedValue(updatedSchedule);
        fakeSchedulesRepository.update.mockResolvedValue({affected:0});

        await expect(service.updateScheduleCenter(5, {opening_time:"07:00"})).rejects.toThrow(ConflictException);
    });

    //Prueba unitaria del servicio inactivatedScheduleCenter
    it("Deberia permitir la inactivación de un horario del centro de revisión seleccionado", async()=>{
        const updatedInactiveSchedule={id:6, day:"Jueves", opening_time:"08:00", closing_time:"15:00", status:true}; 

        fakeSchedulesRepository.findOne.mockResolvedValue(updatedInactiveSchedule);
        fakeSchedulesRepository.update.mockResolvedValue({affected:1});

        const result=await service.inactivatedScheduleCenter(6); 

        expect(fakeSchedulesRepository.update).toHaveBeenCalledWith(6, {status:false});
        expect(result.message).toEqual("El horario del centro de revisión para el día Jueves se inactivo correctamente")
    })
    //Prueba unitaria de la excepción ConflictException del servicio inactivatedScheduleCenter
    it("Deberia retornar un ConflictException cuando no se pudo inactivar el horario seleccionado del centro de revisión", async()=>{
        const updatedInactiveSchedule={id:6, day:"Jueves", opening_time:"08:00", closing_time:"15:00", status:true}; 

        fakeSchedulesRepository.findOne.mockResolvedValue(updatedInactiveSchedule);
        fakeSchedulesRepository.update.mockResolvedValue({affected:0});

        await expect(service.inactivatedScheduleCenter(6)).rejects.toThrow(ConflictException); 
    });

})