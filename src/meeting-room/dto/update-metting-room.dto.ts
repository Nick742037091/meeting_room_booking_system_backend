import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMettingRoomDto } from './create-metting-room.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMettingRoomDto extends PartialType(CreateMettingRoomDto) {
  @ApiProperty({ title: 'id' })
  @IsNotEmpty({ message: 'id不能为空' })
  id: number;
}
