import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaClient, Consumer, Producer } from 'kafka-node';
import { Server } from 'socket.io';

@Injectable()
export class KafkaService implements OnModuleInit {
  private io: Server;
  private consumer: Consumer;
  private producer: Producer;
  private client: KafkaClient;
  private topicName = 'emailJobs';

  onModuleInit() {
    this.io = new Server(8000, {
      cors: {
        origin: '*',
      },
    });
    this.io.on('connection', (socket) => {
      // console.log('User connected');
    });

    this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
    this.producer = new Producer(this.client);

    this.producer.on('ready', () => {
      this.producer.createTopics([this.topicName], true, (err, data) => {
        if (err) {
          console.log('Error creating topics:', err);
        } else {
          console.log('Topics created:', data);
          this.initializeConsumer();
        }
      });
    });

    this.producer.on('error', (err) => {
      console.log('Producer error:', err);
    });
  }

  initializeConsumer() {
    this.consumer = new Consumer(
      this.client,
      [{ topic: this.topicName, partition: 0 }],
      { fromOffset: true },
    );

    this.consumer.on('message', async (message) => {
      const job = JSON.parse(message.value as string);
      const chunks = Math.ceil(job.count / 1000);

      for (let i = 0; i < chunks; i++) {
        for (let j = 0; j < Math.min(1000, job.count - i * 1000); j++) {
          console.log(
            `Sending email ${i * 1000 + j + 1}/${job.count} for job ${
              job.jobId
            }`,
          );
        }

        this.io.emit('jobUpdate', { jobId: job.jobId, count: (i + 1) * 1000 });
      }
    });

    this.consumer.on('error', (err) => {
      console.log('Consumer error:', err);
    });
  }
}
