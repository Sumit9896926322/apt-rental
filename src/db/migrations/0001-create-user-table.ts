import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { ETable } from '../ETable';
import MigrationUtil from '../util/migration.util';

export class CreateUserTable1594506931001 implements MigrationInterface {
  userTable: Table = new Table({
    name: ETable.User,
    columns: [
      ...MigrationUtil.getUUIDAndDatesColumns(),
      MigrationUtil.getVarCharColumn({ name: 'username', isNullable: false }),
      MigrationUtil.getVarCharColumn({
        name: 'email',
        isNullable: false,
        isUnique: true,
      }),
      MigrationUtil.getVarCharColumn({ name: 'password', isNullable: false }),
      MigrationUtil.getVarCharColumn({ name: 'role', defaultValue: 'client' }),
    ],
  });

  usernameIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['username'],
  });
  roleIndex = MigrationUtil.createTableIndex({
    tableName: ETable.User,
    columnNames: ['role'],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.userTable);
    await queryRunner.createIndex(ETable.User, this.usernameIndex);
    await queryRunner.createIndex(ETable.User, this.roleIndex);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(ETable.User, this.usernameIndex.name);
    await queryRunner.dropIndex(ETable.User, this.roleIndex.name);
    await queryRunner.dropTable(this.userTable);
  }
}
