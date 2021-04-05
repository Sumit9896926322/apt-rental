import { Injectable } from '@nestjs/common';
import ApartmentEntity from 'src/db/entities/apartment.entity';
import { UserRole } from 'src/db/enum';
import ErrorMessageConstants from '../constants/error-message.constants';
import { IAuth } from '../decorators/authDetail.decorator';
import HttpResponse from '../libs/http-respones';
import { UserService } from './user.service';
import * as Lodash from 'lodash';
import UserEntity from 'src/db/entities/user.entity';
import GenUtil from 'src/db/util/gen-util';
import { Between, In } from 'typeorm';
import GenConst from '../constants/gen-constant';
import { PermissionService } from './permission.services';

@Injectable()
export class ApartmentService {
  constructor(
    private userService: UserService,
    private permissionService: PermissionService,
  ) {}
  async addApartment(
    params: {
      name: string;
      description: string;
      floorSize: number;
      price: number;
      rooms: number;
      latitude: number;
      longitude: number;
    },
    auth: IAuth,
  ) {
    const {
      name,
      description,
      floorSize,
      price,
      rooms,
      latitude,
      longitude,
    } = params;

    if (!this.permissionService.canAddApartment(auth)) {
      return HttpResponse.unauthorized(
        ErrorMessageConstants.UnAuthorisedClient,
      );
    }

    let newApartment: ApartmentEntity = new ApartmentEntity();

    newApartment.name = name;
    newApartment.description = description;
    newApartment.floorSize = floorSize;
    newApartment.price = price;
    newApartment.rooms = rooms;
    newApartment.latitude = latitude;
    newApartment.longitude = longitude;
    newApartment.userId = auth.authUser.uuid;
    newApartment.available = true;

    await newApartment.save();
    return HttpResponse.created(newApartment);
  }

  async getApartment(apartmentId: string, auth: IAuth) {
    const apartment: ApartmentEntity = await ApartmentEntity.findOne({
      uuid: apartmentId,
    });
    if (!apartment)
      return HttpResponse.notFound(ErrorMessageConstants.ApartmentNotFound);
    return HttpResponse.success(apartment);
  }

  async getApartments(
    params: {
      min_size: number;
      max_size: number;
      min_price: number;
      max_price: number;
      min_rooms: number;
      max_rooms: number;
      page: number;
    },

    auth: IAuth,
  ) {
    let {
      min_size,
      max_size,
      min_price,
      max_price,
      min_rooms,
      max_rooms,
    } = params;

    min_size = Lodash.isUndefined(min_size) ? GenConst.min_size : min_size;
    max_size = Lodash.isUndefined(max_size) ? GenConst.max_size : max_size;
    min_price = Lodash.isUndefined(min_price) ? GenConst.min_price : min_price;
    max_price = Lodash.isUndefined(max_price) ? GenConst.max_price : max_price;
    min_rooms = Lodash.isUndefined(min_rooms) ? GenConst.min_rooms : min_rooms;
    max_rooms = Lodash.isUndefined(max_rooms) ? GenConst.max_rooms : max_rooms;
    let apartments: ApartmentEntity[];
    let filterAvailable: boolean[] = [true, false];
    if (auth.authUser.role === UserRole.CLIENT) filterAvailable.pop();

    apartments = await ApartmentEntity.find({
      where: {
        floorSize: Between(min_size, max_size),
        price: Between(min_price, max_price),
        rooms: Between(min_rooms, max_rooms),
        available: In(filterAvailable),
      },
      ...GenUtil.getOffsetAndLimit(params.page),
    });

    return HttpResponse.success(apartments);
  }

  async updateApartment(
    params: {
      name: string;
      description: string;
      floorSize: number;
      price: number;
      rooms: number;
      latitude: number;
      longitude: number;
      available: boolean;
    },
    apartmentId: string,
    auth: IAuth,
  ) {
    const {
      name,
      description,
      floorSize,
      price,
      rooms,
      latitude,
      longitude,
      available,
    } = params;

    if (!this.permissionService.canUpdateApartment(auth)) {
      return HttpResponse.forbidden(ErrorMessageConstants.UnAuthorisedClient);
    }

    const apartment: ApartmentEntity = await ApartmentEntity.findOne({
      uuid: apartmentId,
    });
    if (apartment) {
      //Either admin can update,realtor can update their apartment
      if (
        auth.authUser.role === UserRole.ADMIN ||
        apartment.userId === auth.authUser.uuid
      ) {
        apartment.name = Lodash.isUndefined(name) ? apartment.name : name;
        apartment.description = Lodash.isUndefined(description)
          ? apartment.description
          : description;
        apartment.floorSize = Lodash.isUndefined(floorSize)
          ? apartment.floorSize
          : floorSize;
        apartment.price = Lodash.isUndefined(price) ? apartment.price : price;
        apartment.rooms = Lodash.isUndefined(rooms) ? apartment.rooms : rooms;
        apartment.latitude = Lodash.isUndefined(latitude)
          ? apartment.latitude
          : latitude;
        apartment.longitude = Lodash.isUndefined(longitude)
          ? apartment.longitude
          : longitude;

        apartment.userId = auth.authUser.uuid;

        apartment.available = Lodash.isUndefined(available)
          ? apartment.available
          : available;
        await apartment.save();
        return HttpResponse.success(apartment);
      } else {
        return HttpResponse.unauthorized(
          ErrorMessageConstants.UnAuthorisedRealtor,
        );
      }
    } else {
      return HttpResponse.notFound(ErrorMessageConstants.ApartmentNotFound);
    }
  }

  async deleteApartment(apartmentId: string, auth: IAuth) {
    if (!this.permissionService.canDeleteApartment(auth)) {
      return HttpResponse.forbidden(ErrorMessageConstants.UnAuthorisedClient);
    }
    const apartment: ApartmentEntity = await ApartmentEntity.findOne({
      uuid: apartmentId,
    });
    if (apartment) {
      if (
        auth.authUser.role === UserRole.ADMIN ||
        apartment.userId === auth.authUser.uuid
      ) {
        await apartment.remove();
        return HttpResponse.success(apartment);
      } else {
        return HttpResponse.unauthorized(
          ErrorMessageConstants.UnAuthorisedRealtor,
        );
      }
    } else {
      return HttpResponse.notFound(ErrorMessageConstants.ApartmentNotFound);
    }
  }
}
