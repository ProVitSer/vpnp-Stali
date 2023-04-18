import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ForwardType } from '../types/pbx3cx.enum';

@Entity('fwdprofile', { schema: 'public' })
export class Fwdprofile {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'idfwdprofile' })
  idfwdprofile: number;

  @Column('character varying', { name: 'profilename', length: 255 })
  profilename: ForwardType;

  @Column('integer', { name: 'fkidextension' })
  fkidextension: number;

  @Column('character varying', {
    name: 'displayname',
    nullable: true,
    length: 255,
  })
  displayname: string | null;

  @Column('integer', { name: 'noanswtimeout', nullable: true })
  noanswtimeout: number | null;

  @Column('boolean', { name: 'ringsim', nullable: true })
  ringsim: boolean | null;

  @Column('integer', {
    name: 'busydetection',
    nullable: true,
    default: () => '2',
  })
  busydetection: number | null;

  @Column('character varying', { name: 'customname', nullable: true })
  customname: string | null;

  @Column('boolean', {
    name: 'disable_ringgroup_calls',
    default: () => 'false',
  })
  disableRinggroupCalls: boolean;

  @Column('integer', {
    name: 'force_queue_status',
    nullable: true,
    default: () => "'-1'",
  })
  forceQueueStatus: number | null;

  @Column('boolean', { name: 'block_push_calls', default: () => 'false' })
  blockPushCalls: boolean;

  @Column('integer', { name: 'force_internal', default: () => "'-1'" })
  forceInternal: number;

  @Column('integer', { name: 'force_chat_status', default: () => "'-1'" })
  forceChatStatus: number;

  @Column('integer', { name: 'forwardtypeto_match1', nullable: true })
  forwardtypetoMatch1: number | null;

  @Column('integer', { name: 'forwardtypeto_match2', nullable: true })
  forwardtypetoMatch2: number | null;

  @Column('integer', { name: 'forwardtypeto_match3', nullable: true })
  forwardtypetoMatch3: number | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_match1',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberMatch1: string | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_match2',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberMatch2: string | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_match3',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberMatch3: string | null;

  @Column('integer', { name: 'forwardtypeto_dontmatch1', nullable: true })
  forwardtypetoDontmatch1: number | null;

  @Column('integer', { name: 'forwardtypeto_dontmatch2', nullable: true })
  forwardtypetoDontmatch2: number | null;

  @Column('integer', { name: 'forwardtypeto_dontmatch3', nullable: true })
  forwardtypetoDontmatch3: number | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_dontmatch1',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberDontmatch1: string | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_dontmatch2',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberDontmatch2: string | null;

  @Column('character varying', {
    name: 'fwdtooutsidenumber_dontmatch3',
    nullable: true,
    length: 255,
  })
  fwdtooutsidenumberDontmatch3: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_dontmatch1',
    nullable: true,
    length: 255,
  })
  fkforwardtodnDontmatch: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_dontmatch2',
    nullable: true,
    length: 255,
  })
  fkforwardtodnDontmatch2: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_dontmatch3',
    nullable: true,
    length: 255,
  })
  fkforwardtodnDontmatch3: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_match1',
    nullable: true,
    length: 255,
  })
  fkforwardtodnMatch: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_match2',
    nullable: true,
    length: 255,
  })
  fkforwardtodnMatch2: string | null;

  @Column('character varying', {
    name: 'fkforwardtodn_match3',
    nullable: true,
    length: 255,
  })
  fkforwardtodnMatch3: string | null;
}
