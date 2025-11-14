import { IsDate } from "class-validator";

// create-payment.dto.ts
export class CreatePaymentDto {

  amount: number;

  paymentMethod: string;

  status: string;

  @IsDate()
  date_payment: Date;

}