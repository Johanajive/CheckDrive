// create-payment.dto.ts
export class CreatePaymentDto {
  serviceId: string;
  serviceType: string;
  amount: number;
  paymentMethod: string;
}