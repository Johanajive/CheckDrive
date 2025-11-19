import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from './entity/logs.entity'; 
import { CreateLogDto } from './dto/create-log.dto';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Logs)
    private readonly logRepository: Repository<Logs>,
  ) {}

  /**
   * create: Crea un nuevo registro de log en la base de datos.
   * @param createLogDto { CreateLogDto } - Datos del log a registrar.
   * @returns { Logs } Log creado.
   */
  async create(createLogDto: CreateLogDto): Promise<Logs> {
    const newLog = this.logRepository.create(createLogDto);
    return await this.logRepository.save(newLog);
  }

  /**
   * findAll: Obtiene todos los registros de logs.
   * Ordenados por fecha descendente.
   * @returns { Logs[] } Lista de logs registrados.
   */
  async findAll(): Promise<Logs[]> {
    return await this.logRepository.find({
      order: { date: 'DESC' },
    });
  }
}
