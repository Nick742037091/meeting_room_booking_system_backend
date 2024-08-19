import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { generateParseIntPipe } from 'src/utils';
import { RequireLogin, UserInfo } from 'src/common/decorators';
import {
  ApplyBookingDto,
  RejctBookingDto,
  UrgelBookingDto,
} from './dto/apply-booking.dto';

@ApiTags('预定管理')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: '初始化数据' })
  @Get('init')
  initData() {
    return this.bookingService.initData();
  }

  @ApiOperation({ summary: '获取会议室预约列表' })
  @ApiQuery({ name: 'pageNo', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页条数' })
  @Get('list')
  list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('meetingRoomName') meetingRoomName: string,
    @Query('meetingRoomLocation') meetingRoomLocation: string,
    @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
    @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number,
  ) {
    return this.bookingService.find(
      pageNo,
      pageSize,
      username,
      meetingRoomName,
      meetingRoomLocation,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @ApiOperation({ summary: '预约会议室' })
  @Post('add')
  @RequireLogin()
  create(
    @Body(new ValidationPipe()) createBookingDto: CreateBookingDto,
    @UserInfo('userId') userId: number,
  ) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @ApiOperation({ summary: '审批通过' })
  @ApiBody({ type: ApplyBookingDto })
  @Post('apply')
  apply(@Body('id') id: number) {
    return this.bookingService.apply(id);
  }

  @ApiOperation({ summary: '审批驳回' })
  @ApiBody({ type: RejctBookingDto })
  @Post('reject')
  reject(@Body('id') id: number) {
    return this.bookingService.reject(id);
  }

  @ApiOperation({ summary: '解绑' })
  @ApiBody({ type: RejctBookingDto })
  @Post('unbind')
  unbind(@Body('id') id: number) {
    return this.bookingService.unbind(id);
  }

  @ApiOperation({ summary: '催办' })
  @ApiBody({ type: UrgelBookingDto })
  @Post('urge')
  urgeent(@Body('id') id: number) {
    return this.bookingService.urge(id);
  }
}
