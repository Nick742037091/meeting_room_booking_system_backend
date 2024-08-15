import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({
    example: 'zhangsan',
    type: String,
    description: '用户名',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @ApiProperty({
    example: '123456',
    type: String,
    description: '密码',
  })
  password: string;
}
