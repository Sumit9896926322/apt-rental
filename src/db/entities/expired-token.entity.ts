import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETable } from '../ETable';

@Entity({ name: ETable.ExpiredJwtToken })
export default class ExpiredTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'expired_jwt_token' }) expiredJwtToken: string;
}
