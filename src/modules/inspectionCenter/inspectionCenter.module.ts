import { TypeOrmModule } from "@nestjs/typeorm";
import { InspectionCenterEntity } from "./entity/inspectionCenter.entity";
import { Module } from "@nestjs/common";
import { InspectionCenterController } from "./inspectionCenter.controller";
import { InspectionCenterService } from "./inspectionCenter.service";

@Module({
    imports:[TypeOrmModule.forFeature([InspectionCenterEntity])],
    controllers:[InspectionCenterController],
    providers:[InspectionCenterService]
})
export class InspectionCenterModule {}