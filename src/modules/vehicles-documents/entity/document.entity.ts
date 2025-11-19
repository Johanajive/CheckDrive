import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { VehicleEntity } from './vehicle.entity';
import { DocumentTypeEntity } from './document-type.entity';

@Entity()
export class DocumentEntity {
  @PrimaryGeneratedColumn()
  id_document: number;

  @Column({ type: 'date', nullable: false })
  start_date: Date;

  @Column({ type: 'date', nullable: false })
  end_date: Date;

  @ManyToOne(() => VehicleEntity, (vehicle) => vehicle.documents, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @ManyToOne(() => DocumentTypeEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'documentTypeId' })
  document_type: DocumentTypeEntity;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}
