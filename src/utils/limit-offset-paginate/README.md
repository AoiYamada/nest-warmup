Copy of this repo:
https://github.com/nestjsx/nestjs-typeorm-paginate

because the maintainers seems not active for over 2 months

## Usage

##### Service

###### Repository

```ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CatEntity } from './entities';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly repository: Repository<CatEntity>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<CatEntity>> {
    return paginate<CatEntity>(this.repository, options);
  }
}
```

###### QueryBuilder

```ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CatEntity } from './entities';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly repository: Repository<CatEntity>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<CatEntity>> {
    const queryBuilder = this.repository.createQueryBuilder('c');
    queryBuilder.orderBy('c.name', 'DESC'); // Or whatever you need to do

    return paginate<CatEntity>(queryBuilder, options);
  }
}
```

##### Controller

```ts
import { Controller, Get, Query } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatEntity } from './cat.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('cats')
export class CatsController {
  constructor(private readonly catService: CatService) {}
  @Get('')
  async index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<CatEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.catService.paginate({
      page,
      limit,
      route: 'http://cats.com/cats',
    });
  }
}
```

### Example Response

```json
{
  "items": [
    {
      "lives": 9,
      "type": "tabby",
      "name": "Bobby"
    },
    {
      "lives": 2,
      "type": "Ginger",
      "name": "Garfield"
    },
    {
      "lives": 6,
      "type": "Black",
      "name": "Witch's mate"
    },
    {
      "lives": 7,
      "type": "Purssian Grey",
      "name": "Alisdaya"
    },
    {
      "lives": 1,
      "type": "Alistair",
      "name": "ali"
    },
    ...
  ],
  "meta": {
    "itemCount": 10,
    "totalItems": 20,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 2
  },
  "links" : {
    "first": "http://cats.com/cats?limit=10",
    "previous": "http://cats.com/cats?page=1&limit=10",
    "next": "http://cats.com/cats?page=3&limit=10",
    "last": "http://cats.com/cats?page=5&limit=10"
  }
}
```

`items`: An array of SomeEntity

`meta.itemCount`: The length of items array (i.e., the amount of items on this page)
`meta.totalItems`: The total amount of SomeEntity matching the filter conditions
`meta.itemsPerPage`: The requested items per page (i.e., the `limit` parameter)

`meta.totalPages`: The total amount of pages (based on the `limit`)
`meta.currentPage`: The current page this paginator "points" to

`links.first`: A URL for the first page to call | `""` (blank) if no `route` is defined
`links.previous`: A URL for the previous page to call | `""` (blank) if no previous to call
`links.next`: A URL for the next page to call | `""` (blank) if no page to call
`links.last`: A URL for the last page to call | `""` (blank) if no `route` is defined

## Find Parameters

```ts
@Injectable()
export class CatService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly repository: Repository<CatEntity>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<CatEntity>> {
    return paginate<CatEntity>(this.repository, options, {
      lives: 9,
    });
  }
}
```

## Eager loading

Eager loading should work with typeorm's eager property out the box. Like so

```typescript
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class CatEntity {
  @OneToMany((t) => TigerKingEntity, tigerKing.cats, {
    eager: true,
  })
  tigerKings: TigerKingEntity[];
}

// service
class CatService {
  constructor(private readonly repository: Repository<CatEntity>) {}

  async paginate(page: number, limit: number): Promise<Pagination<CatEntity>> {
    return paginate(this.repository, { page, limit });
  }
}
```

#### QueryBuilder

However, when using the query builder you'll have to hydrate the entities yourself. Here is a crude example that I've used in the past. It's not great but this is partially what typeORM will do.

```typescript
const results = paginate(queryBuilder, { page, limit });

return new Pagination(
  await Promise.all(
    results.items.map(async (item: SomeEntity) => {
      const hydrate = await this.someRepository.findByEntity(item);
      item.hydrated = hydrate;

      return item;
    }),
  ),
  results.meta,
  results.links,
);
```
