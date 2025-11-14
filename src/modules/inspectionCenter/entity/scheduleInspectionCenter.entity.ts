import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { InspectionCenterEntity } from "./inspectionCenter.entity";

@Entity()
export class ScheduleInspectionCenterEntity{
    @PrimaryGeneratedColumn()
    id_schedule: number;

    @Column({nullable:false})
    day:string;

    @Column({nullable:false})
    opening_time:string;

    @Column({nullable:false})
    closing_time:string;

    @Column({nullable:false, default:true})
    status:boolean;

    //Relación Muchos a Uno con la entidad InspectionCenterEntity
    @ManyToOne(()=> InspectionCenterEntity, (inspectionCenter)=>inspectionCenter.schedule,{
        onDelete:'CASCADE'
    })
    inspectionCenter:InspectionCenterEntity;
}