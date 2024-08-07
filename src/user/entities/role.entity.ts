import { BaseEntity } from 'src/common/database/base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '角色名',
  })
  name: string;

  @JoinTable({
    name: 'role_permissions',
  })
  @ManyToMany(() => Permission)
  permissions: Permission[];
}
