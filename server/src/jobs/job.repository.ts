import { Repository } from 'typeorm';
import { Job } from './job.entity';

export class JobRepository extends Repository<Job> {}
