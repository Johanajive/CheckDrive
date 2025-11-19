import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards} from "@nestjs/common";
import { InspectionCenterService } from "./inspectionCenter.service";
import { CreateInspectionCenterDto } from "./dto/create-inspectionCenter.dto";
import { UpdateInspectionCenterDto } from "./dto/update-inspectionCenter.dto";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesEnum } from "../../common/enum/roles.enum";
import { UpdateScheduleDTO } from "./dto/update-schedule.dto";
import { CreateScheduleDTO } from "./dto/create-schedule.dto";

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("")
@ApiBearerAuth()
@Controller('inspectionCenter')
//Todos los endpoints requieren el uso del Token JWT generado en la autenticación del usuario
@UseGuards(JwtAuthGuard, RolesGuard)
export class InspectionCenterController{
    constructor(private readonly inspectionCenterService: InspectionCenterService){}

    //Ruta para obtener todos los centros de revisión activos
    //Endpoint http://localhost:3000/inspectionCenter (GET)
    //El usuario requiere tener el rol de USER O ADMIN
    @Get()
    @ApiOperation({summary:"Obtener todos los centros de revisión activos"})
    @ApiResponse({status:200, description:"Lista de los centros de revisión activos"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findAllActiveCenters(){
        return this.inspectionCenterService.findAllActiveCenters();
    }

    //Ruta para obtener todos los centros de revisión (activos e inactivos)
    //Endpoint http://localhost:3000/inspectionCenter/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("/all")
    @ApiOperation({summary:"Obtener todos los centros de revisión activos e inactivos"})
    @ApiResponse({status:200, description:"Lista de los centros de revisión activos e inactivos"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @Roles(RolesEnum.ADMIN)
    findAllCenters(){
        return this.inspectionCenterService.findAllCenters();
    }

    //Ruta para obtener un centro de revisión por su id
    //Endpoint http://localhost:3000/api/inspectionCenter/3 (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get(':id')
    @ApiOperation({summary:"Obtener un centro de revisión por su id"})
    @ApiResponse({status:200, description:"Centro de revisión consultado por su id en la base de datos"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @Roles(RolesEnum.ADMIN, RolesEnum.USER)
    findOneCenterById(@Param ("id", ParseIntPipe)id:number){
        return this.inspectionCenterService.findOneCenterById(id);
    }

    //Ruta para obtener un centro de revisión por su nombre
    //Endpoint http://localhost:3000/api/inspectionCenter/byName/CentroAutos (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get('/byName/:name')
    @ApiOperation({summary:"Obtener un centro de revisión por su nombre"})
    @ApiResponse({status:200, description:"Centro de revisión consultado por su nombre en la base de datos"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @Roles(RolesEnum.USER,RolesEnum.ADMIN)
    findOneCenterByName(@Param("name") name:string){
        return this.inspectionCenterService.findOneCenterByName(name);
    }

    //Ruta para obtener todos los centros de revisión en una ciudad específica
    //Endpoint http://localhost:3000/api/inspectionCenter/byCity/Bogota (GET)
    //El usuario requiere tener el rol de USER o ADMIN
    @Get('/byCity/:city')
    @ApiOperation({summary:"Obtener todos los centros de revisión en una ciudad específica"})
    @ApiResponse({status:200, description:"Listado de centros de revisión de una misma ciudad en la base de datos"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"No se encuentran centros de revisión activos en la ciudad seleccionada"})
    @Roles(RolesEnum.USER,RolesEnum.ADMIN)
    findCentersByCity(@Param("city") city:string){
        return this.inspectionCenterService.findCentersByCity(city);
    }

    //Ruta para crear un nuevo centro de revisión
    //Endpoint: http://localhost:3000/api/inspectionCenter (POST)
    //El usuario requiere tener el rol de ADMIN
    @Post()
    @ApiOperation({summary:"Crear un nuevo centro de revisión"})
    @ApiResponse({status:200, description:"Centro de revisión creado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:400, description:"El centro de revisión ya se encuentra registrado"})
    @Roles(RolesEnum.ADMIN)
    createInspectionCenter(@Body() dataCenter:CreateInspectionCenterDto){
        return this.inspectionCenterService.createInspectionCenter(dataCenter);
    }

    //Ruta para actualizar un centro de revisión
    //Endpoint: http://localhost:3000/api/inspectionCenter/1 (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put(":id")
    @ApiOperation({summary:"Actualizar un centro de revisión"})
    @ApiResponse({status:200, description:"Centro de revisión actualizado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:409, description:"Error a la hora de actualizar el centro de revisión "})
    @Roles(RolesEnum.ADMIN)
    updateInspectionCenter(@Param("id", ParseIntPipe) id:number, @Body() newDataCenter:UpdateInspectionCenterDto){
        return this.inspectionCenterService.updateInspectionCenter(id, newDataCenter);
    }

    //Ruta para inactivar un centro de revisión
    //Endpoint: http://localhost:3000/api/inspectionCenter/2/inactive (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put(":id/inactive")
    @ApiOperation({summary:"Inactivar un centro de revisión"})
    @ApiResponse({status:200, description:"Centro de revisión inactivado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:409, description:"Error a la hora de inactivar el centro de revisión"})
    @Roles(RolesEnum.ADMIN)
    inactiveInspectionCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactiveInspectionCenter(id);
    }

    // ===============================================================
    //  CONTROLADORES / ENDPOINTS MÓDULO HORARIOS
    // ===============================================================

    //Ruta para obtener los horarios activos de un centro de revisión por su nombre
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/CENTROREV/active (GET)
    //El usuario requiere tener el rol de ADMIN o USER
    @Get("schedules/:name/active")
    @ApiOperation({summary:"Obtener los horarios activos de un centro de revisión por su nombre"})
    @ApiResponse({status:200, description:"Lista de horarios activos del centro de revisión seleccionado"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios activos registrados"})
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findActiveSchedulesByCenterName(@Param("name") name:string){
        return this.inspectionCenterService.findActiveSchedulesByCenterName(name);
    }

    //Ruta para obtener los horarios (activos e inactivos) de un centro de revisión por su nombre
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/CENTROREV/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("schedules/:name/all")
    @ApiOperation({summary:"Obtener los horarios activos e inactivos de un centro de revisión por su nombre"})
    @ApiResponse({status:200, description:"Lista de horarios activos e inactivos de un centro de revisión seleccionado"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios registrados"})
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByCenterName(@Param("name") name:string){
        return this.inspectionCenterService.findAllSchedulesByCenterName(name);
    }

    //Ruta para obtener los horarios activos de un centro de revisión por su nombre y día específico
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/CentroAutos/Martes/active (GET)
    //El usuario requiere tener el rol de ADMIN o USER
    @Get("schedules/:name/byDay/:day/active")
    @ApiOperation({summary:"Obtener los horarios activos de un centro de revisión por su nombre y día específico"})
    @ApiResponse({status:200, description:"Lista de horarios activos de un centro de revisión y día seleccionado"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios registrados"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios activos registrados para el día registrado"})
    @Roles(RolesEnum.USER, RolesEnum.ADMIN)
    findActiveSchedulesByDay(@Param("name") name:string, @Param("day") day:string){
        return this.inspectionCenterService.findActiveSchedulesByDay(name, day);
    }

    //Ruta para obtener los horarios (activos e inactivos) de un centro de revisión por su nombre y día específico
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/CentroAutos/Martes/all (GET)
    //El usuario requiere tener el rol de ADMIN
    @Get("schedules/:name/byDay/:day/all")
    @ApiOperation({summary:"Obtener los horarios activos e inactivos de un centro de revisión por su nombre y día específico"})
    @ApiResponse({status:200, description:"Lista de horarios activos e inactivos de un centro de revisión y día seleccionado"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @ApiResponse({status:400, description:"Centro de revisión no se encuentra activo"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios registrados"})
    @ApiResponse({status:404, description:"El centro de revisión no tiene horarios registrados para el día registrado"})
    @Roles(RolesEnum.ADMIN)
    findAllSchedulesByDay(@Param("name") name:string, @Param("day") day:string){
        return this.inspectionCenterService.findAllSchedulesByDay(name, day);
    }
    
    //Ruta para crear un nuevo horario en el centro de revisión seleccionado
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/2 (POST)
    //El usuario requiere tener el rol de ADMIN
    @Post("schedules/:id")
    @ApiOperation({summary:"Crear un nuevo horario en el centro de revisión seleccionado"})
    @ApiResponse({status:200, description:"Horario para un centro de revisión creado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:400, description:"El horario para el día para el centro de revisión seleccionado ya se encuentra registrado"})
    @ApiResponse({status:404, description:"Centro de revisión no encontrado"})
    @Roles(RolesEnum.ADMIN)
    createScheduleCenter(@Param("id", ParseIntPipe) idCenter:number, @Body() dataNewSchedule:CreateScheduleDTO){
        return this.inspectionCenterService.createScheduleCenter(idCenter, dataNewSchedule)
    }

    //Ruta para actualizar un horario en un centro de revisión
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/3 (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put("schedules/:id")
    @ApiOperation({summary:"Actualizar un horario en el centro de revisión seleccionado"})
    @ApiResponse({status:200, description:"Horario para un centro de revisión actualizado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"El horario del centro de revisión no fue encontrado"})
    @ApiResponse({status:409, description:"Error a la hora de actualizar el horario para el centro de revisión"})
    @Roles(RolesEnum.ADMIN)
    updateScheduleCenter(@Param("id", ParseIntPipe) id:number, @Body() dataToUpdate:UpdateScheduleDTO){
        return this.inspectionCenterService.updateScheduleCenter(id, dataToUpdate);
    }

    //Ruta para inactivar un horario en un centro de revisión
    //Endpoint http://localhost:3000/api/inspectionCenter/schedules/4/inactive (PUT)
    //El usuario requiere tener el rol de ADMIN
    @Put("schedules/:id/inactive")
    @ApiOperation({summary:"Inactivar un horario en el centro de revisión seleccionado"})
    @ApiResponse({status:200, description:"Horario para un centro de revisión inactivado exitosamente"})
    @ApiResponse({status:200, description:"Log creado exitosamente"})
    @ApiResponse({status:404, description:"El horario del centro de revisión no fue encontrado"})
    @ApiResponse({status:409, description:"Error a la hora de inactivar el horario para el centro de revisión"})
    @Roles(RolesEnum.ADMIN)
    inactivatedScheduleCenter(@Param("id", ParseIntPipe) id:number){
        return this.inspectionCenterService.inactivatedScheduleCenter(id)
    }
}