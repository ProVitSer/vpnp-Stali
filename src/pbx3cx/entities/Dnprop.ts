import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('dnprop', { schema: 'public' })
export class Dnprop {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'iddnprop' })
  iddnprop: number;

  @Column('integer', { name: 'fkiddn', unique: true })
  fkiddn: number;

  @Column('character varying', { name: 'name', unique: true, length: 255 })
  name: string;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column('integer', { name: 'propertytype', default: () => '0' })
  propertytype: number;

  @Column('character varying', { name: 'value', nullable: true })
  value: string | null;
}
