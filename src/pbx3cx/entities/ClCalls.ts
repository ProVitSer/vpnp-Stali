import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cl_calls', { schema: 'public' })
export class ClCalls {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number | null;

  @Column('timestamp with time zone', { name: 'start_time' })
  startTime: Date;

  @Column('timestamp with time zone', { name: 'end_time' })
  endTime: Date;

  @Column('boolean', { name: 'is_answered' })
  isAnswered: boolean;

  @Column('interval', { name: 'ringing_dur', nullable: true })
  ringingDur: any | null;

  @Column('interval', { name: 'talking_dur', nullable: true })
  talkingDur: any | null;

  @Column('interval', { name: 'q_wait_dur', nullable: true })
  qWaitDur: any | null;
}
