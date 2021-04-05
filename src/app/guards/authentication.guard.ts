import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as JWT from 'jsonwebtoken';
import ExpiredTokenEntity from 'src/db/entities/expired-token.entity';
import UserEntity from '../../db/entities/user.entity';
import ErrorMessageConstants from '../constants/error-message.constants';
import ConfigGlobalService from '../global-services/config-global.service';

@Injectable()
export default class AuthenticationGuard implements CanActivate {
  constructor(private readonly configService: ConfigGlobalService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = request?.headers?.jwttoken;

    const isExpiredJwtToken: ExpiredTokenEntity = await ExpiredTokenEntity.findOne(
      { expiredJwtToken: jwtToken },
    );
    if (isExpiredJwtToken) {
      throw new UnauthorizedException(ErrorMessageConstants.LogggetOutError);
    }

    const user: UserEntity = await this.validateJWTToken(jwtToken);
    if (user) {
      request.user = user;
      request.jwtToken = jwtToken;
      return true;
    }
    throw new UnauthorizedException();
  }

  public async validateJWTToken(jwtToken: string): Promise<UserEntity> {
    try {
      const { userId } = JWT.verify(
        jwtToken,
        this.configService.get('JWT_SECRET'),
      ) as IJwtPayload;
      const user = await UserEntity.findOne({ uuid: userId });
      if (!user) {
        return undefined;
      } else return user;
    } catch (e) {
      return undefined;
    }
  }
}

export interface IJwtPayload {
  userId: string;
  time: number;
}
