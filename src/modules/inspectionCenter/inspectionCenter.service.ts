import { Injectable, NotFoundException } from "@nestjs/common";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";

@Injectable()
export class InspectionCenterService{

    constructor(
        @InjectRepository(InspectionCenterEntity)
        private inspectionCenterRepo: Repository<InspectionCenterEntity>
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
        const centerExist= await this.inspectionCenterRepo.findOne({where:{id_center:id, status:true}});
        if(!centerExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");
        
        return centerExist;
    }

    //Servicio que permite obtener un centro de revisión por su nombre
    async findOneCenterByName(name:string){
        const centerExist=await this.inspectionCenterRepo.findOne({where:{name, status:true}});
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");
        
        return centerExist;
    }

    //Servicio que permite obtener todos los centros de revisión (activos e inactivos) en una ciudad específica
    async findCentersByCity(city:string){
        return this.inspectionCenterRepo.find({where:{city, status:true}});
    }

    //Servicio que permite crear un nuevo centro de revisión
    createInspectionCenter(dataCenter:CreateInspectionCenterDto){
        const newCenter=this.inspectionCenterRepo.create(dataCenter);
        return this.inspectionCenterRepo.save(newCenter);
    }

    //Servicio que permite actualizar la información de un centro de revisión
    async updateInspectionCenter(id:number, newDataCenter:UpdateInspectionCenterDto){
        const isCenterExist=await this.findOneCenterById(id);
        if(!isCenterExist)throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const updatedCenter=await this.inspectionCenterRepo.update(id,newDataCenter);

        if(!updatedCenter.affected) throw new NotFoundException("No se pudo actualizar la información del centro de revisión");
        return this.findOneCenterById(id);
    }

    //Servicio que permite inactivar un centro de revisión
    async inactiveInspectionCenter(id:number){
        const isCenterExist=await this.inspectionCenterRepo.findOne({where:{id_center:id}});
        if(!isCenterExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const inactivatedCenter=await this.inspectionCenterRepo.update(id, {status:false}); 

        if(!inactivatedCenter.affected) throw new NotFoundException("No se pudo inactivar el centro de revisión");
        return{
            message:`El centro de revisión ${isCenterExist.name} ha sido inactivado correctamente`
        }
    }

    /*Servicios para el atributo Horarios*/

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre
    async findActiveSchedulesByCenterId(name:string){
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });

        if(!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const activeSchedules=schedulesCenter.schedule.filter((schedule)=> schedule.status===true);

        if(!activeSchedules.length) throw new NotFoundException("El centro de revisión no tiene horarios activos registrados");        
        return {
            message:`El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules:schedulesCenter.schedule
        }
    }

    //Servicio que permite obtener los horarios (activos e inactivos) de un centro de revisión por su nombre
    async findAllSchedulesByCenterId(name:string){
        const schedulesCenter=await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });

        if(!schedulesCenter) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        if(!schedulesCenter.schedule.length) throw new NotFoundException("El centro de revisión no tiene horarios registrados");
      
        return {
            message:`El centro de revisión ${schedulesCenter.name} tiene los siguientes horarios registrados`,
            schedules:schedulesCenter.schedule
        }
    }

    //Servicio que permite obtener los horarios activos de un centro de revisión por su nombre y día específico
    async findActiveSchedulesByDay(name:string, day:string){
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{name, status:true},
            relations:['schedule'],
        });
        
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const schedulesByDay=  centerExist.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase() && schedule.status===true
        )
        if(!schedulesByDay.length) throw new NotFoundException(`El centro de revisión no tiene horarios registrados para el día ${day}`);

        return{
            message:`El centro de revisión ${centerExist.name} tiene los siguientes horarios registrados para el día ${day}`,
            schedules:schedulesByDay
        }
    }

    //Servicio que permite obtener los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico
    async findAllSchedulesByDay(name:string, day:string){
        const centerExist= await this.inspectionCenterRepo.findOne({
            where:{name},
            relations:['schedule'],
        });
        
        if(!centerExist) throw new NotFoundException("El centro de revisión no se encuentra registrado");

        const schedulesByDay=  centerExist.schedule.filter(
            (schedule)=> schedule.day.toLowerCase()===day.toLowerCase()
        )
        if(!schedulesByDay.length) throw new NotFoundException(`El centro de revisión no tiene horarios registrados para el día ${day}`);

        return{
            message:`El centro de revisión ${centerExist.name} tiene los siguientes horarios registrados para el día ${day}`,
            schedules:schedulesByDay
        }
    }
    

}