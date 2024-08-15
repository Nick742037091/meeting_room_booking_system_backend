import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenVo {
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
