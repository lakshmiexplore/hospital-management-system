import { Injectable } from '@nestjs/common';
import { AppointmentStatus as PrismaAppointmentStatus, PatientStatus } from '@prisma/client';
import {
  AppointmentListItem,
  AppointmentRepository,
  PatientRecordInput,
} from '../../application/appointment-repository.interface';
import { Appointment, AppointmentStatus } from '../../domain/appointment';
import { AppointmentId } from '../../domain/appointment-id';
import { PatientId } from '../../../patient/domain/patient-id';
import { PrismaService } from '../../../../shared/prisma/prisma.service';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(appointment: Appointment, patientRecordInput?: PatientRecordInput): Promise<void> {
    const candidatePatientId = appointment.patientId.value;
    const email = patientRecordInput?.email?.trim();
    const firstName = patientRecordInput?.firstName?.trim() || 'Guest';
    const lastName = patientRecordInput?.lastName?.trim() || 'Patient';

    const patientByEmail = email
      ? await this.prisma.patient.findUnique({ where: { email } })
      : null;

    const patientById = await this.prisma.patient.findUnique({
      where: { id: candidatePatientId },
    });

    const patientRecord =
      patientByEmail ??
      patientById ??
      (await this.prisma.patient.create({
        data: {
          id: candidatePatientId,
          firstName,
          lastName,
          email: email || `${candidatePatientId}@hospital.local`,
          phone: null,
          dateOfBirth: new Date('2000-01-01T00:00:00.000Z'),
          status: PatientStatus.ACTIVE,
        },
      }));

    const existingDoctor = await this.prisma.doctor.findUnique({
      where: { id: appointment.doctorId },
    });

    if (!existingDoctor) {
      const doctorIdentifier = appointment.doctorId
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      const fallbackFirstName =
        doctorIdentifier[0]?.replace(/^./, (char) => char.toUpperCase()) || 'Doctor';
      const fallbackLastName =
        doctorIdentifier.slice(1).join(' ') || 'Provider';

      await this.prisma.doctor.create({
        data: {
          id: appointment.doctorId,
          firstName: fallbackFirstName,
          lastName: fallbackLastName,
          email: `doctor_${appointment.doctorId}@hospital.com`,
          specialty: 'General',
          phone: null,
          status: 'ACTIVE',
        },
      });
    }

    await this.prisma.appointment.create({
      data: {
        id: appointment.id.value,
        patientId: patientRecord.id,
        doctorId: appointment.doctorId,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        status: appointment.status as PrismaAppointmentStatus,
      },
    });
  }

  async findAll(doctorId?: string): Promise<AppointmentListItem[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: doctorId ? { doctorId } : undefined,
      include: {
        patient: true,
        doctor: true,
      },
      orderBy: { startsAt: 'asc' },
    });

    return appointments.map((record) => ({
      id: record.id,
      patientId: record.patientId,
      doctorId: record.doctorId,
      startsAt: record.startsAt,
      endsAt: record.endsAt,
      status: record.status as AppointmentStatus,
      patientName: `${record.patient.firstName} ${record.patient.lastName}`.trim(),
      patientEmail: record.patient.email,
      doctorName: record.doctor
        ? `${record.doctor.firstName} ${record.doctor.lastName}`.trim()
        : record.doctorId,
      doctor: record.doctor
        ? {
            id: record.doctor.id,
            firstName: record.doctor.firstName,
            lastName: record.doctor.lastName,
          }
        : null,
    }));
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentListItem | null> {
    const updatedRecord = await this.prisma.appointment.update({
      where: { id },
      data: { status: status as PrismaAppointmentStatus },
      include: {
        patient: true,
        doctor: true,
      },
    });

    return {
      id: updatedRecord.id,
      patientId: updatedRecord.patientId,
      doctorId: updatedRecord.doctorId,
      startsAt: updatedRecord.startsAt,
      endsAt: updatedRecord.endsAt,
      status: updatedRecord.status as AppointmentStatus,
      patientName: `${updatedRecord.patient.firstName} ${updatedRecord.patient.lastName}`.trim(),
      patientEmail: updatedRecord.patient.email,
      doctorName: `${updatedRecord.doctor.firstName} ${updatedRecord.doctor.lastName}`.trim(),
    };
  }

  async findByDoctorAndTimeRange(
    doctorId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
    });

    return appointments.map((record) => this.mapRecord(record));
  }

  private mapRecord(record: {
    id: string;
    patientId: string;
    doctorId: string;
    startsAt: Date;
    endsAt: Date;
    status: PrismaAppointmentStatus;
  }): Appointment {
    return Appointment.create({
      id: AppointmentId.create(record.id),
      patientId: PatientId.create(record.patientId),
      doctorId: record.doctorId,
      startsAt: record.startsAt,
      endsAt: record.endsAt,
      status: record.status as AppointmentStatus,
    });
  }
}
