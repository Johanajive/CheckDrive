import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { Module } from "@nestjs/common";
import { InspectionCenterController } from "./inspectionCenter.controller";
import { InspectionCenterService } from "./inspectionCenter.service";
import { ScheduleInspectionCenterEntity } from "./entity/scheduleInspectionCenter.entity";

@Module({
    imports:[TypeOrmModule.forFeature([
        InspectionCenterEntity,
        ScheduleInspectionCenterEntity
    ])],
    controllers:[InspectionCenterController],
    providers:[InspectionCenterService]
})
export class InspectionCenterModule {}