import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({
    type: String,
    title: '用户名',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @ApiProperty({
    type: String,
    title: '密码',
  })
  password: string;
}
