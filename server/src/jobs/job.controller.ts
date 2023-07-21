import { Controller, Post, Body, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  /**
   * Define Post request
   */
  @Post()
  async sendJobs(@Body('count') count: number) {
    const jobId = await this.jobsService.sendJobs(count);
    return { jobId };
  }

  /**
   * Define GET request
   */
  @Get()
  async getJobs() {
    return this.jobsService.getAllJobs();
  }
}
