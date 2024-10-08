import { ApiProperty } from '@nestjs/swagger';

export class UserDetailVo {
  @ApiProperty({
    example: 1,
    type: Number,
    title: '用户ID',
  })
  id: number;

  @ApiProperty({
    example: 'xxx',
    type: String,
    title: '用户名',
  })
  username: string;

  @ApiProperty({
    example: 'xxx',
    type: String,
    title: '昵称',
  })
  nickName: string;

  @ApiProperty({
    example: 'xx@qq.com',
    type: String,
    title: '邮箱',
  })
  email: string;

  @ApiProperty({
    example: 'xxx',
    type: String,
    title: '头像',
  })
  headPic: string;

  @ApiProperty({
    example: '18888888888',
    type: String,
    title: '手机号',
  })
  phoneNumber: string;

  @ApiProperty({
    example: false,
    type: Boolean,
    title: '是否冻结',
  })
  isFrozen: boolean;

  @ApiProperty({
    example: '2024-08-07T06:50:03.833Z',
    type: Date,
    title: '创建时间',
  })
  createTime: Date;
}
