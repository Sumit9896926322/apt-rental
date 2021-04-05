import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/db/enum';
import { IAuth } from '../decorators/authDetail.decorator';

@Injectable()
export class PermissionService {
  constructor() {}

  allowAdmin(auth: IAuth) {
    if (auth.authUser.role === UserRole.ADMIN) return true;
    return false;
  }

  allowAdminAndRealtor(auth: IAuth) {
    if (
      auth.authUser.role === UserRole.ADMIN ||
      auth.authUser.role === UserRole.REALTOR
    )
      return true;
    return false;
  }
  canGetUsers(auth: IAuth) {
    return this.allowAdmin(auth);
  }

  canGetUser(auth: IAuth) {
    return this.allowAdmin(auth);
  }

  canDeleteUser(auth: IAuth) {
    return this.allowAdmin(auth);
  }

  canUpdatUser(auth: IAuth) {
    return this.allowAdmin(auth);
  }

  canAddApartment(auth: IAuth) {
    return this.allowAdminAndRealtor(auth);
  }
  canUpdateApartment(auth: IAuth) {
    return this.allowAdminAndRealtor(auth);
  }
  canDeleteApartment(auth: IAuth) {
    return this.allowAdminAndRealtor(auth);
  }

  canSignupAdmin(auth: IAuth) {
    return this.allowAdmin(auth);
  }
}
