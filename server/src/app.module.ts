import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs/job.controller';
import { JobsService } from './jobs/jobs.service';
import { KafkaService } from './kafka/kafka.service';
import { Job } from './jobs/job.entity';
import { JobRepository } from './jobs/job.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'jobsDB',
      entities: [Job],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([JobRepository]),
  ],
  controllers: [JobsController],
  providers: [JobsService, KafkaService],
})
export class AppModule {}
