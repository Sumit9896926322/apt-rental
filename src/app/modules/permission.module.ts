import { Global, Module } from '@nestjs/common';
import { PermissionService } from '../services/permission.services';
import JWTUtilService from '../utilities-services/jwt.util.service';
import ControllerServicesModule from './controller-service.module';

@Global()
@Module({
  providers: [PermissionService],
  exports: [ControllerServicesModule],
})
export default class UtilitiesModule {}
