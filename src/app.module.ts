import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ConfigModule.forRoot(), NotificationModule],
})
export class AppModule {}
