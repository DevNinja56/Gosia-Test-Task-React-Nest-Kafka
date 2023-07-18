import { EntityRepository, Repository } from 'typeorm';
import { Job } from './job.entity';

@EntityRepository(Job)
export class JobRepository extends Repository<Job> {
  async saveJob(jobId: string, status: string, count: number): Promise<Job> {
    const job = this.create({ jobId, status, count });
    await this.save(job);
    return job;
  }

  async findAllJobs(): Promise<Job[]> {
    return await this.find();
  }
}
