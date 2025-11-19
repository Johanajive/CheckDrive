import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesDocumentsService } from './vehicles-documents.service';
import { VehiclesDocumentsController } from './vehicles-documents.controller';
import { VehicleEntity } from './entity/vehicle.entity';
import { DocumentEntity } from './entity/document.entity';
import { DocumentTypeEntity } from './entity/document-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity, DocumentEntity, DocumentTypeEntity])],
  controllers: [VehiclesDocumentsController],
  providers: [VehiclesDocumentsService],
})
export class VehiclesDocumentsModule {}
