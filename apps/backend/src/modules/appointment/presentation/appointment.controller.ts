import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { BookAppointmentUseCase, AppointmentBookingConflictError } from '../application/book-appointment-use-case';
import { PrismaAppointmentRepository } from '../infrastructure/repositories/prisma-appointment.repository';
import { AppointmentStatus } from '../domain/appointment';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly bookAppointmentUseCase: BookAppointmentUseCase,
    private readonly appointmentRepository: PrismaAppointmentRepository,
  ) {}

  @Get()
  async getAppointments(@Query('doctorId') doctorId?: string) {
    const appointments = await this.appointmentRepository.findAll(doctorId);

    return appointments.map((appointment) => ({
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      status: appointment.status,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      doctorName: appointment.doctorName,
      doctor: appointment.doctor
        ? {
            id: appointment.doctor.id,
            firstName: appointment.doctor.firstName,
            lastName: appointment.doctor.lastName,
          }
        : null,
    }));
  }

  @Patch(':id/cancel')
  async cancelAppointment(@Param('id') id: string) {
    const appointment = await this.appointmentRepository.updateStatus(id, AppointmentStatus.CANCELLED);

    if (!appointment) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      startsAt: appointment.startsAt,
      endsAt: appointment.endsAt,
      status: appointment.status,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      doctorName: appointment.doctorName,
    };
  }

  @Post()
  async bookAppointment(@Body() dto: BookAppointmentDto) {
    try {
      const appointment = await this.bookAppointmentUseCase.execute({
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        startsAt: new Date(dto.startsAt),
        endsAt: new Date(dto.endsAt),
        patientEmail: dto.patientEmail,
        patientName: dto.patientName,
      });

      return {
        id: appointment.id.value,
        patientId: appointment.patientId.value,
        doctorId: appointment.doctorId,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        status: appointment.status,
      };
    } catch (error) {
      if (error instanceof AppointmentBookingConflictError) {
        throw new ConflictException(error.message);
      }

      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }
}
