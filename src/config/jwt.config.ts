import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  SECRET: process.env.JWT_SECRET,
  TOKEN_EXPIRE_TIME: 300, // 5 mins
  REFRESH_TOKEN_EXPIRE_TIME: 86400, // 1 day
  cache: {
    name: 'jwt-cache',
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    db: parseInt(process.env.REDIS_DB),
    password: process.env.REDIS_PASSWORD,
    keyPrefix: process.env.REDIS_PREFIX,
  },
}));
