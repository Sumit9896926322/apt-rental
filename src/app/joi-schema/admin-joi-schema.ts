import Joi = require('@hapi/joi');
import { UserRole } from 'src/db/enum';

export const adminSignUpSchema = Joi.object({
  username: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default('admin')
    .required(),

  password: Joi.string().min(3).required(),
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(3).required(),
});
