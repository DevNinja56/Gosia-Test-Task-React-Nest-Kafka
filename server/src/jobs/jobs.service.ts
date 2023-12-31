import { Injectable, OnModuleInit } from '@nestjs/common';
import { Consumer, KafkaClient, Producer } from 'kafka-node';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { KAFKA_HOST, KAFKA_TOPIC_NAME } from 'src/constants';
import { JobRepository } from './job.repository';
import { Server } from 'socket.io';
import { EmailService } from 'src/emailWorker/email.service';

@Injectable()
export class JobsService implements OnModuleInit {
  private io: Server;
  private producer: Producer;
  private consumer: Consumer;

  constructor(
    @InjectRepository(Job)
    private jobRepository: JobRepository,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    /**
     * Initialize the Socket.io server
     */
    this.io = new Server(8000, {
      cors: {
        origin: '*',
      },
    });

    /**
     * Initialize the kafka with the producer and consumer methods
     */
    const client = new KafkaClient({ kafkaHost: KAFKA_HOST });
    this.producer = new Producer(client);
    this.consumer = new Consumer(
      client,
      [{ topic: KAFKA_TOPIC_NAME, partition: 0 }],
      { fromOffset: false },
    );

    this.setupKafkaEvents();
  }

  /**
   * Listen for a producer method after initialization of kafka
   * Create a new topic through producer method in kafka
   */
  private setupKafkaEvents() {
    this.producer.on('ready', () => {
      this.producer.createTopics([KAFKA_TOPIC_NAME], false, (err) => {
        if (err) {
          console.log('Error creating topics:', err);
        } else {
          this.setupConsumerEvents();
        }
      });
    });
  }

  /**
   * Listen for a consumer method after creating a topic
   * Divide the email counts into chunks and find job in database with Job ID
   */
  private setupConsumerEvents() {
    this.consumer.on('message', async (message) => {
      const job = JSON.parse(message.value as string);
      const chunks = Math.ceil(job.count / 1000);
      const findJob = await this.jobRepository.findOne({
        where: { jobId: job.jobId },
      });

      if (findJob) {
        await this.handleJobUpdates(findJob, chunks, job.count);
      }
    });
  }

  /**
   * Update Job with email counts to the database
   * Send email counts with the socket.io on JobUpdate event
   */
  private async handleJobUpdates(findJob: Job, chunks: number, count: number) {
    for (let i = 0; i < chunks; i++) {
      for (let j = 0; j < Math.min(1000, count - i * 1000); j++) {
        findJob.count = i * 1000 + j + 1;
        const updateJob = await this.jobRepository.save(findJob);
        if (updateJob) {
          /**
           * Define worker for sending emails to the user
           */
          // await this.emailService.sendEmail('receiver@example.com', 'Hello 👋', 'This is a test email!');

          this.io.emit('jobUpdate', updateJob);
        }
      }
    }
  }

  /**
   * Find all jobs from the database
   */
  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  /**
   * Generate Job ID and create a record in the database
   * Send the Job ID and email count to the kafka with the kafka's producer method
   */
  async sendJobs(count: number) {
    const jobId = uuidv4();
    const createJob = await this.jobRepository.save({ jobId, count: 0 });

    if (createJob) {
      const payloads = [
        {
          topic: KAFKA_TOPIC_NAME,
          messages: JSON.stringify({ jobId, count }),
        },
      ];

      this.producer.send(payloads, (err) => {
        if (err) {
          console.log('Error sending messages', err);
        }
      });

      return jobId;
    }
  }
}
