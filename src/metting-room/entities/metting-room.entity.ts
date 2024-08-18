import { BaseEntity } from 'src/common/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meeting_room')
export class MeetingRoom extends BaseEntity {
  @PrimaryGeneratedColumn({
    comment: '会议室id',
  })
  id: number;

  @Column({
    comment: '会议室名称',
    length: 50,
  })
  name: string;

  @Column({
    comment: '会议室容量',
  })
  capacity: number;

  @Column({
    comment: '会议室位置',
    length: 50,
  })
  location: string;

  @Column({
    comment: '设备',
    length: 50,
    nullable: true,
  })
  equipment: string;

  @Column({
    comment: '描述',
    length: 100,
    nullable: true,
  })
  description: string;

  @Column({
    comment: '是否被预订',
    name: 'is_booked',
    nullable: true,
    default: false,
  })
  isBooked: boolean;
}
