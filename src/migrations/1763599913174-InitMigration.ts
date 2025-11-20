import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1763599913174 implements MigrationInterface {
    name = 'InitMigration1763599913174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`document_type_entity\` (\`id_document_type\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c05fc45195aa60877d779b7aff\` (\`name\`), PRIMARY KEY (\`id_document_type\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`document_entity\` (\`id_document\` int NOT NULL AUTO_INCREMENT, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`vehicleId\` int NOT NULL, \`documentTypeId\` int NOT NULL, PRIMARY KEY (\`id_document\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`schedule_inspection_center_entity\` (\`id_schedule\` int NOT NULL AUTO_INCREMENT, \`day\` varchar(255) NOT NULL, \`opening_time\` varchar(255) NOT NULL, \`closing_time\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`inspectionCenterIdCenter\` int NULL, PRIMARY KEY (\`id_schedule\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inspection_center_entity\` (\`id_center\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`city\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id_center\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id_user\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`identificationDocument\` int NOT NULL, \`phone\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'user', \`status\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id_appointment\` int NOT NULL AUTO_INCREMENT, \`date\` date NOT NULL, \`time\` time NOT NULL, \`status\` varchar(20) NOT NULL DEFAULT 'Active', \`id_user\` int NOT NULL, \`id_vehicle\` int NOT NULL, \`id_center\` int NOT NULL, PRIMARY KEY (\`id_appointment\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicle_entity\` (\`id_vehicle\` int NOT NULL AUTO_INCREMENT, \`plate\` varchar(255) NOT NULL, \`brand\` varchar(255) NOT NULL, \`model\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`engine_displacement\` int NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_216463fefa9d8a9c99a513c547\` (\`plate\`), PRIMARY KEY (\`id_vehicle\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`logs\` (\`id_log\` int NOT NULL AUTO_INCREMENT, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`host\` varchar(255) NOT NULL, \`service\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id_log\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id_payment\` int NOT NULL AUTO_INCREMENT, \`serviceType\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` varchar(255) NOT NULL DEFAULT 'Pendiente', \`paymentMethod\` varchar(255) NOT NULL, \`date_payment\` datetime NOT NULL, \`id_appointment\` int NOT NULL, \`id_user\` int NOT NULL, \`id_vehicle\` int NOT NULL, PRIMARY KEY (\`id_payment\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`document_entity\` ADD CONSTRAINT \`FK_24d99447dbb2a40d125de53b809\` FOREIGN KEY (\`vehicleId\`) REFERENCES \`vehicle_entity\`(\`id_vehicle\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`document_entity\` ADD CONSTRAINT \`FK_7dad4d6a6de74acdf804ca2d513\` FOREIGN KEY (\`documentTypeId\`) REFERENCES \`document_type_entity\`(\`id_document_type\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`schedule_inspection_center_entity\` ADD CONSTRAINT \`FK_10edfc7fc5f72659e7055619a04\` FOREIGN KEY (\`inspectionCenterIdCenter\`) REFERENCES \`inspection_center_entity\`(\`id_center\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_ca0d910f623f06c41bdc8c4579e\` FOREIGN KEY (\`id_user\`) REFERENCES \`users\`(\`id_user\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_1d96cb0b504eea3f266e07a7111\` FOREIGN KEY (\`id_vehicle\`) REFERENCES \`vehicle_entity\`(\`id_vehicle\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_f58ed74b7a5be937a2869e6e554\` FOREIGN KEY (\`id_center\`) REFERENCES \`inspection_center_entity\`(\`id_center\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_5dae24a0ddddc989dce03002f6b\` FOREIGN KEY (\`id_appointment\`) REFERENCES \`appointments\`(\`id_appointment\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_8e03b515f0ef996ce3df2f2ae24\` FOREIGN KEY (\`id_user\`) REFERENCES \`users\`(\`id_user\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_4a22eb4b255d600e735e973973c\` FOREIGN KEY (\`id_vehicle\`) REFERENCES \`vehicle_entity\`(\`id_vehicle\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_4a22eb4b255d600e735e973973c\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_8e03b515f0ef996ce3df2f2ae24\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_5dae24a0ddddc989dce03002f6b\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_f58ed74b7a5be937a2869e6e554\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_1d96cb0b504eea3f266e07a7111\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_ca0d910f623f06c41bdc8c4579e\``);
        await queryRunner.query(`ALTER TABLE \`schedule_inspection_center_entity\` DROP FOREIGN KEY \`FK_10edfc7fc5f72659e7055619a04\``);
        await queryRunner.query(`ALTER TABLE \`document_entity\` DROP FOREIGN KEY \`FK_7dad4d6a6de74acdf804ca2d513\``);
        await queryRunner.query(`ALTER TABLE \`document_entity\` DROP FOREIGN KEY \`FK_24d99447dbb2a40d125de53b809\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_216463fefa9d8a9c99a513c547\` ON \`vehicle_entity\``);
        await queryRunner.query(`DROP TABLE \`vehicle_entity\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`inspection_center_entity\``);
        await queryRunner.query(`DROP TABLE \`schedule_inspection_center_entity\``);
        await queryRunner.query(`DROP TABLE \`document_entity\``);
        await queryRunner.query(`DROP INDEX \`IDX_c05fc45195aa60877d779b7aff\` ON \`document_type_entity\``);
        await queryRunner.query(`DROP TABLE \`document_type_entity\``);
    }

}
