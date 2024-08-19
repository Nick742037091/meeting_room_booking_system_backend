import { MeetingRoom } from './../meeting-room/entities/meeting-room.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
  ) {}

  async userBookingCount(startTime: string, endTime: string) {
    return await this.bookingRepository
      .createQueryBuilder('b')
      .leftJoin(User, 'u', 'b.user_id = u.id')
      .select('u.id', 'userId')
      .addSelect('u.username', 'username')
      .addSelect('count(*)', 'bookingCount')
      .where('b.startTime  between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('userId')
      .getRawMany();
  }

  async meetingRoomUsedCount(startTime: string, endTime: string) {
    return await this.bookingRepository
      .createQueryBuilder('b')
      .leftJoin(MeetingRoom, 'm', 'b.meeting_room_id = m.id')
      .select('m.id', 'meetingRoomId')
      .addSelect('m.name', 'meetingRoomName')
      .addSelect('count(*)', 'bookingCount')
      .where('b.startTime  between :time1 and :time2 ', {
        time1: startTime,
        time2: endTime,
      })
      .groupBy('meetingRoomId')
      .getRawMany();
  }
}
