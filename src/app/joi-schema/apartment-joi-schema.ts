import Joi = require('@hapi/joi');
import { genSalt } from 'bcrypt';
import GenConst from '../constants/gen-constant';

const alphaNumericRegex = '/^[0-9+]{7}-[0-9+]{1}$/';
export const apartmentCreateJoiSchema = Joi.object({
  name: Joi.string().min(3).required(),

  description: Joi.string().min(6).required(),

  floorSize: Joi.number().min(100).max(100000).required(),

  price: Joi.number().min(100).max(10000).required(),

  rooms: Joi.number().min(1).max(50).required(),

  latitude: Joi.number().min(-90).max(90).required(),

  longitude: Joi.number().min(-180).max(180).required(),
});
export const apartmentUpdateJoiSchema = Joi.object({
  name: Joi.string().min(3),

  description: Joi.string().min(6),

  floorSize: Joi.number().min(100).max(100000),

  price: Joi.number().min(100).max(10000),

  rooms: Joi.number().min(1).max(50),

  latitude: Joi.number().min(-90).max(90),

  longitude: Joi.number().min(-180).max(180),

  available: Joi.boolean().default(true),
});

export const apartmentFilterJoiSchema = Joi.object({
  min_size: Joi.number()
    .min(GenConst.min_size)
    .max(GenConst.max_size)
    .default(GenConst.min_size),

  max_size: Joi.number()
    .min(GenConst.min_size)
    .max(GenConst.max_size)
    .default(GenConst.max_size),

  min_price: Joi.number()
    .min(GenConst.min_price)
    .max(GenConst.max_price)
    .default(GenConst.min_price),

  max_price: Joi.number()
    .min(GenConst.min_price)
    .max(GenConst.max_price)
    .default(GenConst.max_price),

  min_rooms: Joi.number()
    .min(GenConst.min_rooms)
    .max(GenConst.max_rooms)
    .default(GenConst.min_rooms),

  max_rooms: Joi.number()
    .min(GenConst.min_rooms)
    .max(GenConst.max_rooms)
    .default(GenConst.max_rooms),
  page: Joi.number().default(1),
});
