import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { ScheduleInspectionCenterEntity } from "./entity/scheduleInspectionCenter.entity"; 
import { InspectionCenterService } from "./inspectionCenter.service";
import { LogsModule } from "../logs/logs.module";
import { InspectionCenterController } from "./inspectionCenter.controller";

@Module({
    imports:[TypeOrmModule.forFeature([
        InspectionCenterEntity,
        ScheduleInspectionCenterEntity
    ]),LogsModule],
    controllers:[InspectionCenterController],
    providers:[InspectionCenterService]
})
export class InspectionCenterModule {}
