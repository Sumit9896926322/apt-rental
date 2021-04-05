import { Module } from '@nestjs/common';
import { ApartmentController } from '../controllers/apartment.controller';
import ControllerServicesModule from './controller-service.module';

@Module({
  controllers: [ApartmentController],
  imports: [ControllerServicesModule],
})
export class ApartmentModule {}
