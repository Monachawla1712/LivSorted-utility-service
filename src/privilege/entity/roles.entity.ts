import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles', schema: 'tools' })
export class RolesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 150 })
  name: string;

  @Column()
  level: number;

  @Column({ default: 1 })
  active: number;

  @CreateDateColumn()
  created_at: Date;

  @Column('uuid', { nullable: true })
  created_by: string;

  @UpdateDateColumn()
  modified_at: Date;

  @Column('uuid', { nullable: true })
  modified_by: string;
}
