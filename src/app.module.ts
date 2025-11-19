import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module'; 
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module'; 
import { InspectionCenterModule } from './modules/inspectionCenter/inspectionCenter.module';
import { LogsModule } from './modules/logs/logs.module'; 
import { AppointmentsModule } from './modules/appointments/appointments.module'; 
import { VehiclesDocumentsModule } from './modules/vehicles-documents/vehicles-documents.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        dropSchema: true,
      })
    }),
    UsersModule,
    AuthModule,
    InspectionCenterModule,
    LogsModule,
    AppointmentsModule,
    VehiclesDocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
