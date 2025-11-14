import { Controller, Param,Get, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';

@Controller('payments')
export class PaymentsController {

    constructor( private readonly paymentsService:PaymentsService ){ }

     /**
     * Obtiene la lista de todos los pagos realizados.
     * GET /productos
     */
    @Get()
    findAll(){
        return this.paymentsService.findAll();
    }


    /**
     * Obtiene un pago específico por su ID.
     * GET /payments/:id
     * param id - ID del pago a consultar
     */
    @Get(':id')
    oneProduct(@Param('id', ParseIntPipe) id:number){
        return this.paymentsService.findOne(id);
    }


    /**
     * Crea un nuevo pago.
     * POST /payments
     * Protegido con autenticación JWT.
     * body - Datos del nuevo producto (CreateProductDTO)
     */
    @Post(':id')
    createPay(@Body() body:CreatePaymentDto){
        return this.paymentsService.createPay(body);
    }
    
    @Put(':id')
    updatePay(@Param('id', ParseIntPipe) id:number, @Body() body:UpdateProductDTO){
        return this.paymentsService.updatePay(id, body);
    }
    
    
}
