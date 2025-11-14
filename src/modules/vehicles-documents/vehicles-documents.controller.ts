import { Controller, Get } from '@nestjs/common';

@Controller('vehicles-documents')
export class VehiclesDocumentsController {
  @Get()
  ping() {
    return { ok: true };
  }
}
