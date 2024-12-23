import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appconfigs', { schema: 'tools' })
export class AppConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('json', { name: 'config' })
  config: object;

  @Column({ nullable: true })
  version: string;

  @Column('timestamp with time zone', {
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('character varying', {
    name: 'updated_by',
  })
  updatedBy: string;
}
