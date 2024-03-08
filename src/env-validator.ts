import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PGHOST: Joi.string().required(),
  PGPORT: Joi.number().port().required(),
  PGUSER: Joi.string().required(),
  PGPASSWORD: Joi.string().required(),
  PGDATABASE: Joi.string().required(),
  SWAGGER_USER: Joi.string().required(),
  SWAGGER_PASS: Joi.string().required(),
});
