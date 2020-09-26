import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { paginate } from '../paginate';
import { Pagination } from '../pagination';
import { TestEntity } from './test.entity';
import databaseConfig from '../../../config/database.config';

describe('Paginate with queryBuilder', () => {
  let app: TestingModule;
  let connection: Connection;
  let queryBuilder: SelectQueryBuilder<TestEntity>;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [databaseConfig],
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            ...configService.get('database.main'),
            entities: [TestEntity],
          }),
          inject: [ConfigService],
        }),
      ],
    }).compile();
    connection = app.get(getConnectionToken());
    queryBuilder = connection.createQueryBuilder(TestEntity, 't');
  });

  afterAll(async () => {
    const queryRunner = connection.createQueryRunner();
    await queryRunner.dropTable(connection.getMetadata(TestEntity).tableName);

    app.close();
  });

  it('Can call paginate', async () => {
    const result = await paginate(queryBuilder, { limit: 10, page: 1 });
    expect(result).toBeInstanceOf(Pagination);
  });
});
