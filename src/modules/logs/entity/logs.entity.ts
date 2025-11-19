import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id_log: string;

  @CreateDateColumn({ nullable: false })
  date: Date;

  @Column({ nullable: false })
  host: string;

  @Column({ nullable: false })
  service: string;

  @Column({ nullable: false })
  content: string;
}
