import { Module } from '@nestjs/common';
import { CalendarController } from './presentation/calendar.controller';

@Module({
  controllers: [CalendarController],
  providers: [],
})
export class CalendarModule {}
