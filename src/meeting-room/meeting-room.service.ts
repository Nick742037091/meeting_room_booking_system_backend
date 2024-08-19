import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMettingRoomDto } from './dto/create-metting-room.dto';
import { UpdateMettingRoomDto } from './dto/update-metting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoom)
    private mettingRoomRepository: Repository<MeetingRoom>,
  ) {}

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    this.mettingRoomRepository.save([room1, room2, room3]);
  }
  async create(createMettingRoomDto: CreateMettingRoomDto) {
    const room = await this.mettingRoomRepository.findOneBy({
      name: createMettingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名称已存在');
    }
    return await this.mettingRoomRepository.insert(createMettingRoomDto);
  }

  async find(
    pageNo: number,
    pageSize: number,
    name?: string,
    capacity?: number,
    equipment?: string,
  ) {
    const condition: Record<string, any> = {};
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (capacity) {
      condition.capacity = Like(`%${capacity}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    const skip = (pageNo - 1) * pageSize;

    const [list, total] = await this.mettingRoomRepository.findAndCount({
      skip,
      take: pageSize,
      where: condition,
    });
    return {
      list,
      total,
    };
  }

  findById(id: number) {
    return this.mettingRoomRepository.findOneBy({
      id,
    });
  }

  async update(mettingRoomDto: UpdateMettingRoomDto) {
    const room = await this.mettingRoomRepository.findOneBy({
      id: mettingRoomDto.id,
    });
    if (!room) {
      throw new BadRequestException('会议室不存在');
    }
    room.name = mettingRoomDto.name;
    room.location = mettingRoomDto.location;
    room.capacity = mettingRoomDto.capacity;
    if (mettingRoomDto.equipment) {
      room.equipment = mettingRoomDto.equipment;
    }
    if (mettingRoomDto.description) {
      room.description = mettingRoomDto.description;
    }
    await this.mettingRoomRepository.update(
      {
        id: mettingRoomDto.id,
      },
      mettingRoomDto,
    );
    return 'success';
  }

  remove(id: number) {
    return this.mettingRoomRepository.delete(id);
  }
}
