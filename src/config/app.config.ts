import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE ?? '20', 10),
  maxPageSize: parseInt(process.env.MAX_PAGE_SIZE ?? '100', 10),
}));
