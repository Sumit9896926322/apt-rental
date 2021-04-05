import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import ControllerServicesModule from 'src/app/modules/controller-service.module';

@Module({
  controllers: [UserController],
  imports: [ControllerServicesModule],
})
export class UserModule {}
