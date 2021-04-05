import Joi = require('@hapi/joi');

export const userSignUpSchema = Joi.object({
  username: Joi.string().min(3).required(),

  email: Joi.string().email().required(),

  role: Joi.string().valid('client', 'realtor').default('client').required(),

  password: Joi.string().min(3).required(),
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(3).required(),
});

export const userUpdateJoiSchema = Joi.object({
  username: Joi.string().min(3),

  email: Joi.string().email(),

  role: Joi.string().valid('client', 'realtor', 'admin'),

  password: Joi.string().min(3),
});
