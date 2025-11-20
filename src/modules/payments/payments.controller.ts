import { Controller, Param,Get, ParseIntPipe, Post, Body, Put } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('/api/payments')
export class PaymentsController {

    constructor( private readonly paymentsService:PaymentsService ){ }

     /**
     * Obtiene la lista de todos los pagos realizados.
     * GET /productos
     */
    @Get()
    @ApiOperation({ summary: 'Obtiene todos los pagos' })
    @ApiResponse({ status: 200, description: 'Lista de pagos obtenida correctamente.' })
    findAll(){
        return this.paymentsService.findAll();
    }


    /**
     * Obtiene un pago específico por su ID.
     * GET /payments/:id
     * param id - ID del pago a consultar
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtiene un pago por su ID' })
    @ApiResponse({ status: 200, description: 'Pago encontrado correctamente.' })
    @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
    oneProduct(@Param('id', ParseIntPipe) id:number){
        return this.paymentsService.findOne(id);
    }


    /**
     * Crea un nuevo pago.
     * POST /payments
     * Protegido con autenticación JWT.
     * body - Datos del nuevo pago (CreatePaymentDto)
     */
    @Post()
    @ApiOperation({ summary: 'Crea un nuevo pago' })
    @ApiResponse({ status: 201, description: 'Pago creado correctamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    createPay(@Body() body:CreatePaymentDto){
        return this.paymentsService.createPay(body);
    }

    /**
     * Actualiza un pago ecxistente.
     * PUT /payments
     * Protegido con autenticación JWT.
     * body - Datos del pago que deseé actualizar (UpdateProductDTO)
     */
    @Put(':id')
    @ApiOperation({ summary: 'Actualiza un pago existente' })
    @ApiResponse({ status: 200, description: 'Pago actualizado correctamente.' })
    @ApiResponse({ status: 404, description: 'Pago no encontrado.' })
    updatePay(@Param('id', ParseIntPipe) id:number, @Body() body:UpdateProductDTO){
        return this.paymentsService.updatePay(id, body);
    }
    
    
}
