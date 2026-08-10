import { Appointment, AppointmentStatus } from '../domain/appointment';
import { AppointmentId } from '../domain/appointment-id';
import { PatientId } from '../../patient/domain/patient-id';
import { AppointmentRepository } from './appointment-repository.interface';
import { DoctorAvailabilityChecker } from '../../calendar/application/doctor-availability-checker.interface';

export interface BookAppointmentCommand {
  patientId: string;
  doctorId: string;
  startsAt: Date;
  endsAt: Date;
  patientEmail?: string;
  patientName?: string;
}

export class AppointmentBookingConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppointmentBookingConflictError';
  }
}

export class BookAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly doctorAvailabilityChecker: DoctorAvailabilityChecker,
  ) {}

  async execute(command: BookAppointmentCommand): Promise<Appointment> {
    const isAvailable = await this.doctorAvailabilityChecker.isDoctorAvailable(
      command.doctorId,
      command.startsAt,
      command.endsAt,
    );

    if (!isAvailable) {
      throw new AppointmentBookingConflictError(
        `Doctor ${command.doctorId} is not available for the selected time slot`,
      );
    }

    const appointment = Appointment.create({
      id: AppointmentId.create(`apt-${Date.now()}`),
      patientId: PatientId.create(command.patientId),
      doctorId: command.doctorId,
      startsAt: command.startsAt,
      endsAt: command.endsAt,
      status: AppointmentStatus.SCHEDULED,
    });

    const patientName = command.patientName?.trim() ?? '';
    const hasPatientMetadata = Boolean(command.patientEmail || patientName);

    const patientRecordInput = hasPatientMetadata
      ? {
          patientId: command.patientId,
          email: command.patientEmail,
          firstName: patientName ? patientName.split(/\s+/)[0] : 'Guest',
          lastName: patientName ? patientName.split(/\s+/).slice(1).join(' ') || 'Patient' : 'Patient',
        }
      : undefined;

    if (patientRecordInput) {
      await this.appointmentRepository.save(appointment, patientRecordInput);
      return appointment;
    }

    await this.appointmentRepository.save(appointment);
    return appointment;
  }
}
