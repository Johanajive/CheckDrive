import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from './entity/payments.entity';
import { VehicleEntity } from '../vehicles-documents/entity/vehicle.entity';



@Module({
    imports: [TypeOrmModule.forFeature([Payments, VehicleEntity])],
    controllers: [PaymentsController],
    providers: [PaymentsService]
}) 
export class PaymentsModule {}