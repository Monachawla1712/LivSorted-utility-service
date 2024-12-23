import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('faqs', { schema: 'tools' })
export class FaqEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  app: string;

  @Column('json', { nullable: false })
  faq: object;

  @Column({ default: true, nullable: false })
  is_active: boolean;

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
