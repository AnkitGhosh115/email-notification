import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private primaryTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.PRIMARY_EMAIL,
      pass: process.env.PRIMARY_PASSWORD,
    },
  });

  private backupTransporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
      user: process.env.BACKUP_EMAIL,
      pass: process.env.BACKUP_PASSWORD,
    },
  });

  private retryCount = 0;

  async sendEmailWithRetry(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.primaryTransporter.sendMail({
        from: process.env.PRIMARY_EMAIL,
        to,
        subject,
        text: body,
      });
      console.log('Email sent successfully');
      this.retryCount = 0; // Reset the retry count on success
    } catch (error) {
      console.error('Failed to send email:', error.message);
      this.retryCount++;
      if (this.retryCount <= 3) {
        console.log(`Retry ${this.retryCount}: Retrying email send...`);
        await this.sendEmailWithRetry(to, subject, body);
      } else {
        console.log('Switching to backup email service...');
        await this.backupTransporter.sendMail({
          from: process.env.BACKUP_EMAIL,
          to,
          subject,
          text: body,
        });
      }
    }
  }
}
