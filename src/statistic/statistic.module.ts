import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { MeetingRoom } from 'src/meeting-room/entities/meeting-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, MeetingRoom])],
  providers: [StatisticService],
  controllers: [StatisticController],
})
export class StatisticModule {}
