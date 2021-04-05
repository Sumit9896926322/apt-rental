import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enum';
import { ETable } from '../ETable';

@Entity({ name: ETable.User })
export default class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column() username: string;

  @Column() email: string;

  @Column({ default: UserRole.CLIENT })
  role: string;

  @Column() password: string;
}
