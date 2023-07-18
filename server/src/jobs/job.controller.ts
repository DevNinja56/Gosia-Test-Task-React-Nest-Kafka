import { Controller, Post, Body, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Post()
  async sendJobs(@Body('count') count: number) {
    const jobId = await this.jobsService.sendJobs(count);
    return { jobId };
  }

  @Get('')
  async getJobs() {
    return this.jobsService.findJobs();
  }
}
