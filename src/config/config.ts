import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT) || 5000,
  aws: {
    region: process.env.AWS_REGION,
    ses: {
      source: process.env.AWS_SES_SOURCE,
      accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    },
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  strapi: {
    baseUrl: process.env.STRAPI_BASE_URL,
    token: process.env.STRAPI_TOKEN,
  },
  agora: {
    appId: process.env.AGORA_APP_ID,
    appCertificate: process.env.AGORA_APP_CERTIFICATE,
    expireTime: parseInt(process.env.AGORA_EXPIRE_TIME),
  },
  env: {
    nodeEnv: process.env.NODE_ENV,
  },
}));
