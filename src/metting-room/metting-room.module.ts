import { Module } from '@nestjs/common';
import { MettingRoomService } from './metting-room.service';
import { MettingRoomController } from './metting-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/metting-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoom])],
  controllers: [MettingRoomController],
  providers: [MettingRoomService],
})
export class MettingRoomModule {}
