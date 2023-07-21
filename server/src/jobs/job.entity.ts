import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Define schema for a Job
 */
@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  jobId: string;

  @Column('int')
  count: number;
}
