import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';

// Agrupa este controlador en la sección "Logs" dentro de Swagger.
@ApiTags('Logs')

// Define la ruta base del controlador: /logs
@Controller('logs')
export class LogsController {
  
  // Inyección del servicio responsable de la lógica de logs.
  constructor(private readonly logsService: LogsService) {}

  /**
   * GET /logs
   * Obtiene todos los registros almacenados en el sistema.
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los logs' })
  getAllLogs() {
    // Llama al servicio para recuperar todos los logs.
    return this.logsService.findAll();
  }

  /**
   * POST /logs
   * Crea un nuevo registro de log manualmente.
   */
  @Post()
  @ApiOperation({ summary: 'Crear un log' })
  @ApiBody({ type: CreateLogDto }) // Documenta en Swagger el payload que se debe enviar.
  createLog(@Body() createLogDto: CreateLogDto) {
    // Envía los datos recibidos al servicio para almacenarlos.
    return this.logsService.create(createLogDto);
  }
}
