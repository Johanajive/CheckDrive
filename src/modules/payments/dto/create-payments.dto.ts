import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty } from "class-validator";

// create-payment.dto.ts
export class CreatePaymentDto {

  @ApiProperty({ example: 150.75, description: 'Monto del pago' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'soat', description: "Tipo de servicio ('soat' o 'revision')" })
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({ example: 'Tarjeta de crédito', description: 'Método de pago' })
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({ example: 'completado', description: 'Estado del pago' })
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: '2024-06-15T14:30:00Z', description: 'Fecha del pago' })
  @IsNotEmpty()
  @IsDate()
  date_payment: Date;

}