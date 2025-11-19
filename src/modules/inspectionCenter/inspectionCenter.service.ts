import { ConflictException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { UpdateScheduleDTO } from "./dto/update-schedule.dto";
import { CreateScheduleDTO } from "./dto/create-schedule.dto";
import { ScheduleInspectionCenterEntity } from "./entity/scheduleInspectionCenter.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";
import { LogsService } from "../logs/logs.service";

@Injectable()
export class InspectionCenterService {
    constructor(
        @InjectRepository(InspectionCenterEntity)
        private inspectionCenterRepo: Repository<InspectionCenterEntity>, 

        @InjectRepository(ScheduleInspectionCenterEntity)
        private scheduleInspectionCenterRepo: Repository<ScheduleInspectionCenterEntity>,
         private readonly logsService: LogsService
    ){}

    // ===============================================================
    //  SERVICIOS MÓDULO CENTRO DE REVISIÓN
    // ===============================================================

    async findAllActiveCenters() {

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron todos los centros de revisión activos`
        });

        return this.inspectionCenterRepo.find({ where: { status: true } });
    }

    async findAllCenters() {

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron todos los centros de revisión activos e inactivos`
        });
        return this.inspectionCenterRepo.find();
    }

    //Servicio que permite obtener un centro de revisión por su id
    async findOneCenterById(id:number){
        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({where:{id_center:id}});
        if(!centerExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");

        if(centerExist.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")
        
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultó por id el centro de revisión: ${centerExist.name}`
        });

        return centerExist;
    }

    //Servicio que permite obtener un centro de revisión por su nombre
    async findOneCenterByName(name:string){
        //Normalización del nombre ingresado por el usuario para su correcta consulta
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centerExist=await this.inspectionCenterRepo.findOne({where:{name}});
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");
        
        if(centerExist.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")
        
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultó por nombre el centro de revisión: ${centerExist.name}`
        });

        return centerExist;
    }

    //Servicio que permite obtener todos los centros de revisión en una ciudad específica
    async findCentersByCity(city:string){
        //Normalización de la ciudad ingresada por el usuario para su correcta consulta
        city=city.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centersExist=await this.inspectionCenterRepo.find({where:{city}});
        const activeCenters=centersExist.filter(center => center.status===true);
    
        if(activeCenters.length === 0)throw new NotFoundException(`No se encuentran centros de revisión activos en la ciudad ${city}`)
        
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron los centros de revisión de la ciudad: ${city}`
        });

        return activeCenters;
    }

    //Servicio que permite crear un centro de revisión
    async createInspectionCenter(dataCenter: CreateInspectionCenterDto) {
        const existingInspectionCenter=await  this.inspectionCenterRepo.findOne({where:{name:dataCenter.name}}); 
        if(existingInspectionCenter) throw new BadRequestException(`El centro de revisión ${dataCenter.name} ya se encuentra registrado`);
        
        const newCenter = this.inspectionCenterRepo.create(dataCenter);
        const savedCenter = await this.inspectionCenterRepo.save(newCenter);

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se creó un nuevo centro de revisión: ${savedCenter.name}`
        });

        return{
            message:"El centro de revisión ha sido creado correctamente", 
            inspectionCenter: savedCenter
        } 
    }

    //Servicio que permite actualizar la información de un centro de revisión
    async updateInspectionCenter(id:number, newDataCenter:UpdateInspectionCenterDto){
        
        //Validar la existencia del centro de revisión
        const isCenterExist=await this.findOneCenterById(id);
        if(!isCenterExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const updatedCenter = await this.inspectionCenterRepo.update(id, newDataCenter);

        //Validar la correcta actualización del centro seleccionado
        if(updatedCenter.affected===0) throw new ConflictException("No se pudo actualizar la información del centro de revisión");

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Centro de revisión actualizado: ${newDataCenter.name ?? isCenterExist.name}`
        });

        return{
            message:`El centro de revisión se actualizo correctamente`, 
        }
    }

    //Servicio que permite inactivar un centro de revisión
    async inactiveInspectionCenter(id:number){

        //Validar la existencia del centro de revisión
        const isCenterExist=await this.inspectionCenterRepo.findOne({where:{id_center:id}});
        if(!isCenterExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const inactivatedCenter = await this.inspectionCenterRepo.update(id, { status: false });

        //Validar la correcta inactivación del centro seleccionado
        if(!inactivatedCenter.affected) throw new ConflictException("No se pudo inactivar el centro de revisión");

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Centro de revisión inactivado: ${isCenterExist.name}`
        });

        return{
            message:`El centro de revisión ha sido inactivado correctamente`
        }

    }

    // ===============================================================
    //  SERVICIOS MÓDULO HORARIOS
    // ===============================================================

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre
    async findActiveSchedulesByCenterName(name:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name},
            relations:['schedule'],
        });
        if(!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Validar si el centro de revisión se encuenra activo
        if(schedulesCenter.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")
        
        // Validamos si schedule existe y no viene vacío
        if (!schedulesCenter.schedule || schedulesCenter.schedule.length === 0)throw new NotFoundException(`El centro de revisión ${schedulesCenter.name} no tiene horarios registrados`);
        
        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const activeSchedules=schedulesCenter.schedule.filter((schedule)=> schedule.status===true);
        
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron los horarios activos del centro de revisión ${schedulesCenter.name}`
        });

        return{
            message: `El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules: activeSchedules
        }
    }

    //Servicio que permite obtener los horarios (activos e inactivos) de un centro de revisión por su nombre
    async findAllSchedulesByCenterName(name:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name},
            relations:['schedule'],
        });

        if (!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Validar si el centro de revisión se encuenra activo
        if(schedulesCenter.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")

        // Validamos si schedule existe y no viene vacío
        if (!schedulesCenter.schedule || schedulesCenter.schedule.length === 0)throw new NotFoundException(`El centro de revisión ${schedulesCenter.name} no tiene horarios registrados`);
        
        const activeSchedules = schedulesCenter.schedule.filter((schedule) => schedule.status === true);

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron todos los horarios del centro de revisión ${schedulesCenter.name}`
        });

        return {
            message: `El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules: schedulesCenter.schedule
        };
    }

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre y día específico
    async findActiveSchedulesByDay(name:string, day:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();
        //Normalización del dia del horario del centro de revisión consultado
        day=day.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{name},
            relations:['schedule'],
        });
        
        if (!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Validar si el centro de revisión se encuenra activo
        if(centerExist.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")

        if (!centerExist.schedule || centerExist.schedule.length === 0)
        throw new NotFoundException(
            `El centro de revisión ${centerExist.name} no tiene horarios registrados`
        );
        
        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const schedulesByDay=  centerExist?.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase() && schedule.status===true
        )

        //Validar la existencia de algún horario para el centro de revisión en el día seleccionado
        if(!schedulesByDay.length) throw new NotFoundException(`El centro de revisión no tiene horarios activos registrados para el día ${day}`);
        
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron los horarios activos del centro de revisión ${centerExist.name} para el día ${day}`
        });

        return {
            message: `El centro de revisión ${centerExist.name} tiene los siguientes horarios registrados`,
            schedules: schedulesByDay
        };
    }

    //Servicio que permite obtener los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico
    async findAllSchedulesByDay(name:string, day:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();
        //Normalización del dia del horario del centro de revisión consultado
        day=day.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{name},
            relations:['schedule'],
        });

        if (!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Validar si el centro de revisión se encuenra activo
        if(centerExist.status===false)throw new BadRequestException("El centro de revisión no se encuentra activo")

        if (!centerExist.schedule || centerExist.schedule.length === 0)
        throw new NotFoundException(
            `El centro de revisión ${centerExist.name} no tiene horarios registrados`
        );
        
        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const schedulesByDay=  centerExist?.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase()
        )
       //Validar la existencia de algún horario para el centro de revisión en el día seleccionado
        if(!schedulesByDay?.length) throw new NotFoundException(`El centro de revisión no tiene horarios registrados para el día ${day}`);

         // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se consultaron todos los horarios del centro de revisión ${centerExist.name} para el día ${day}`
        });

        return {
            message: `El centro de revisión ${centerExist?.name} tiene los siguientes horarios registrados para el día ${day}`,
            schedules: schedulesByDay
        };
    }

    //Servicio que permite crear un nuevo horario en el centro de revisión seleccionado
    async createScheduleCenter( centerId:number,newSchedule:CreateScheduleDTO){
        newSchedule.day=newSchedule.day.trim().toLowerCase();

        const existingSchedule= await this.scheduleInspectionCenterRepo.findOne(
            {where:{ 
                day: newSchedule.day,
                inspectionCenter: { id_center: centerId }
            }}
        );
        if(existingSchedule)throw new BadRequestException(`El horario para el día ${newSchedule.day} para el centro de revisión ya se encuentra registrado`)

        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{id_center:centerId}, 
            relations: ['schedule']
        })

        if(!centerExist) throw new NotFoundException("El centro de revisión no se fue encontrado");

        const schedule=this.scheduleInspectionCenterRepo.create({
            ...newSchedule, 
            inspectionCenter:{id_center:centerId}
        });
        await this.scheduleInspectionCenterRepo.save(schedule);

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se creo un horario para el centro de revisión: ${centerExist.name}`
        });

        return{
            message:`El horario para el centro de revisión Nº ${centerId} ha sido creado correctamente`, 
        } 
    }

    //Servicio que permite actualizar un horario en un centro de revisión
    async updateScheduleCenter(id:number, dataToUpdated:UpdateScheduleDTO){

        //Validar la existencia del horario seleccionado en el  centro de revisión
        const scheduleExist= await this.scheduleInspectionCenterRepo.findOne({where:{id_schedule:id}});
        if(!scheduleExist) throw new NotFoundException("El horario del centro de revisión no fue encontrado");

        //Validar la correcta actualización del horario del centro de revisión seleccionado
        const updatedSchedule= await this.scheduleInspectionCenterRepo.update(
            id, 
            dataToUpdated as QueryDeepPartialEntity<ScheduleInspectionCenterEntity>
        );
        if(updatedSchedule.affected===0) throw new ConflictException("No se pudo actualizar el horario seleccionado")
    
        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se actualizó el horario para el día ${scheduleExist.day}`
        });

        return{
            message:"El horario ha sido actualizado correctamente"
        }
    }

    //Servicio que permite la inactivación de un horario del centro de revisión seleccionado
    async inactivatedScheduleCenter(id:number){

        //Validar la existencia del horario seleccionado en el  centro de revisión
        const scheduleExist= await this.scheduleInspectionCenterRepo.findOne({where:{id_schedule:id}});
        if(!scheduleExist) throw new NotFoundException("El horario del centro de revisión no fue encontrado");

        const inactivatedSchedule =await this.scheduleInspectionCenterRepo.update(id, {status:false});
        //Validar la correcta inactivación del horario del centro de revisión seleccionado
        if(!inactivatedSchedule.affected) throw new ConflictException("No se pudo inactivar el horario del centro de revisión"); 

        // Guardar log
        await this.logsService.create({
            date: new Date(),
            host: 'localhost',
            service: 'InspectionCenterService',
            content: `Se inactivó el horario para el día ${scheduleExist.day}`
        });

        return{
            message:`El horario del centro de revisión para el día ${scheduleExist.day} se inactivo correctamente`
        }
    }
}
