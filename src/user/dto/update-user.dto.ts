import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    title: '用户头像',
    required: false,
  })
  headPic: string;

  @ApiProperty({
    type: String,
    title: '用户昵称',
    required: false,
  })
  nickName: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  @ApiProperty({
    type: String,
    title: '邮箱',
    required: false,
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty({
    type: String,
    title: '验证码',
    required: false,
  })
  captcha: string;
}
