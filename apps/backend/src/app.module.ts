import { Module } from '@nestjs/common';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [AppointmentModule, CalendarModule],
  controllers: [],
  providers: [],
})
export class AppModule {}