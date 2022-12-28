import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('meetingsession', { schema: 'public' })
export class Meetingsession {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'meetingid',
  })
  meetingid: string;

  @Column('character varying', {
    name: 'sessionid',
  })
  sessionId: string;

  @Column('timestamp with time zone', { name: 'stat' })
  stat: Date;

  @Column('character varying', {
    name: 'report',
  })
  report: string;

  @Column('timestamp with time zone', { name: 'time_stamp' })
  timeStamp: Date;

  @Column('character varying', {
    name: 'meetingtitle',
  })
  meetingtitle: string;

  @Column('character varying', {
    name: 'organizer_extension',
  })
  organizerExtension: string;

  @Column('character varying', {
    name: 'organizer_name',
  })
  organizerName: string;

  @Column('character varying', {
    name: 'organizer_email',
  })
  organizerEmail: string;

  @Column('character varying', {
    name: 'duration',
  })
  duration: { minutes: number; seconds: number };

  @Column('integer', { name: 'bandwidth_up' })
  bandwidthUp: number;

  @Column('integer', { name: 'bandwidth_down' })
  bandwidthDown: number;

  @Column('integer', { name: 'participants' })
  participants: number;

  @Column('integer', { name: 'maxparticipants' })
  maxparticipants: number;

  @Column('integer', { name: 'invites' })
  invites: number;

  @Column('integer', { name: 'openlinks' })
  openlinks: number;

  @Column('boolean', {
    name: 'recorded',
    default: () => 'false',
  })
  recorded: boolean;

  @Column('character varying', {
    name: 'mcu',
  })
  mcu: string;

  @Column('character varying', {
    name: 'meetingbegin',
  })
  meetingbegin: string;

  @Column('character varying', {
    name: 'pv_meeting_objects',
    nullable: true,
  })
  pvMeetingObjects: string;

  @Column('timestamp with time zone', { name: 'sent_at' })
  sentAt: Date;
}
