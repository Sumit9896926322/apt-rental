import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETable } from '../ETable';

@Entity({ name: ETable.Apartment })
export default class ApartmentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column() name: string;

  @Column() description: string;

  @Column({ name: 'floor_size' })
  floorSize: number;

  @Column() price: number;

  @Column() rooms: number;

  @Column() latitude: number;

  @Column() longitude: number;

  @Column({ name: 'user_id' }) userId: string;

  @Column() available: boolean;
}
// name, ( string min 3 length)
// Description ( string, min 6 length)
// floor_size, between ( 100, 100000)
// price between ( 100, 10000)
// rooms between (1, 50)
// latitude between (-90, 90)
// longitude, between (-180 to 180)
// user_id .( ID of the user creating it)
// available, (true or false, default to true)
