import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { ScheduleInspectionCenterEntity } from "./entity/scheduleInspectionCenter.entity";
import { InspectionCenterController } from "./inspectionCenter.controller";
import { InspectionCenterService } from "./inspectionCenter.service";

const inspectionCentersFake: Partial<InspectionCenterEntity>[]=[
    {
        id_center:1, 
        name:"Centro Carros", 
        city:"Bogotá", 
        address:"Calle 48 #89-89", 
        phone:"555-12345", 
        status:true,
        schedule:[
            {id_schedule:1,  day:"Lunes", opening_time:"08:00" ,closing_time:"19:00" , status: false, inspectionCenter:{id_center:1}}, 
            {id_schedule:2,  day:"Miércoles", opening_time:"08:00" ,closing_time:"19:00" , status: true, inspectionCenter:{id_center:1}}, 
            {id_schedule:3,  day:"Domingo", opening_time:"10:00" ,closing_time:"15:00" , status: true, inspectionCenter:{id_center:1}}
        ] as Partial<ScheduleInspectionCenterEntity>[]
    }, 
    {
        id_center:2, 
        name:"SOAT SAS", 
        city:"Bogotá", 
        address:"Calle 78 #10-85", 
        phone:"555-12895", 
        status:true, 
        schedule:[
            {id_schedule:1,  day:"Martes", opening_time:"08:00" ,closing_time:"19:00" , status: true, inspectionCenter:{id_center:2}}, 
            {id_schedule:2,  day:"Jueves", opening_time:"08:00" ,closing_time:"19:00" , status: false, inspectionCenter:{id_center:2}}, 
            {id_schedule:3,  day:"Sábado", opening_time:"10:00" ,closing_time:"15:00" , status: true, inspectionCenter:{id_center:2}}
        ] as Partial<ScheduleInspectionCenterEntity>[]
    }, 
    {
        id_center:3, 
        name:"Centro Arregla Todo", 
        city:"Medellín", 
        address:"Cra 10 #67-95", 
        phone:"555-18542", 
        status:false, 
        schedule:[
            {id_schedule:1,  day:"Lunes", opening_time:"07:00" ,closing_time:"18:00" , status: false, inspectionCenter:{id_center:3}}, 
            {id_schedule:2,  day:"Miércoles", opening_time:"07:00" ,closing_time:"18:00" , status: false, inspectionCenter:{id_center:3}}, 
            {id_schedule:3,  day:"Domingo", opening_time:"09:00" ,closing_time:"13:00" , status: false, inspectionCenter:{id_center:3}}
        ]as Partial<ScheduleInspectionCenterEntity>[]
    },
]

