// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointments } from './entity/appointments.entity';
import { AuthModule } from '../auth/auth.module'; 
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([Appointments]),
  AuthModule,
  LogsModule,
],

  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}