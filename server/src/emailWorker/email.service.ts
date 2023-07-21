import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'server.com',
      port: 587,
      secure: false,
      auth: {
        user: 'username',
        pass: 'password',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: '"Sender Name" <sender@example.com>',
      to: to,
      subject: subject,
      text: text,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  }
}
