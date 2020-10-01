import { Entity, Column, BeforeInsert } from 'typeorm';
import { ResourceEntity } from 'src/common/resource.entity';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity extends ResourceEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
