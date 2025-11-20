import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsInt, IsOptional } from "class-validator";
import { EstatusPaynmentEnum } from "src/common/enum/status.payment.enum";
import { PaymentMethodEnum } from "src/common/enum/payment.method.enum";
import { ServiceTypeEnum } from "src/common/enum/service.type.enum";


export class UpdateProductDTO {

    @ApiProperty({ example: 150.75, description: 'Monto del pago' })
    @IsOptional()
    amount: number;

    @ApiProperty({ example: 'soat', description: "Tipo de servicio ('soat' o 'revision')" })
    @IsOptional()
    serviceType: ServiceTypeEnum;

    @ApiProperty({ example: 'Tarjeta de crédito', description: 'Método de pago' })
    @IsOptional()
    paymentMethod: PaymentMethodEnum;

    @ApiProperty({ example: 'completado', description: 'Estado del pago' })
    @IsOptional()
    status: EstatusPaynmentEnum;

    @ApiProperty({ example: '2024-06-15T14:30:00Z', description: 'Fecha del pago' })
    @IsOptional()
    date_payment: Date;

    @ApiProperty({ example: 1, description: 'ID de la cita asociada' })
    @IsInt()
    @IsOptional()
    id_appointment: number;

    @ApiProperty({ example: 1, description: 'ID del usuario que realiza el pago' })
    @IsInt()
    @IsOptional()
    id_user: number;

    @ApiProperty({ example: 1, description: 'ID del vehículo asociado al pago' })
    @IsInt()
    @IsOptional()
    id_vehicle: number;


}