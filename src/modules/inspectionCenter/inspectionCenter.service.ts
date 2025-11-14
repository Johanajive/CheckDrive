import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { UpdateScheduleDTO } from "./dto/update-schedule.dto";
import { CreateScheduleDTO } from "./dto/create-schedule.dto";
import { ScheduleInspectionCenterEntity } from "./entity/scheduleInspectionCenter.entity";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity.js";

@Injectable()
export class InspectionCenterService{

    constructor(
        @InjectRepository(InspectionCenterEntity)
        private inspectionCenterRepo: Repository<InspectionCenterEntity>, 

        @InjectRepository(ScheduleInspectionCenterEntity)
        private scheduleInspectionCenterRepo: Repository<ScheduleInspectionCenterEntity>
    ){}

    /*Servicios Modulo Centro de Revisión*/ 

    //Servicio que permiten obtener todos los centros de revisión activos
    findAllActiveCenters(){
        return this.inspectionCenterRepo.find({where:{status:true}});
    }

    //Servicio que permite obtener todos los centros de revisión (activos e inactivos)
    findAllCenters(){
        return this.inspectionCenterRepo.find();
    }

    //Servicio que permite obtener un centro de revisión por su id
    async findOneCenterById(id:number){
        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({where:{id_center:id, status:true}});
        if(!centerExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");
        
        return centerExist;
    }

    //Servicio que permite obtener un centro de revisión por su nombre
    async findOneCenterByName(name:string){
        //Normalización del nombre ingresado por el usuario para su correcta consulta
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centerExist=await this.inspectionCenterRepo.findOne({where:{name, status:true}});
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");
        
        return centerExist;
    }

    //Servicio que permite obtener todos los centros de revisión en una ciudad específica
    async findCentersByCity(city:string){
        //Normalización de la ciudad ingresada por el usuario para su correcta consulta
        city=city.trim().toLowerCase();
        
        return this.inspectionCenterRepo.find({where:{city, status:true}});
    }

    //Servicio que permite crear un nuevo centro de revisión
    createInspectionCenter(dataCenter:CreateInspectionCenterDto){
        const newCenter=this.inspectionCenterRepo.create(dataCenter);
        return this.inspectionCenterRepo.save(newCenter);
    }

    //Servicio que permite actualizar la información de un centro de revisión
    async updateInspectionCenter(id:number, newDataCenter:UpdateInspectionCenterDto){
        
        //Validar la existencia del centro de revisión
        const isCenterExist=await this.findOneCenterById(id);
        if(!isCenterExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const updatedCenter=await this.inspectionCenterRepo.update(id,newDataCenter);

        //Validar la correcta actualización del centro seleccionado
        if(!updatedCenter.affected) throw new ConflictException("No se pudo actualizar la información del centro de revisión");
        return this.findOneCenterById(id);
    }

    //Servicio que permite inactivar un centro de revisión
    async inactiveInspectionCenter(id:number){

        //Validar la existencia del centro de revisión
        const isCenterExist=await this.inspectionCenterRepo.findOne({where:{id_center:id}});
        if(!isCenterExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const inactivatedCenter=await this.inspectionCenterRepo.update(id, {status:false}); 

        //Validar la correcta inactivación del centro seleccionado
        if(!inactivatedCenter.affected) throw new ConflictException("No se pudo inactivar el centro de revisión");
        return{
            message:`El centro de revisión ${isCenterExist.name} ha sido inactivado correctamente`
        }
    }

    /*Servicios para el atributo Horarios*/

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre
    async findActiveSchedulesByCenterName(name:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });
        if(!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const activeSchedules=schedulesCenter.schedule.filter((schedule)=> schedule.status===true);

        //Validar la existencia de algún horario para el centro de revisión seleccionado
        if(!activeSchedules.length) throw new NotFoundException("El centro de revisión no tiene horarios activos registrados");        
        return {
            message:`El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules:schedulesCenter.schedule
        }
    }

    //Servicio que permite obtener los horarios (activos e inactivos) de un centro de revisión por su nombre
    async findAllSchedulesByCenterName(name:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });

        if(!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Validar la existencia de algún horario para el centro de revisión seleccionado
        if(!schedulesCenter.schedule.length) throw new NotFoundException("El centro de revisión no tiene horarios registrados");
      
        return {
            message:`El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules:schedulesCenter.schedule
        }
    }

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre y día específico
    async findActiveSchedulesByDay(name:string, day:string){
        //Normalización del nombre del centro de revisión consultado
        name=name.trim().toLowerCase();
        //Normalización del dia del horario del centro de revisión consultado
        day=day.trim().toLowerCase();

        //Validar la existencia del centro de revisión
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });
        
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const schedulesByDay=  centerExist.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase() && schedule.status===true
        )

        //Validar la existencia de algún horario para el centro de revisión en el día seleccionado
        if(!schedulesByDay.length) throw new NotFoundException(`El centro de revisión no tiene horarios registrados para el día ${day}`);

        return{
            message:`El centro de revisión ${centerExist.name} tiene los siguientes horarios registrados para el día ${day}`,
            schedules:schedulesByDay
        }
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
        
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        //Encontrar todos los horarios relacionados al nombre del centro de revision consultado
        const schedulesByDay=  centerExist.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase()
        )
       //Validar la existencia de algún horario para el centro de revisión en el día seleccionado
        if(!schedulesByDay.length) throw new NotFoundException(`El centro de revisión no tiene horarios registrados para el día ${day}`);

        return{
            message:`El centro de revisión ${centerExist.name} tiene los siguientes horarios registrados para el día ${day}`,
            schedules:schedulesByDay
        }
    }

    //Servicio que permite crear un nuevo horario en el centro de revisión seleccionado
    createScheduleCenter( centerId:number,newSchedule:CreateScheduleDTO){

        //Validar la existencia del centro de revisión
        const centerExist=this.inspectionCenterRepo.findOne({
            where:{id_center:centerId}, 
            relations: ['schedule']
        })

        if(!centerExist) throw new NotFoundException("El centro de revisión no se fue encontrado");

        const schedule=this.scheduleInspectionCenterRepo.create({
            ...newSchedule, 
            inspectionCenter:{id_center:centerId}
        });
        return this.scheduleInspectionCenterRepo.save(schedule);
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
        if(!updatedSchedule.affected) throw new ConflictException("No se pudo actualizar el horario seleccionado")
    
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

        return{
            message:`El horario del centro de revisión para el día ${scheduleExist.day} se inactivo correctamente`
        }
    }

    

}