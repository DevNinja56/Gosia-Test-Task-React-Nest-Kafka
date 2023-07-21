import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { JobsController } from './job.controller';
import { JobRepository } from './job.repository';
import { JobsService } from './jobs.service';
import { EmailModule } from 'src/emailWorker/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job, JobRepository]), EmailModule],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
