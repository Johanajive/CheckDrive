import { Controller, Get, Post, Body } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import { Logs } from './entity/logs.entity'; 

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  /**
   * GET /logs
   * getAllLogs: Obtiene todos los registros de logs del sistema.
   * @returns { Logs[] } Lista completa de logs.
   */
  @Get()
  async getAllLogs(): Promise<Logs[]> {
    return this.logsService.findAll();
  }

  /**
   * POST /logs
   * createLog: Crea un nuevo log manualmente.
   * @param createLogDto { CreateLogDto } - Datos del nuevo log.
   * @returns { Logs } Log creado.
   */
  @Post()
  async createLog(@Body() createLogDto: CreateLogDto): Promise<Logs> {
    return this.logsService.create(createLogDto);
  }
}
