import { Module } from '@nestjs/common';
import { AppointmentController } from './presentation/appointment.controller';
import { BookAppointmentUseCase } from './application/book-appointment-use-case';
import { CalendarModule } from '../calendar/calendar.module';
import { PrismaAppointmentRepository } from './infrastructure/repositories/prisma-appointment.repository';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Module({
  imports: [CalendarModule],
  controllers: [AppointmentController],
  providers: [
    PrismaService,
    PrismaAppointmentRepository,
    {
      provide: BookAppointmentUseCase,
      useFactory: (appointmentRepository: PrismaAppointmentRepository) =>
        new BookAppointmentUseCase(appointmentRepository, {
          async isDoctorAvailable() {
            return true;
          },
        }),
      inject: [PrismaAppointmentRepository],
    },
  ],
})
export class AppointmentModule {}
