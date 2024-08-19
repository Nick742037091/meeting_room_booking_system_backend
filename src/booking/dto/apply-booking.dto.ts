import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ApplyBookingDto {
  @ApiProperty({
    title: '预约ID',
  })
  @IsNotEmpty({
    message: '预约ID不能为空',
  })
  id: number;
}

export const RejctBookingDto = ApplyBookingDto;
export const CancelBookingDto = ApplyBookingDto;
export const UrgelBookingDto = ApplyBookingDto;
