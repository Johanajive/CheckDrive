import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class DocumentTypeEntity {
  @PrimaryGeneratedColumn()
  id_document_type: number;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false, default: true })
  @Exclude()
  status: boolean;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;
}
