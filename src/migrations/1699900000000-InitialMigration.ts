import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class InitialMigration1699900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id_user',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'lastName', type: 'varchar', length: '255', isNullable: false },
          { name: 'email', type: 'varchar', length: '255', isNullable: false, isUnique: true },
          { name: 'identificationDocument', type: 'bigint', isNullable: false },
          { name: 'phone', type: 'varchar', length: '255', isNullable: false },
          { name: 'password', type: 'varchar', length: '255', isNullable: false },
          { name: 'role', type: 'enum', enum: ['admin', 'user'], default: "'user'" },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // Create Appointments table
    await queryRunner.createTable(
      new Table({
        name: 'appointments',
        columns: [
          {
            name: 'id_appointment',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'date', type: 'date', isNullable: false },
          { name: 'time', type: 'varchar', length: '255', isNullable: false },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
        ],
      }),
      true,
    );

    // Create InspectionCenter table
    await queryRunner.createTable(
      new Table({
        name: 'inspection_center_entity',
        columns: [
          {
            name: 'id_center',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'city', type: 'varchar', length: '255', isNullable: false },
          { name: 'address', type: 'varchar', length: '255', isNullable: false },
          { name: 'phone', type: 'varchar', length: '255', isNullable: false },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
        ],
      }),
      true,
    );

    // Create ScheduleInspectionCenter table
    await queryRunner.createTable(
      new Table({
        name: 'schedule_inspection_center_entity',
        columns: [
          {
            name: 'id_schedule',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'day', type: 'varchar', length: '255', isNullable: false },
          { name: 'opening_time', type: 'varchar', length: '255', isNullable: false },
          { name: 'closing_time', type: 'varchar', length: '255', isNullable: false },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
          { name: 'inspectionCenterId', type: 'int', isNullable: false },
        ],
      }),
      true,
    );

    // Add FK for ScheduleInspectionCenter -> InspectionCenter
    await queryRunner.createForeignKey(
      'schedule_inspection_center_entity',
      new TableForeignKey({
        columnNames: ['inspectionCenterId'],
        referencedTableName: 'inspection_center_entity',
        referencedColumnNames: ['id_center'],
        onDelete: 'CASCADE',
      }),
    );

    // Create VehicleEntity table
    await queryRunner.createTable(
      new Table({
        name: 'vehicle_entity',
        columns: [
          {
            name: 'id_vehicle',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'plate', type: 'varchar', length: '255', isNullable: false, isUnique: true },
          { name: 'brand', type: 'varchar', length: '255', isNullable: false },
          { name: 'model', type: 'varchar', length: '255', isNullable: false },
          { name: 'type', type: 'varchar', length: '255', isNullable: false },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // Create index on plate for faster queries
    await queryRunner.createIndex(
      'vehicle_entity',
      new TableIndex({
        columnNames: ['plate'],
        isUnique: true,
      }),
    );

    // Create DocumentTypeEntity table
    await queryRunner.createTable(
      new Table({
        name: 'document_type_entity',
        columns: [
          {
            name: 'id_document_type',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false, isUnique: true },
          { name: 'status', type: 'boolean', default: true, isNullable: false },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    // Create DocumentEntity table
    await queryRunner.createTable(
      new Table({
        name: 'document_entity',
        columns: [
          {
            name: 'id_document',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'start_date', type: 'date', isNullable: false },
          { name: 'end_date', type: 'date', isNullable: false },
          { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'datetime', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
          { name: 'vehicleId', type: 'int', isNullable: false },
          { name: 'documentTypeId', type: 'int', isNullable: false },
        ],
      }),
      true,
    );

    // Add FK for Document -> Vehicle
    await queryRunner.createForeignKey(
      'document_entity',
      new TableForeignKey({
        columnNames: ['vehicleId'],
        referencedTableName: 'vehicle_entity',
        referencedColumnNames: ['id_vehicle'],
        onDelete: 'CASCADE',
      }),
    );

    // Add FK for Document -> DocumentType
    await queryRunner.createForeignKey(
      'document_entity',
      new TableForeignKey({
        columnNames: ['documentTypeId'],
        referencedTableName: 'document_type_entity',
        referencedColumnNames: ['id_document_type'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs
    const documentTable = await queryRunner.getTable('document_entity');
    if (documentTable) {
      const documentFks = documentTable.foreignKeys;
      for (const fk of documentFks) {
        await queryRunner.dropForeignKey('document_entity', fk);
      }
    }

    const scheduleTable = await queryRunner.getTable('schedule_inspection_center_entity');
    if (scheduleTable) {
      const scheduleFks = scheduleTable.foreignKeys;
      for (const fk of scheduleFks) {
        await queryRunner.dropForeignKey('schedule_inspection_center_entity', fk);
      }
    }

    // Drop tables
    await queryRunner.dropTable('document_entity', true);
    await queryRunner.dropTable('document_type_entity', true);
    await queryRunner.dropTable('vehicle_entity', true);
    await queryRunner.dropTable('schedule_inspection_center_entity', true);
    await queryRunner.dropTable('inspection_center_entity', true);
    await queryRunner.dropTable('appointments', true);
    await queryRunner.dropTable('users', true);
  }
}