describe("InspectionCenterController", ()=>{
    let controller:InspectionCenterController
    let service:jest.Mocked<InspectionCenterService>

    beforeEach(()=>{
        service={
            findAllActiveCenters:jest.fn(), 
            findAllCenters:jest.fn(), 
            findOneCenterById:jest.fn(), 
            findOneCenterByName:jest.fn(),
            findCentersByCity:jest.fn(),
            createInspectionCenter:jest.fn(),
            updateInspectionCenter:jest.fn(),
            inactiveInspectionCenter:jest.fn(),
            findActiveSchedulesByCenterName:jest.fn(),
            findAllSchedulesByCenterName:jest.fn(),
            findActiveSchedulesByDay:jest.fn(),
            findAllSchedulesByDay:jest.fn(),
            createScheduleCenter:jest.fn(),
            updateScheduleCenter:jest.fn(),
            inactivatedScheduleCenter:jest.fn(),
        }as any    
        controller=new InspectionCenterController(service)
    }); 

    //Pruebas unitarias para los servicios Modulo Centro de Revisión 
    
    //Prueba unitaria del servicio findAllActiveCenters
    it("Deberia retornar todos los centros de revisión activos", async()=>{
        service.findAllActiveCenters.mockResolvedValue(inspectionCentersFake)
    });
    
    //Prueba unitaria del servicio findAllCenters
    it("Deberia retornar todos los centros de revisión activos e inactivos", async()=>{

    });
    
    //Prueba unitaria del servicio findOneCenterById
    it("Deberia retornar un centro de revisión por su id", async()=>{

    });
    // Prueba unitaria de la excepción NotFoundExcepción cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no se encuentra registrado", async()=>{

    });
    // Prueba unitaria de la excepción BadRequestExcepción cuando el centro de revisión no se encuentra activo
    it("Deberia retornar un BadRequestExcepcion cuando el centro de revisión no se encuentra activo", async()=>{

    })
    
    //Prueba unitaria del servicio findOneCenterByName
    it("Deberia retornar un centro de revisión por su nombre", async()=>{

    });
    
    //Prueba unitaria del servicio findCentersByCity
    it("Deberia retornar todos los centros de revisión en una ciudad específica", async()=>{

    })
    // Prueba unitaria de la excepción NotFoundExcepción cuando no se encuentran centros de revisión activos en la ciudad
    it("Deberia retornar un BadRequestExcepcion cuando no se encuentran centros de revisión activos en la ciudad", async()=>{

    })
    
    //Prueba unitaria del servicio createInspectionCenter
    it("Deberia permitir la creación de un nuevo centro de revisión", async()=>{

    })
    //Prueba unitaria de la excepción BadRequestException cuando el centro de revisión ya se encuentra registrado
    it("Deberia retornar un BadRequestExcepcion cuando el centro de revisión ya se encuentra registrado", async()=>{
            
    })
    
    
    //Prueba unitaria del servicio updateInspectionCenter
    it("Deberia permitir la actualización de un centro de revisión", async()=>{
            
        
    })
    //Prueba unitaria de la excepción ConflictException cuando no se pudo actualizar la información del centro de revisión
    it("Deberia retornar un ConflictException cuando no se pudo actualizar la información del centro de revisión", async()=>{
            
    })
    
    //Prueba unitaria del servicio inactiveInspectionCenter
    it("Deberia permitir la inactivación de un centro de revisión", async()=>{
            
    
    })
    //Prueba unitaria de la excepción NotFoundException del servicio inactiveInspectionCenter cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un NotFoundException cuando el centro de revisión no se encuentra registrado", async()=>{
            
    })
    //Prueba unitaria de la excepción ConflictException cuando el centro de revisión no se encuentra registrado
    it("Deberia retornar un ConflictException cuando el centro de revisión no se encuentra registrado", async()=>{
            
    })
    
        
    /* Pruebas unitarias para los servicios para el atributo Horarios*/
    
    //Prueba unitaria del servicio findActiveSchedulesByCenterName
    it("Deberia retornar los horarios activos de un centro de revisión por su nombre", async()=>{
            
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios activos registrados
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios activos registrados", async()=>{
            
    });
    
    //Prueba unitaria del servicio findAllSchedulesByCenterName
    it("Deberia retornar los horarios (activos e inactivos) de un centro de revisión por su nombre", async()=>{

    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios registrados
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios registrados", async()=>{
            
    });
    
    //Prueba unitaria del servicio findActiveSchedulesByDay
    it("Deberia retornar los horarios activos de un centro de revisión por su nombre y día específico", async()=>{
            
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios activos registrados para el día seleccionado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios activos registrados para el día seleccionado", async()=>{
            
    });
    
    //Prueba unitaria del servicio findAllSchedulesByDay
    it("Deberia retornar los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico", async()=>{
            
    })
    //Prueba unitaria de la excepción NotFoundException cuando el centro de revisión no tiene horarios registrados para el día seleccionado
    it("Deberia retornar un NotFoundExcepcion cuando el centro de revisión no tiene horarios registrados para el día seleccionado", async()=>{
            
    });
    
    //Prueba unitaria del servicio createScheduleCenter
    it("Deberia permitir la creación de un nuevo horario en el centro de revisión seleccionado", async()=>{
           
    })
    //Prueba unitaria de la excepción BadRequestException cuando el horario para el día seleccionado para centro de revisión ya se encuentra registrado
    it("Deberia retornar un BadRequestExcepcion cuando el horario para el día seleccionado para centro de revisión ya se encuentra registrado", async()=>{
           
    });
    
    //Prueba unitaria del servicio updateScheduleCenter
    it("Deberia permitir la actualización de un horario en un centro de revisión", async()=>{

    
    })
    //Prueba unitaria de la excepción ConflictException del servicio updateScheduleCenter
    it("Deberia retornar un ConflictException cuando no se pudo actualizar el horario seleccionado del centro de revisión", async()=>{
            
    });
    
    //Prueba unitaria del servicio inactivatedScheduleCenter
    it("Deberia permitir la inactivación de un horario del centro de revisión seleccionado", async()=>{

    })
    //Prueba unitaria de la excepción ConflictException del servicio inactivatedScheduleCenter
    it("Deberia retornar un ConflictException cuando no se pudo inactivar el horario seleccionado del centro de revisión", async()=>{

    });
})