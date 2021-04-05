import { Injectable } from '@nestjs/common';
import UserEntity from 'src/db/entities/user.entity';
import JWTUtilService from '../utilities-services/jwt.util.service';
import HttpResponse from '../libs/http-respones';
import { compareBcrypt, secureBcrypt } from 'src/db/util/bcrypt.util';
import ErrorMessageConstants from '../constants/error-message.constants';
import GenUtil from 'src/db/util/gen-util';
import * as Lodash from 'lodash';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from 'src/db/enum';
import { IAuth } from '../decorators/authDetail.decorator';
import ExpiredTokenEntity from 'src/db/entities/expired-token.entity';
import SuccessMessageConstants from '../constants/success-message.constants';
import { PermissionService } from './permission.services';
@Injectable()
export class UserService {
  constructor(
    private readonly jwtUtilService: JWTUtilService,
    private readonly permissioService: PermissionService,
  ) {}

  async signup(
    username: string,
    email: string,
    password: string,
    role: string,
  ) {
    if (role === UserRole.ADMIN) {
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClient,
      );
    }
    const emailExist = await UserEntity.findOne({ email });
    if (emailExist) return HttpResponse.error(ErrorMessageConstants.EmailExits);
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await secureBcrypt(password);
    newUser.role = role;
    await newUser.save();

    const jwtToken = await this.jwtUtilService.generateJWTToken(newUser);

    return HttpResponse.created({
      newUser,
    });
  }

  async signupByAdmin(
    username: string,
    email: string,
    password: string,
    role: string,
    auth: IAuth,
  ) {
    if (!this.permissioService.canSignupAdmin(auth))
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClientOrRealtor,
      );

    const emailExist = await UserEntity.findOne({ email });
    if (emailExist) return HttpResponse.error(ErrorMessageConstants.EmailExits);
    const newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await secureBcrypt(password);
    newUser.role = role;
    await newUser.save();

    const jwtToken = await this.jwtUtilService.generateJWTToken(newUser);

    return HttpResponse.created({
      newUser,
      jwtToken,
    });
  }

  async getCurrentUser() {}

  async login(email: string, password: string) {
    const user: UserEntity = await UserEntity.findOne({ where: { email } });

    if (user) {
      const passwordMatch = await compareBcrypt(password, user.password);
      if (passwordMatch) {
        const jwtToken: string = await this.jwtUtilService.generateJWTToken(
          user,
        );
        return HttpResponse.success({ user, jwtToken });
      } else {
        return HttpResponse.notFound();
      }
    } else return HttpResponse.notFound();
  }

  async logout(jwtToken: string) {
    const expiredToken: ExpiredTokenEntity = new ExpiredTokenEntity();
    expiredToken.expiredJwtToken = jwtToken;
    await expiredToken.save();
    return HttpResponse.success(SuccessMessageConstants.UserLoggedOutSuccess);
  }
  async getUsers(auth: IAuth, page: number) {
    if (!this.permissioService.canGetUsers(auth))
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClientOrRealtor,
      );
    const users: UserEntity[] = await UserEntity.find({
      where: {},
      ...GenUtil.getOffsetAndLimit(page),
    });
    return HttpResponse.success(users);
  }

  async getUser(auth: IAuth, userId: string) {
    if (!this.permissioService.canGetUser(auth))
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClientOrRealtor,
      );
    const user: UserEntity = await UserEntity.findOne({ uuid: userId });
    if (!user) return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);
    return HttpResponse.success(user);
  }

  async deleteUser(auth: IAuth, userId: string) {
    if (!this.permissioService.canDeleteUser(auth))
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClientOrRealtor,
      );
    const user: UserEntity = await UserEntity.findOne({ uuid: userId });
    if (!user) return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);
    await user.remove();

    return HttpResponse.success(user);
  }

  async updateUser(
    userId: string,
    username: string,
    email: string,
    password: string,
    role: string,
    auth: IAuth,
  ) {
    if (!this.permissioService.canUpdatUser(auth))
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClientOrRealtor,
      );

    const user: UserEntity = await UserEntity.findOne({ uuid: userId });
    if (!user) {
      return HttpResponse.notFound(ErrorMessageConstants.UserNotFound);
    }

    if (user.email != email) {
      const emailExist = await UserEntity.findOne({ email });
      if (emailExist)
        return HttpResponse.error(ErrorMessageConstants.EmailExits);
    }

    user.username = Lodash.isUndefined(username) ? user.username : username;
    user.email = Lodash.isUndefined(email) ? user.email : email;
    user.password = Lodash.isUndefined(password)
      ? user.password
      : await secureBcrypt(password);
    user.role = Lodash.isUndefined(role) ? user.role : role;

    await user.save();
    return HttpResponse.success(user);
  }
}
