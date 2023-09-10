import { Entity, Column } from 'typeorm';

@Entity('extension', { schema: 'public' })
export class Extension {
  @Column('integer', { primary: true, name: 'fkiddn' })
  fkiddn: number;

  @Column('character varying', { name: 'authid', nullable: true, length: 255 })
  authid: string | null;

  @Column('integer', { name: 'currentprofile', nullable: true })
  currentprofile: number;

  @Column('character varying', {
    name: 'authpswd',
    nullable: true,
    length: 255,
  })
  authpswd: string | null;

  @Column('character varying', { name: 'outcid', nullable: true, length: 255 })
  outcid: string | null;

  @Column('boolean', { name: 'recrdout', default: () => 'false' })
  recrdout: boolean;

  @Column('boolean', { name: 'recrdin', default: () => 'false' })
  recrdin: boolean;

  @Column('boolean', { name: 'accstatus', default: () => 'true' })
  accstatus: boolean;

  @Column('boolean', { name: 'accconfig', default: () => 'true' })
  accconfig: boolean;

  @Column('integer', { name: 'noanswtimeout', nullable: true })
  noanswtimeout: number | null;

  @Column('integer', {
    name: 'busydetection',
    nullable: true,
    default: () => '2',
  })
  busydetection: number | null;

  @Column('boolean', { name: 'isinternal', default: () => 'true' })
  isinternal: boolean;

  @Column('boolean', { name: 'isbindtoms', default: () => 'false' })
  isbindtoms: boolean;

  @Column('boolean', { name: 'issupportreinvite', default: () => 'true' })
  issupportreinvite: boolean;

  @Column('boolean', { name: 'issupportreplaces', default: () => 'true' })
  issupportreplaces: boolean;

  @Column('integer', { name: 'castatus', default: () => '0' })
  castatus: number;

  @Column('integer', { name: 'qstatus', default: () => '0' })
  qstatus: number;

  @Column('boolean', { name: 'enabled', default: () => 'true' })
  enabled: boolean;

  @Column('integer', { name: 'use_srtp', default: () => '0' })
  useSrtp: number;

  @Column('boolean', { name: 'hidepresence', default: () => 'false' })
  hidepresence: boolean;

  @Column('timestamp without time zone', {
    name: 'overrideexpiresat',
    nullable: true,
  })
  overrideexpiresat: Date | null;
}
