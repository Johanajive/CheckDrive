import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payments } from './entity/payments.entity';
import { VehicleEntity } from '../vehicles-documents/entity/vehicle.entity'
import { CreatePaymentDto } from './dto/create-payments.dto';
import { UpdateProductDTO } from './dto/update-payments.dto';
import { ServiceTypeEnum } from '../../common/enum/service.type.enum';

@Injectable()
export class PaymentsService {

    constructor(
        @InjectRepository(Payments)
        private paymentsRepository: Repository<Payments>,

        @InjectRepository(VehicleEntity)
        private vehicleRepository: Repository<VehicleEntity>,
    ) { }

    // --------------------------------------------
    // Obtener todos los pagos
    // --------------------------------------------
    findAll() {
        return this.paymentsRepository.find();
    }

    // --------------------------------------------
    // Obtener un pago por ID
    // --------------------------------------------
    async findOne(id: number) {
        return this.paymentsRepository.findOne({ where: { id_payment: id } })
    }

    // --------------------------------------------
    // Calcular automáticamente el costo del SOAT
    // (Académico – puedes ajustarlo con tarifas reales)
    // --------------------------------------------
    private calcularSoatPorVehiculo(vehiculo: VehicleEntity): number {
        if (vehiculo.type === 'Moto') {
            if (vehiculo.engine_displacement < 100) { 
                return 243700; };
            if (vehiculo.engine_displacement <= 200) { 
                return 326600; };

            return 758600; // motos >200cc
        }

        if (vehiculo.type === 'Carro') {
            if (vehiculo.engine_displacement < 1500) {
                return 590400;
            }
            if (vehiculo.engine_displacement >= 1500 && vehiculo.engine_displacement <= 2500) {
                return 674700; // <-- ESTE es el valor correcto para 1500–2500
            }

            return 751300; // carros > 2500cc
        }   

        return 0; // valor por defecto
    }


    async createPay(newPayment: CreatePaymentDto) {

        let amount = newPayment.amount;   // valor por defecto si NO es SOAT

        // 1. Si el tipo de pago es SOAT → Autocalcular
        if (newPayment.serviceType === ServiceTypeEnum.SOAT) {

            // Validar que el vehículo exista
            if (!newPayment.id_vehicle) {
                throw new Error('Para pagar el SOAT se requiere un id_vehicle');
            }

            const vehiculo = await this.vehicleRepository.findOne({
                where: { id_vehicle: newPayment.id_vehicle },
            });

            if (!vehiculo) {
                throw new Error('El vehículo con ese id no existe');
            }

            // Calcular el monto del SOAT  
            amount = this.calcularSoatPorVehiculo(vehiculo);
        }

        // 2. Crear el registro con el amount actualizado
        const paymentCreate = this.paymentsRepository.create({
            ...newPayment,
            amount: amount,
        });

        // 3. Guardar en la BD
        return this.paymentsRepository.save(paymentCreate);
    }

    
    async updatePay(id: number, paymentUpdate: UpdateProductDTO) {
        await this.paymentsRepository.update(id, paymentUpdate);
        return this.paymentsRepository.findOne({ where: { id_payment: id } })
    }


}
