import * as Joi from 'joi';

const DEFAULT_PORT = 3000;
import path from 'path';

export default Joi.object({
  APP_NAME: Joi.string().default('No name'),
  PROJECT_LOCATION: Joi.string().required(),
  PORT: Joi.number().default(DEFAULT_PORT),
  JWT_SECRET: Joi.string().min(32).required(),

  REDIS_ENABLED: Joi.boolean().default(true),
  REDIS_HOST: Joi.string().default('127.0.0.1'),
  REDIS_PORT: Joi.number().integer().default(6379),
  REDIS_USER: Joi.string().default('default'),
  REDIS_PASSWORD: Joi.string().default(''),

  RABBITMQ_HOST: Joi.string().default('127.0.0.1'),
  RABBITMQ_USER: Joi.string().default(''),
  RABBITMQ_PASSWORD: Joi.string().default(''),
  RABBITMQ_ENABLED: Joi.boolean().default(true),

  SHARD_ENCRYPTION_KEY: Joi.string().base64().length(44).required(),

  DB_HOST: Joi.string().default('127.0.0.1'),
  DB_DATABASE: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_SSL_REJECT_UNAUTHORIZED: Joi.boolean().default(true),
  DB_SSL_CA: Joi.string().optional(),
  SOCKETIO_ENDPOINT_ON: Joi.boolean().default(false),

  API_BASE_URL: Joi.string().default('/api'),
  DOCS_URL: Joi.string().default('/docs'),
  SOCKETIO_ENDPOINT: Joi.string().default('/ws'),
  PUBLIC_HOST_WITH_PORT: Joi.string().default(
    `http://localhost:${DEFAULT_PORT}`,
  ),
  FRONTEND_BUILD_PATH: Joi.string().default(
    `${process.env.PROJECT_LOCATION}/public`,
  ),
  VERIFICATION_TOKEN_EXPIRY_HOURS: Joi.number().integer().default(24),
  PASSWORD_RESET_TOKEN_EXPIRY_HOURS: Joi.number().integer().default(1),
  OTP_EXPIRY_MINUTES: Joi.number().integer().default(10),
  ENABLE_NOTIFICATION_EMAILS: Joi.boolean().default(false),
  SCHEDULED_TASKS_ENABLED: Joi.boolean().default(false),

  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().integer().optional(),
  SMTP_SECURE: Joi.boolean().optional(),
  SMTP_USERNAME: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  MAIL_FROM_ADDRESS: Joi.string().email().optional(),
  MAIL_FROM_NAME: Joi.string().optional(),

  COOKIE_DOMAIN: Joi.string().default('localhost'),
  COOKIE_SECURE: Joi.boolean().default(false),
  BCRYPT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
  CORS_ORIGIN: Joi.string().default(`http://localhost:${DEFAULT_PORT}`),
  LOG_LEVEL: Joi.number().default(2),
  TTS_API: Joi.string().required(),
  BASH_ON_WINDOWS: Joi.string().default('C:/Program Files/Git/bin/bash.exe'),
  WORKING_DIRECTORY: Joi.string().required(),

  LOCAL_STORAGE_LOCATION: Joi.string().default(
    `${path.dirname(process.env.PROJECT_LOCATION as string)}/storage`,
  ),

  PROJECT_SOURCE_CODE_DIR_NAME: Joi.string().default(`code`),

  DATABASE_USER_FOR_PROJECTS: Joi.string().default(`user99`),

  DATABASE_USER_FOR_PROJECTS_PASSWORD: Joi.string().default(`pass22`),

  ENABLE_ACCOUNT_APIS: Joi.boolean().default(false),
});
