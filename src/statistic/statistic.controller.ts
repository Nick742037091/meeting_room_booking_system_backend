import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('统计')
@Controller('statistic')
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @ApiOperation({ summary: '用户预约数量统计' })
  @ApiQuery({ name: 'startTime', description: '开始时间' })
  @ApiQuery({ name: 'startTime', description: '结束时间' })
  @Get('userBookingCount')
  async userBookingCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @ApiOperation({ summary: '会议室使用数量统计' })
  @ApiQuery({ name: 'startTime', description: '开始时间' })
  @ApiQuery({ name: 'startTime', description: '结束时间' })
  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
