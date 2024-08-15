import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty({
    title: '用户id',
    type: String,
  })
  id: number;

  @ApiProperty({
    title: '用户名称',
    type: String,
  })
  username: string;

  @ApiProperty({
    title: '用户昵称',
    type: String,
  })
  nickName: string;

  @ApiProperty({
    title: '邮箱',
    type: String,
  })
  email: string;

  @ApiProperty({
    title: '手机号',
    type: String,
  })
  phoneNumber: string;

  @ApiProperty({
    title: '是否冻结',
    type: Boolean,
  })
  isFrozen: boolean;

  @ApiProperty({
    title: '头像',
    type: String,
  })
  headPic: string;

  @ApiProperty({
    title: '创建时间',
    type: Date,
  })
  createTime: Date;
}

export class UserListVo {
  @ApiProperty({
    type: [User],
    title: '用户列表',
  })
  list: User[];

  @ApiProperty({
    type: Number,
    title: '总数',
  })
  total: number;
}
