import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  
  @Entity('meetingsession', { schema: 'public' })
  export class Meetingsession {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number;

    @Column('character varying', {
        name: 'meetingid',
        length: 255,
    })
    meetingid: string;

    @Column('character varying', {
        name: 'sessionid',
        length: 255,
    })
    sessionid: string;

    @Column('timestamp with time zone', { name: 'stat', nullable: true })
    stat: Date | null;

    @Column('character varying', {
        name: 'report',
        nullable: true,
        length: 500,
    })
    report: string | null;

    @Column('timestamp with time zone', { name: 'time_stamp', nullable: true })
    timeStamp: Date | null;

    @Column('character varying', {
        name: 'meetingtitle',
        length: 255,
    })
    meetingtitle: string;

    @Column('character varying', {
        name: 'organizer_extension',
        length: 5,
    })
    organizerExtension: string;

    @Column('character varying', {
        name: 'organizer_name',
        length: 255,
    })
    organizerName: string;

    @Column('character varying', {
        name: 'organizer_email',
        length: 255,
    })
    organizerEmail: string;

    @Column("simple-json")
    duration: { minutes: number, seconds: number }; 

    @Column('integer', { name: 'bandwidth_up', nullable: true })
    bandwidthUp: number | null;

    @Column('integer', { name: 'bandwidth_down', nullable: true })
    bandwidthDown: number | null;

    @Column('integer', { name: 'participants', nullable: true })
    participants: number | null;

    @Column('integer', { name: 'maxparticipants', nullable: true })
    maxparticipants: number | null;

    @Column('integer', { name: 'invites', nullable: true })
    invites: number | null;

    @Column('integer', { name: 'openlinks', nullable: true })
    openlinks: number | null;

    @Column('boolean', {
        name: 'recorded',
        nullable: true,
        default: () => 'false',
      })
    recorded: boolean;

    @Column('character varying', {
        name: 'mcu',
        length: 255,
    })
    mcu: string;

    @Column('character varying', {
        name: 'meetingbegin',
        length: 255,
    })
    meetingbegin: string;

    @Column('character varying', {
        name: 'pv_meeting_objects',
        length: 255,
    })
    pvMeetingObjects: string;

    @Column('timestamp with time zone', { name: 'sent_at', nullable: true })
    sentAt: Date | null;
}