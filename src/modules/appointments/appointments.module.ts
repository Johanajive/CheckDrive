// src/appointments/appointments.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entity/appointment.entity';
import { AuthModule } from '../auth/auth.module'; // Include the Auth/Roles module

@Module({
  imports: [
    // Register the Appointment entity
    TypeOrmModule.forFeature([Appointment]),
    // Import AuthModule to use the Guards
    AuthModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}