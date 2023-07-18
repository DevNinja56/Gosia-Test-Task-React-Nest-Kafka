import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  jobId: string;

  @Column('text')
  status: string;

  @Column('int')
  count: number;
}
