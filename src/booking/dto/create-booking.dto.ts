import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    title: '会议室id',
    type: Number,
  })
  @IsNotEmpty({
    message: '会议室id不能为空',
  })
  meetingRoomId: number;

  @ApiProperty({
    title: '开始时间',
    type: Date,
  })
  @IsNotEmpty({
    message: '开始时间不能为空',
  })
  startTime: Date;

  @ApiProperty({
    title: '结束时间',
    type: Date,
  })
  @IsNotEmpty({
    message: '结束时间不能为空',
  })
  endTime: Date;

  @ApiProperty({
    title: '备注',
    type: String,
  })
  note: string;
}
