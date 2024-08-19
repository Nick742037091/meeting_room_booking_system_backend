import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMettingRoomDto {
  @ApiProperty({
    title: '名称',
  })
  @IsNotEmpty({
    message: '名称不能为空',
  })
  @MaxLength(50, {
    message: '名称不能超过50个字符',
  })
  name: string;

  @ApiProperty({
    title: '容量',
  })
  @IsNotEmpty({
    message: '容量不能为空',
  })
  capacity: number;

  @ApiProperty({
    title: '位置',
  })
  @IsNotEmpty({
    message: '位置不能为空',
  })
  @MaxLength(50, {
    message: '位置不能超过50个字符',
  })
  location: string;

  @ApiProperty({
    title: '设备',
  })
  @MaxLength(50, {
    message: '设备不能超过50个字符',
  })
  equipment: string;

  @ApiProperty({
    title: '描述',
  })
  @MaxLength(100, {
    message: '描述不能超过100个字符',
  })
  description?: string;
}
