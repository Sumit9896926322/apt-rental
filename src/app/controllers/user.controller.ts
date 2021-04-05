import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserRole } from 'src/db/enum';
import { Auth, ExtractJwt, IAuth } from '../decorators/authDetail.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesAuthenticationGuard } from '../guards/admin.authentication.guard';
import AuthenticationGuard from '../guards/authentication.guard';

import { adminSignUpSchema } from '../joi-schema/admin-joi-schema';
import {
  userLoginSchema,
  userSignUpSchema,
  userUpdateJoiSchema,
} from '../joi-schema/user-joi-schema';
import HttpResponse, { handleHTTPResponse } from '../libs/http-respones';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/current')
  @UseGuards(AuthenticationGuard)
  async getCurrentUser(@Auth() auth: IAuth) {
    return handleHTTPResponse(HttpResponse.success(auth));
  }

  @Post('signup')
  async signup(
    @Body(new JoiValidationPipe(userSignUpSchema))
    {
      username,
      email,
      password,
      role,
    }: {
      username: string;
      email: string;
      password: string;
      role: string;
    },
  ) {
    const data = await this.userService.signup(username, email, password, role);
    return handleHTTPResponse(data);
  }

  @Post('login')
  async login(
    @Body(new JoiValidationPipe(userLoginSchema))
    { email, password }: { email: string; password: string },
  ) {
    const data = await this.userService.login(email, password);
    return handleHTTPResponse(data);
  }

  @Post('')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesAuthenticationGuard)
  async signupAdmin(
    @Body(new JoiValidationPipe(adminSignUpSchema))
    {
      username,
      email,
      password,
      role,
    }: {
      username: string;
      email: string;
      password: string;
      role: string;
    },
    @Auth() auth: IAuth,
  ) {
    const data = await this.userService.signupByAdmin(
      username,
      email,
      password,
      role,
      auth,
    );
    return handleHTTPResponse(data);
  }

  @Post('/logout')
  @UseGuards(AuthenticationGuard)
  async logout(@ExtractJwt() jwtToken: string) {
    const data = await this.userService.logout(jwtToken);
    return handleHTTPResponse(data);
  }

  @Get('')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesAuthenticationGuard)
  async getUsers(@Auth() auth: IAuth, @Query('page') page = 1) {
    const data = await this.userService.getUsers(auth, page);
    return handleHTTPResponse(data);
  }

  @Get('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesAuthenticationGuard)
  async getUser(@Param() { id }: { id: string }, @Auth() auth: IAuth) {
    const data = await this.userService.getUser(auth, id);
    return handleHTTPResponse(data);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesAuthenticationGuard)
  async deleteUser(@Param() { id }: { id: string }, @Auth() auth: IAuth) {
    const data = await this.userService.deleteUser(auth, id);
    return handleHTTPResponse(data);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesAuthenticationGuard)
  async update(
    @Body(new JoiValidationPipe(userUpdateJoiSchema))
    {
      username,
      email,
      password,
      role,
    }: {
      username: string;
      email: string;
      password: string;
      role: string;
    },
    @Param() { id }: { id: string },
    @Auth() auth: IAuth,
  ) {
    const data = await this.userService.updateUser(
      id,
      username,
      email,
      password,
      role,
      auth,
    );

    return handleHTTPResponse(data);
  }
}
