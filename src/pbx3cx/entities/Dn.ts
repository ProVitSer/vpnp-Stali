import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dn', { schema: 'public' })
export class Dn {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'iddn' })
  iddn: number;

  @Column('integer', { name: 'status', default: () => '1' })
  status: number;

  @Column('character varying', { name: 'value', unique: true, length: 255 })
  value: string;

  @Column('integer', { name: 'fkidtenant', unique: true })
  fkidtenant: number;

  @Column('integer', { name: 'fkidcalendar', unique: true })
  fkidcalendar: number;
}
