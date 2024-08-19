import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import {
  Between,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { MeetingRoom } from 'src/metting-room/entities/metting-room.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(MeetingRoom)
    private meetingRoomRepository: Repository<MeetingRoom>,
    private emailService: EmailService,
  ) {}

  async initData() {
    const user1 = await this.userRepository.findOneBy({ id: 1 });
    const user2 = await this.userRepository.findOneBy({ id: 4 });

    const meetingRoom1 = await this.meetingRoomRepository.findOneBy({ id: 1 });
    const meetingRoom2 = await this.meetingRoomRepository.findOneBy({ id: 2 });
    const meetingRoom3 = await this.meetingRoomRepository.findOneBy({ id: 3 });

    const booking1 = new Booking();
    booking1.startTime = new Date();
    booking1.endTime = new Date();
    booking1.status = 0;
    booking1.user = user1;
    booking1.meetingRoom = meetingRoom1;

    const booking2 = new Booking();
    booking2.startTime = new Date();
    booking2.endTime = new Date();
    booking2.status = 0;
    booking2.user = user2;
    booking2.meetingRoom = meetingRoom2;

    const booking3 = new Booking();
    booking3.startTime = new Date();
    booking3.endTime = new Date();
    booking3.status = 0;
    booking3.user = user2;
    booking3.meetingRoom = meetingRoom3;

    await this.bookingRepository.insert([booking1, booking2, booking3]);
    return 'success';
  }

  async find(
    pageNo: number,
    pageSize: number,
    username?: string,
    meetingRoomName?: string,
    meetingRoomLocation?: string,
    bookingTimeRangeStart?: number,
    bookingTimeRangeEnd?: number,
  ) {
    const condition: Record<string, any> = {};
    if (username) {
      condition.user = {
        username: Like(`%${username}%`),
      };
    }
    if (meetingRoomName) {
      condition.meetingRoom = {
        name: Like(`%${meetingRoomName}%`),
      };
    }
    if (meetingRoomLocation) {
      condition.meetingRoom = {
        ...(condition.meetingRoom || {}),
        location: Like(`%${meetingRoomLocation}%`),
      };
    }
    if (bookingTimeRangeStart) {
      // 如果 endTime 没传入，那就用 startTime + 一小时 来搜索。
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }
      condition.startTime = Between(
        new Date(bookingTimeRangeStart),
        new Date(bookingTimeRangeEnd),
      );
    }
    const [list, total] = await this.bookingRepository.findAndCount({
      skip: (pageNo - 1) * pageSize,
      take: pageSize,
      relations: {
        user: true,
        meetingRoom: true,
      },
      select: {
        user: {
          id: true,
          nickName: true,
          username: true,
        },
        meetingRoom: {
          id: true,
          name: true,
          location: true,
          equipment: true,
          description: true,
        },
      },
      where: condition,
    });
    return {
      list,
      total,
    };
  }

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      id: createBookingDto.meetingRoomId,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    const booking = new Booking();
    booking.startTime = new Date(createBookingDto.startTime);
    booking.endTime = new Date(createBookingDto.endTime);
    booking.status = BookingStatus.APPLYING;
    booking.user = user;
    booking.meetingRoom = meetingRoom;

    const existBooking = await this.bookingRepository.findOneBy({
      meetingRoom: {
        id: createBookingDto.meetingRoomId,
      },
      startTime: LessThanOrEqual(booking.startTime),
      endTime: MoreThanOrEqual(booking.endTime),
    });
    if (existBooking) {
      throw new BadRequestException('该时间段已被预约');
    }

    const newBooking = await this.bookingRepository.save(booking);
    return newBooking.id;
  }

  async apply(id: number) {
    await this.bookingRepository.update(id, {
      status: BookingStatus.APPROVED,
    });
    return 'success';
  }

  async reject(id: number) {
    await this.bookingRepository.update(id, {
      status: BookingStatus.REJECTED,
    });
    return 'success';
  }

  async unbind(id: number) {
    await this.bookingRepository.update(id, {
      status: BookingStatus.CANCELED,
    });
    return 'success';
  }

  async urge(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!booking) {
      throw new BadRequestException('预约不存在');
    }

    this.emailService.sendMail({
      to: booking.user.email,
      subject: `预定申请催办提醒`,
      html: `id 为 ${id} 的预定申请正在等待审批`,
    });
  }

  findAll() {
    return `This action returns all booking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
