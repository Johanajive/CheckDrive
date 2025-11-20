import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsInt, IsOptional } from "class-validator";
import { EstatusPaynmentEnum } from "src/common/enum/status.payment.enum";
import { PaymentMethodEnum } from "src/common/enum/payment.method.enum";
import { ServiceTypeEnum } from "src/common/enum/service.type.enum";

// create-payment.dto.ts
export class CreatePaymentDto {

  @ApiProperty({ example: 150.75, description: 'Monto del pago' })
  // @IsNotEmpty()
  @IsOptional()
  amount: number;

  @ApiProperty({ example: 'soat', description: "Tipo de servicio ('soat' o 'revision')" })
  @IsNotEmpty()
  serviceType: ServiceTypeEnum;

  @ApiProperty({ example: 'Tarjeta de crédito', description: 'Método de pago' })
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ example: 'completado', description: 'Estado del pago' })
  @IsNotEmpty()
  status: EstatusPaynmentEnum;

  @ApiProperty({ example: '2024-06-15T14:30:00Z', description: 'Fecha del pago' })
  @IsNotEmpty()
  date_payment: Date;

  @ApiProperty({ example: 1, description: 'ID de la cita asociada' })
  @IsInt()
  @IsNotEmpty()
  id_appointment: number;

  @ApiProperty({ example: 1, description: 'ID del usuario que realiza el pago' })
  @IsInt()
  @IsNotEmpty()
  id_user: number;

  @ApiProperty({ example: 1, description: 'ID del vehículo asociado al pago' })
  @IsInt()
  @IsNotEmpty()
  id_vehicle: number;

}