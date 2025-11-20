import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards} from "@nestjs/common";
import { InspectionCenterService } from "./inspectionCenter.service";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesEnum } from "src/common/enum/roles.enum";
import { UpdateScheduleDTO } from "./dto/update-schedule.dto";
import { CreateScheduleDTO } from "./dto/create-schedule.dto";

@Controller('/api/inspectionCenter')
//Todos los endpoints requieren el uso del Token JWT generado en la autenticación del usuario
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionCenterController{
    constructor(private readonly inspectionCenterService: InspectionCenterService){}

    //Ruta para obtener todos los centros de revisión activos
    //Endpoint http://localhost:3000/inspectionCenter (GET)
    //El usuario requiere tener el rol de USER O ADMIN
    @Get()
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findAllActiveCenters(){
        return this.inspectionCenterService.findAllActiveCenters();
    }

    //Ruta para obtener todos los centros de revisión (activos e inactivos)
    //Endpoint http://localhost:3000/inspectionCenter/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("/all")
    findAllCenters(){
        return this.inspectionCenterService.findAllCenters();
    }

    //Ruta para obtener un centro de revisión por su id
    //Endpoint http://localhost:3000/inspectionCenter/3 (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get(':id')
    @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    findOneCenterById(@Param ("id", ParseIntPipe)id:number){
        return this.inspectionCenterService.findOneCenterById(id);
    }

    //Ruta para obtener un centro de revisión por su nombre
    //Endpoint http://localhost:3000/inspectionCenter/CentroAutos (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get(':name')
    @Roles(RolesEnum.USER,RolesEnum.ADMIN)
    findOneCenterByName(@Param("name") name:string){
        return this.inspectionCenterService.findOneCenterByName(name);
    }

    //Ruta para obtener todos los centros de revisión en una ciudad específica
    //Endpoint http://localhost:3000/inspectionCenter/Bogota (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get(':city')
    @Roles(RolesEnum.USER,RolesEnum.ADMIN)
    findCentersByCity(@Param("city") city:string){
        return this.inspectionCenterService.findCentersByCity(city);
    }

    //Ruta para crear un nuevo centro de revisión
    //Endpoint: http://localhost:3000/inspectionCenter (POST)
    //El usuario requiere tener el rol de ADMIN
    @Post()
    createInspectionCenter(@Body() dataCenter:CreateInspectionCenterDto){
        return this.inspectionCenterService.createInspectionCenter(dataCenter);
    }

    //Ruta para actualizar un centro de revisión
    //Endpoint: http://localhost:3000/inspectionCenter/1 (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put(":id")
    updateInspectionCenter(@Param("id", ParseIntPipe) id:number, @Body() newDataCenter:UpdateInspectionCenterDto){
        return this.inspectionCenterService.updateInspectionCenter(id, newDataCenter);
    }

    //Ruta para inactivar un centro de revisión
    //Endpoint: http://localhost:3000/inspectionCenter/2/inactive (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put(":id/inactive")
    inactiveInspectionCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactiveInspectionCenter(id);
    }

    /*Controladores servicios Modulo Horarios Centro de Revisión*/

    //Ruta para obtener los horarios activos de un centro de revisión por su nombre
    //Endpoint http://localhost:3000/inspectionCenter/schedules/1/active (GET)
    //El usuario requiere tener el rol de ADMIN o USER
    @Get("schedules/:id/active")
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findActiveSchedulesByCenterName(@Param("name") name:string){
        return this.inspectionCenterService.findActiveSchedulesByCenterName(name);
    }

    //Ruta para obtener los horarios (activos e inactivos) de un centro de revisión por su nombre
    //Endpoint http://localhost:3000/inspectionCenter/schedules/1/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("schedules/:id/all")
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByCenterName(@Param("name") name:string){
        return this.inspectionCenterService.findAllSchedulesByCenterName(name);
    }

    //Ruta para obtener los horarios activos de un centro de revisión por su nombre y día específico
    //Endpoint http://localhost:3000/inspectionCenter/schedules/CentroAutos/Martes/active (GET)
    //El usuario requiere tener el rol de ADMIN o USER
    @Get("schedules/:name/:day/active")
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findActiveSchedulesByDay(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findActiveSchedulesByDay(name, day);
    }

    //Ruta para obtener los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico
    //Endpoint http://localhost:3000/inspectionCenter/schedules/CentroAutos/Martes/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("schedules/:name/:day/all")
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByDayTwo(@Param("name") name:string, @Body() day:string){
        return this.inspectionCenterService.findAllSchedulesByDayTwo(name, day);
    }
    
    //Ruta para crear un nuevo horario en el centro de revisión seleccionado
    //Endpoint http://localhost:3000/inspectionCenter/schedules/2 (POST)
    //El usuario requiere tener el rol de ADMIN
    @Post("schedules/:id")
    @Roles(RolesEnum.ADMIN)
    createScheduleCenter(@Param("id", ParseIntPipe) idCenter:number, @Body() dataNewSchedule:CreateScheduleDTO){
        return this.inspectionCenterService.createScheduleCenter(idCenter, dataNewSchedule)
    }

    //Ruta para actualizar un horario en un centro de revisión
    //Endpoint http://localhost:3000/inspectionCenter/schedules/3 (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put("schedules/:id")
    @Roles(RolesEnum.ADMIN)
    updateScheduleCenter(@Param("id", ParseIntPipe) id:number, @Body() dataToUpdate:UpdateScheduleDTO){
        return this.inspectionCenterService.updateScheduleCenter(id, dataToUpdate);
    }

    //Ruta para inactivar un horario en un centro de revisión
    //Endpoint http://localhost:3000/inspectionCenter/schedules/4/inactive (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put("schedules/:id/inactive")
    @Roles(RolesEnum.ADMIN)
    inactivatedScheduleCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactivatedScheduleCenter(id)
    }
}