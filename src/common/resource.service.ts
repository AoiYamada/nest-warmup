// Ref: https://blog.singular.uk/java-good-practices-and-recommendations-design-patterns-eade30be7965

import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'src/utils/limit-offset-paginate';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';

export abstract class ResourceService<
  ResourceEntity,
  CreateEntityDTO,
  UpdateEntityDTO
> {
  constructor(private readonly repository: Repository<ResourceEntity>) {}

  async create(payload: CreateEntityDTO): Promise<ResourceEntity> {
    const resource = this.repository.create(payload);
    return this.repository.save(resource);
  }

  async get(id: number): Promise<ResourceEntity | undefined> {
    return this.repository.findOne(id);
  }

  async list(
    paginateOptions: IPaginationOptions,
    searchOptions:
      | FindConditions<ResourceEntity>
      | FindManyOptions<ResourceEntity>,
  ): Promise<Pagination<ResourceEntity>> {
    return paginate<ResourceEntity>(
      this.repository,
      paginateOptions,
      searchOptions,
    );
  }

  async update(
    id: number,
    payload: UpdateEntityDTO,
  ): Promise<ResourceEntity | undefined> {
    await this.repository.update(id, payload);
    return this.repository.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.repository.restore(id);
  }
}
