import { ResourceEntity } from 'src/common/resource.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Todo extends ResourceEntity {
  // https://github.com/typeorm/typeorm/blob/master/docs/entities.md#column-types-for-mysql--mariadb
  @Column()
  title: string;

  @Column()
  content: string;
}
