// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointments } from './entity/appointments.entity';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    // Register the Appointment entity
    TypeOrmModule.forFeature([Appointments]),
    // Import AuthModule to use the Guards
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}