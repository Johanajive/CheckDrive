import { Body, Controller, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import { InspectionCenterService } from "./inspectionCenter.service";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { CreateScheduleDTO } from "./dto/create-schedule.dto";
import { UpdateScheduleDTO } from "./dto/update-schedule.dto";

@Controller('inspectionCenter')
export class InspectionCenterController{
    constructor(private readonly inspectionCenterService: InspectionCenterService){}

    /*Controladores servicios Modulo Centro de Revisión*/

    //Endpoint http://localhost:3000/inspectionCenter (GET)
    @Get()
    //Role: User
    findAllActiveCenters(){
        return this.inspectionCenterService.findAllActiveCenters();
    }

    //Endpoint http://localhost:3000/inspectionCenter/all (GET)
    @Get("/all")
    //Role: Admin
    findAllCenters(){
        return this.inspectionCenterService.findAllCenters();
    }

    //Endpoint http://localhost:3000/inspectionCenter/3 (GET)
    @Get(':id')
    //Role: User
    findOneCenterById(@Param ("id", ParseIntPipe)id:number){
        return this.inspectionCenterService.findOneCenterById(id);
    }

    //Endpoint http://localhost:3000/inspectionCenter/CentroAutos (GET)
    @Get(':name')
    //Role: User
    findOneCenterByName(@Param("name") name:string){
        return this.inspectionCenterService.findOneCenterByName(name);
    }

    //Endpoint http://localhost:3000/inspectionCenter/Bogota (GET)
    @Get(':city')
    //Role: User
    findCentersByCity(@Param("city") city:string){
        return this.inspectionCenterService.findCentersByCity(city);
    }

    //Endpoint: http://localhost:3000/inspectionCenter (POST)
    @Post()
    createInspectionCenter(@Body() dataCenter:CreateInspectionCenterDto){
        return this.inspectionCenterService.createInspectionCenter(dataCenter);
    }

    //Endpoint: http://localhost:3000/inspectionCenter/1 (PUT)
    @Put(":id")
    updateInspectionCenter(@Param("id", ParseIntPipe) id:number, @Body() newDataCenter:UpdateInspectionCenterDto){
        return this.inspectionCenterService.updateInspectionCenter(id, newDataCenter);
    }

    //Endpoint: http://localhost:3000/inspectionCenter/2/inactive (PUT)
    @Put(":id/inactive")
    inactiveInspectionCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactiveInspectionCenter(id);
    }


    /*Controladores servicios Modulo Horarios Centro de Revisión*/

    //Endpoint http://localhost:3000/inspectionCenter/schedules/1/active (GET)
    @Get("schedules/:id/active")
    //Role: User
    findActiveSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findActiveSchedulesByCenterId(name);
    }

    //Endpoint http://localhost:3000/inspectionCenter/schedules/1/all (GET)
    @Get("schedules/:id/all")
    //Role:Admin
    findAllSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findAllSchedulesByCenterId(name);
    }

    //Endpoint http://localhost:3000/inspectionCenter/schedules/CentroAutos/Martes/active (GET)
    @Get("schedules/:name/:day/active")
    //Role: User
    findActiveSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findActiveSchedulesByDay(name, day);
    }

    //Endpoint http://localhost:3000/inspectionCenter/schedules/CentroAutos/Martes/all (GET)
    @Get("schedules/:name/:day/all")
    //Role: Admin
    findAllSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findAllSchedulesByDay(name, day);
    }
    
    //Endpoint http://localhost:3000/inspectionCenter/schedules/2 (POST)
    @Post("schedules/:id")
    createScheduleCenter(@Param("id", ParseIntPipe) idCenter:number, @Body() dataNewSchedule:CreateScheduleDTO){
        return this.inspectionCenterService.createScheduleCenter(idCenter, dataNewSchedule)
    }

    //Endpoint http://localhost:3000/inspectionCenter/schedules/3 (PUT)
    @Put("schedules/:id")
    updateScheduleCenter(@Param("id", ParseIntPipe) id:number, @Body() dataToUpdate:UpdateScheduleDTO){
        return this.inspectionCenterService.updateScheduleCenter(id, dataToUpdate);
    }

    //Endpoint http://localhost:3000/inspectionCenter/schedules/4/inactive (PUT)
    @Put("schedules/:id/inactive")
    inactivatedScheduleCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactivatedScheduleCenter(id)
    }
}