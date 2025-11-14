import { Module } from '@nestjs/common';
import { VehiclesDocumentsService } from './vehicles-documents.service';
import { VehiclesDocumentsController } from './vehicles-documents.controller';

@Module({
  controllers: [VehiclesDocumentsController],
  providers: [VehiclesDocumentsService],
})
export class VehiclesDocumentsModule {}
