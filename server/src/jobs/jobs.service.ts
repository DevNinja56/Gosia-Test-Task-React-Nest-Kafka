// jobs.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient, Producer } from 'kafka-node';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { JobRepository } from './job.repository';
import { Job } from './job.entity';

@Injectable()
export class JobsService implements OnModuleInit {
  private producer: Producer;

  constructor(
    @InjectRepository(JobRepository)
    private jobRepository: JobRepository,
  ) {}

  onModuleInit() {
    const client = new KafkaClient({ kafkaHost: 'localhost:9092' });
    this.producer = new Producer(client);
    this.producer.on('ready', () => console.log('Producer is ready'));
  }

  async sendJobs(count: number) {
    const jobId = uuidv4();
    const payloads = [
      {
        topic: 'emailJobs',
        messages: JSON.stringify({ jobId, count }),
      },
    ];

    this.producer.send(payloads, (err, data) => {
      if (err) {
        console.log('Error sending messages', err);
      } else {
        console.log('Message sent', data);
      }
    });

    // Save the job in the database
    await this.jobRepository.saveJob(jobId, 'created', count);

    return jobId;
  }

  async findJobs(): Promise<Job[]> {
    // Retrieve all jobs from the database
    return this.jobRepository.findAllJobs();
  }
}
