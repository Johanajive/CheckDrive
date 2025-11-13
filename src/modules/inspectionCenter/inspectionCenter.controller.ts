import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards} from "@nestjs/common";
import { InspectionCenterService } from "./inspectionCenter.service";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesEnum } from "src/common/enum/roles.enum";

@Controller('inspection-centers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionCenterController{
    constructor(private readonly inspectionCenterService: InspectionCenterService){}

    @Get()
    @Roles(RolesEnum.USER)
    findAllActiveCenters(){
        return this.inspectionCenterService.findAllActiveCenters();
    }

    @Get("/all")
    @Roles(RolesEnum.ADMIN)
    findAllCenters(){
        return this.inspectionCenterService.findAllCenters();
    }

    @Get(':id')
    @Roles(RolesEnum.ADMIN)
    findOneCenterById(@Param ("id", ParseIntPipe)id:number){
        return this.inspectionCenterService.findOneCenterById(id);
    }

    @Get(':name')
    @Roles(RolesEnum.USER)
    findOneCenterByName(@Param("name") name:string){
        return this.inspectionCenterService.findOneCenterByName(name);
    }

    @Get(':city')
    @Roles(RolesEnum.USER)
    findCentersByCity(@Param("city") city:string){
        return this.inspectionCenterService.findCentersByCity(city);
    }

    @Post()
    @Roles(RolesEnum.ADMIN)
    createInspectionCenter(@Body() dataCenter:CreateInspectionCenterDto){
        return this.inspectionCenterService.createInspectionCenter(dataCenter);
    }

    @Put(":id")
    @Roles(RolesEnum.ADMIN)
    updateInspectionCenter(@Param("id", ParseIntPipe) id:number, @Body() newDataCenter:UpdateInspectionCenterDto){
        return this.inspectionCenterService.updateInspectionCenter(id, newDataCenter);
    }

    @Put(":id/inactive")
    @Roles(RolesEnum.ADMIN)
    inactiveInspectionCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactiveInspectionCenter(id);
    }

    /*Controladores servicios Modulo Horarios Centro de Revisión*/

    @Get(":id/schedules/active")
    @Roles(RolesEnum.USER)
    findActiveSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findActiveSchedulesByCenterId(name);
    }

    @Get(":id/schedules/all")
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByCenterId(@Param("name") name:string){
        return this.inspectionCenterService.findAllSchedulesByCenterId(name);
    }

    @Get(":name/schedules/:day/active")
    @Roles(RolesEnum.USER)
    findActiveSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findActiveSchedulesByDay(name, day);
    }

    @Get(":name/schedules/:day/all")
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findAllSchedulesByDay(name, day);
    }

}