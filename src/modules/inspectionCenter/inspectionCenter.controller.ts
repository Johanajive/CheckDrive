import { Body, Controller, Get, Param, ParseIntPipe, Post, Put} from "@nestjs/common";
import { InspectionCenterService } from "./inspectionCenter.service";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";

@Controller('inspection-centers')
export class InspectionCenterController{
    constructor(private readonly inspectionCenterService: InspectionCenterService){}

    /*Controladores servicios Modulo Centro de Revisión*/

    @Get()
    //Role: User
    findAllActiveCenters(){
        return this.inspectionCenterService.findAllActiveCenters();
    }

    @Get("/all")
    //Role: Admin
    findAllCenters(){
        return this.inspectionCenterService.findAllCenters();
    }

    @Get(':id')
    //Role: User
    findOneCenterById(@Param ("id", ParseIntPipe)id:number){
        return this.inspectionCenterService.findOneCenterById(id);
    }

    @Get(':name')
    //Role: User
    findOneCenterByName(@Param("name") name:string){
        return this.inspectionCenterService.findOneCenterByName(name);
    }

    @Get(':city')
    //Role: User
    findCentersByCity(@Param("city") city:string){
        return this.inspectionCenterService.findCentersByCity(city);
    }

    @Post()
    createInspectionCenter(@Body() dataCenter:CreateInspectionCenterDto){
        return this.inspectionCenterService.createInspectionCenter(dataCenter);
    }

    @Put(":id")
    updateInspectionCenter(@Param("id", ParseIntPipe) id:number, @Body() newDataCenter:UpdateInspectionCenterDto){
        return this.inspectionCenterService.updateInspectionCenter(id, newDataCenter);
    }

    @Put(":id/inactive")
    inactiveInspectionCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactiveInspectionCenter(id);
    }


    /*Controladores servicios Modulo Horarios Centro de Revisión*/

    @Get(":id/schedules/active")
    //Role: User
    findActiveSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findActiveSchedulesByCenterId(name);
    }

    @Get(":id/schedules/all")
    //Role:Admin
    findAllSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findAllSchedulesByCenterId(name);
    }

    @Get(":name/schedules/:day/active")
    //Role: User
    findActiveSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findActiveSchedulesByDay(name, day);
    }

    @Get(":name/schedules/:day/all")
    //Role: Admin
    findAllSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findAllSchedulesByDay(name, day);
    }

}