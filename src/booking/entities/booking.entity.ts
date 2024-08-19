import { BaseEntity } from 'src/common/database/base.entity';
import { MeetingRoom } from 'src/metting-room/entities/metting-room.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum BookingStatus {
  APPLYING = 0,
  APPROVED = 1,
  REJECTED = 2,
  CANCELED = 3,
}

@Entity('booking', { comment: '预定表' })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn({ comment: '预定id' })
  id: number;

  @Column({ name: 'start_time', comment: '开始时间' })
  startTime: Date;

  @Column({ name: 'end_time', comment: '结束时间' })
  endTime: Date;

  @Column({
    name: 'status',
    comment: '状态：0 申请中、1 审批通过、2 审批驳回、3 已解除',
  })
  status: number;

  @Column({ name: 'note', comment: '备注', length: 100, default: '' })
  note: string;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  user: User;

  @JoinColumn({
    name: 'meeting_room_id',
  })
  @ManyToOne(() => MeetingRoom, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  meetingRoom: MeetingRoom;
}
