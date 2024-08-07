import { BaseEntity } from 'src/common/database/base.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @Column({
    length: 50,
    comment: '昵称',
    name: 'nick_name',
  })
  nickName: string;

  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @Column({
    length: 100,
    comment: '头像',
    name: 'head_pic',
  })
  headPic: string;

  @Column({
    length: 20,
    comment: '手机号',
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    comment: '是否冻结',
    name: 'is_frozen',
  })
  isFrozen: boolean;

  @Column({
    comment: '是否管理员',
    name: 'is_admin',
  })
  // boolean值会保存为0和1
  isAdmin: boolean;

  @JoinTable({
    name: 'user_roles',
  })
  @ManyToMany(() => Role)
  roles: Role[];
}
