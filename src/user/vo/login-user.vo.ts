import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';

export class UserInfo {
  @ApiProperty({
    type: Number,
    title: '用户ID',
  })
  userId: number;

  @ApiProperty({
    type: String,
    title: '用户名',
  })
  username: string;

  @ApiProperty({
    type: String,
    title: '昵称',
  })
  nickName: string;

  @ApiProperty({
    type: String,
    title: '邮箱',
  })
  email: string;

  @ApiProperty({
    type: String,
    title: '头像',
  })
  headPic: string;

  @ApiProperty({
    type: String,
    title: '手机号',
  })
  phoneNumber: string;

  @ApiProperty({
    type: Boolean,
    title: '是否冻结',
  })
  isFrozen: boolean;

  @ApiProperty({
    type: Boolean,
    title: '是否管理员',
  })
  isAdmin: boolean;

  @ApiProperty({
    type: Number,
    title: '创建时间',
  })
  createTime: number;

  @ApiProperty({
    example: '管理员',
    type: [String],
    title: '角色',
  })
  roles: string[];

  @ApiProperty({
    example: 'query_aaa',
    type: [String],
    title: '权限',
  })
  permissions: Permission[];
}

export class LoginUserVo {
  @ApiProperty({
    type: UserInfo,
    title: '用户信息',
  })
  userInfo: UserInfo;

  @ApiProperty({
    type: String,
    title: '访问令牌',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    title: '刷新令牌',
  })
  refreshToken: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}
