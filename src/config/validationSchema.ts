import * as Joi from 'joi';

export default Joi.object({
  PORT: Joi.number().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  AWS_REGION: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_SES_SOURCE: Joi.string().required(),
  AWS_S3_BUCKET: Joi.string().required(),
  AWS_CLOUDFRONT_URL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),

  STRAPI_BASE_URL: Joi.string().required(),
  STRAPI_TOKEN: Joi.string().required(),

  AGORA_APP_ID: Joi.string().required(),
  AGORA_APP_CERTIFICATE: Joi.string().required(),
  AGORA_EXPIRE_TIME: Joi.string().required(),
});
