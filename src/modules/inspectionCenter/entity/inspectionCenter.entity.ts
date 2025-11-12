import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ScheduleInspectionCenterEntity } from "./scheduleInspectionCenter.entity";

export class InspectionCenterEntity{
    @PrimaryGeneratedColumn()
    id_center: number;

    @Column({nullable:false})
    name:string;

    @Column({nullable:false})
    city:string;

    @Column({nullable:false})
    address:string;

    @Column({nullable:false})
    phone:string;

    @Column({nullable:false , default:true})
    status:boolean;

    //Relación Uno a Muchos con la entidad ScheduleInspectionCenterEntity
    @OneToMany(()=>ScheduleInspectionCenterEntity,(schedule)=>schedule.inspectionCenter,
        {cascade:true})
        schedule:ScheduleInspectionCenterEntity[];
    }