import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  DefaultValuePipe,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { MettingRoomService } from './metting-room.service';
import { CreateMettingRoomDto } from './dto/create-metting-room.dto';
import { UpdateMettingRoomDto } from './dto/update-metting-room.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { generateParseIntPipe } from 'src/utils';
import { RequireLogin } from 'src/common/decorators';

@ApiTags('会议室管理模块')
@Controller('metting-room')
@ApiBearerAuth()
@RequireLogin()
export class MettingRoomController {
  constructor(private readonly mettingRoomService: MettingRoomService) {}

  @ApiOperation({ summary: '初始化会议室数据' })
  @Get('init-data')
  initData() {
    return this.mettingRoomService.initData();
  }

  @ApiOperation({ summary: '创建会议室' })
  @Post()
  create(
    @Body(new ValidationPipe()) createMettingRoomDto: CreateMettingRoomDto,
  ) {
    return this.mettingRoomService.create(createMettingRoomDto);
  }

  @ApiOperation({ summary: '查询会议室列表' })
  @ApiQuery({
    name: 'pageNo',
    type: Number,
    required: false,
    description: '页码',
  })
  @ApiQuery({
    name: 'pageSize',
    type: Number,
    required: false,
    description: '每页条数',
  })
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
    @Query('name') name: string,
    @Query('capacity') capacity: number,
    @Query('equipment') equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    return this.mettingRoomService.find(
      pageNo,
      pageSize,
      name,
      capacity,
      equipment,
    );
  }

  @ApiOperation({ summary: '查询会议室详情' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.mettingRoomService.findById(+id);
  }

  @ApiOperation({ summary: '更新会议室' })
  @Put('update')
  update(@Body() updateMettingRoomDto: UpdateMettingRoomDto) {
    return this.mettingRoomService.update(updateMettingRoomDto);
  }

  @ApiOperation({ summary: '删除会议室' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mettingRoomService.remove(+id);
  }
}
