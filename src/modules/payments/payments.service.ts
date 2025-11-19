import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entites/payments.entity';
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';

@Injectable()
export class PaymentsService {

    constructor(
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
    ) { }


    findAll(){
        return this.paymentsRepository.find();
    }

    async findOne(id:number){
        return this.paymentsRepository.findOne({ where:{ id_payment: id}})
    }

    async createPay(newPayment: CreatePaymentDto ){
        const paymentCreate = this.paymentsRepository.create(newPayment);
        return this.paymentsRepository.save(paymentCreate);
    }

    async updatePay(id:number, paymentUpdate:UpdateProductDTO){
        await this.paymentsRepository.update(id, paymentUpdate);
        return this.paymentsRepository.findOne({ where:{ id_payment: id}})
    }


}
