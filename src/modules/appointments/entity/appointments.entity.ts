import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Appointments{
    @PrimaryGeneratedColumn()
    id_appointment: number;

    @Column({ nullable: false })
    date: Date;

    @Column({ nullable: false })
    time: string;

    @Column({ nullable: false, default: true })
    @Exclude()
    status: boolean;
}