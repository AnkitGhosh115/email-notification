import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-email')
  async sendEmail(@Body() sendEmailDto: SendEmailDto): Promise<void> {
    const { to, subject, body } = sendEmailDto;
    await this.notificationService.sendEmailWithRetry(to, subject, body);
  }
}
