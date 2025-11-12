import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm'; // Importado OneToOne
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';
import { Centro } from '../../centros/entities/centro.entity';
import { Pago } from '../../pagos/entities/pago.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id_cita: number;

  @Column()
  fecha: Date;

  @Column({ length: 50 })
  servicio: string;

  // Relaciones N:1
  @ManyToOne(() => Usuario, (usuario) => usuario.citas)
  usuario: Usuario;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.citas)
  vehiculo: Vehiculo;

  @ManyToOne(() => Centro, (centro) => centro.citas)
  centro: Centro; // ¡Propiedad 'centro' añadida para resolver el error!

  // Relación 1:1 con Pago
  @OneToOne(() => Pago, (pago) => pago.cita)
  pago: Pago;
}