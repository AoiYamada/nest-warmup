import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  main: {
    // TODO: investigate how transaction is done in TypeORM: https://typeorm.io/#/transactions/creating-and-using-transactions
    type: process.env.DATABASE_TYPE,
    host: process.env.HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    autoLoadEntities: true,
    // entities: [`${__dirname}/**/*.entity.ts`],
    // TODO: use migration instead of synchronize: https://github.com/ambroiseRabier/typeorm-nestjs-migration-example
    synchronize: true,
  },
}));
