import { Module } from '@nestjs/common';
import { ApartmentService } from '../services/apartment.service';
import { PermissionService } from '../services/permission.services';
import { UserService } from '../services/user.service';

@Module({
  providers: [UserService, ApartmentService, PermissionService],
  exports: [UserService, ApartmentService, PermissionService],
})
export default class ControllerServicesModule {}
