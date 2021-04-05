import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ETable } from '../ETable';
import MigrationUtil from '../util/migration.util';

export class CreateApartmentTapble1594506931002 implements MigrationInterface {
  apartmentTable: Table = new Table({
    name: ETable.Apartment,
    columns: [
      ...MigrationUtil.getUUIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({ name: 'name', isNullable: false }),
      MigrationUtil.getVarCharColumn({
        name: 'description',
        isNullable: false,
        isVariableLength: true,
      }),
      MigrationUtil.getIntegerColumn({ name: 'floor_size', isNullable: false }),
      MigrationUtil.getIntegerColumn({ name: 'price', isNullable: false }),
      MigrationUtil.getIntegerColumn({ name: 'rooms', isNullable: false }),
      MigrationUtil.getRealColumn({ name: 'latitude', isNullable: false }),
      MigrationUtil.getRealColumn({ name: 'longitude', isNullable: false }),
      MigrationUtil.getUUIDColumn({ name: 'user_id', isNullable: false }),
      MigrationUtil.getBooleanColumn({
        name: 'available',
        defaultValue: true,
        isNullable: false,
      }),
    ],
  });

  floorSizeIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['floor_size'],
  });

  priceIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['price'],
  });
  roomsIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['rooms'],
  });

  latitudeIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['latitude'],
  });
  longitudeIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['longitude'],
  });

  userIdIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['user_id'],
  });
  availableIndex = MigrationUtil.createTableIndex({
    tableName: ETable.Apartment,
    columnNames: ['available'],
  });
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.apartmentTable);
    await queryRunner.createIndex(ETable.Apartment, this.floorSizeIndex);
    await queryRunner.createIndex(ETable.Apartment, this.priceIndex);
    await queryRunner.createIndex(ETable.Apartment, this.roomsIndex);
    await queryRunner.createIndex(ETable.Apartment, this.latitudeIndex);
    await queryRunner.createIndex(ETable.Apartment, this.longitudeIndex);
    await queryRunner.createIndex(ETable.Apartment, this.userIdIndex);
    await queryRunner.createIndex(ETable.Apartment, this.availableIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(ETable.Apartment, this.floorSizeIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.priceIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.roomsIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.latitudeIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.longitudeIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.userIdIndex);
    await queryRunner.dropIndex(ETable.Apartment, this.availableIndex);
    await queryRunner.dropTable(this.apartmentTable);
  }
}
