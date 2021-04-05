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
} from '@nestjs/common';
import { UserRole } from 'src/db/enum';
import { Auth, IAuth } from '../decorators/authDetail.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesAuthenticationGuard } from '../guards/admin.authentication.guard';
import AuthenticationGuard from '../guards/authentication.guard';
import {
  apartmentCreateJoiSchema,
  apartmentFilterJoiSchema,
  apartmentUpdateJoiSchema,
} from '../joi-schema/apartment-joi-schema';
import { handleHTTPResponse } from '../libs/http-respones';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { ApartmentService } from '../services/apartment.service';

@Controller('apartment')
export class ApartmentController {
  constructor(private appartmentService: ApartmentService) {}

  @Post('')
  @Roles(UserRole.ADMIN, UserRole.REALTOR)
  @UseGuards(RolesAuthenticationGuard)
  async addApartment(
    @Body(new JoiValidationPipe(apartmentCreateJoiSchema))
    body: {
      name: string;
      description: string;
      floorSize: number;
      price: number;
      rooms: number;
      latitude: number;
      longitude: number;
    },
    @Auth() auth: IAuth,
  ) {
    console.log(body);
    const data = await this.appartmentService.addApartment(body, auth);
    return handleHTTPResponse(data);
  }

  @Get('')
  @UseGuards(AuthenticationGuard)
  async getApartments(
    @Query(new JoiValidationPipe(apartmentFilterJoiSchema))
    query: {
      min_size: number;
      max_size: number;
      min_price: number;
      max_price: number;
      min_rooms: number;
      max_rooms: number;
      page: number;
    },
    @Auth() auth: IAuth,
  ) {
    console.log(query);
    const data = await this.appartmentService.getApartments(query, auth);
    return handleHTTPResponse(data);
  }

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async getApartment(@Param('id') apartmentId, @Auth() auth: IAuth) {
    const data = await this.appartmentService.getApartment(apartmentId, auth);
    return handleHTTPResponse(data);
  }

  @Put('/:id')
  @Roles(UserRole.ADMIN, UserRole.REALTOR)
  @UseGuards(RolesAuthenticationGuard)
  async updateApartment(
    @Param('id') apartmentId,
    @Body(new JoiValidationPipe(apartmentUpdateJoiSchema))
    body: {
      name: string;
      description: string;
      floorSize: number;
      price: number;
      rooms: number;
      latitude: number;
      longitude: number;
      available: boolean;
    },
    @Auth() auth: IAuth,
  ) {
    const data = await this.appartmentService.updateApartment(
      body,
      apartmentId,
      auth,
    );
    return handleHTTPResponse(data);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN, UserRole.REALTOR)
  @UseGuards(RolesAuthenticationGuard)
  async deleteApartment(@Param('id') apartmentId, @Auth() auth: IAuth) {
    const data = await this.appartmentService.deleteApartment(
      apartmentId,
      auth,
    );
    return handleHTTPResponse(data);
  }
}
