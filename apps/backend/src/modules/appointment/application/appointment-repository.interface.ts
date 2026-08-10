import { Appointment, AppointmentStatus } from '../domain/appointment';

export interface PatientRecordInput {
  patientId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface AppointmentDoctorSummary {
  id: string;
  firstName: string;
  lastName: string;
}

export interface AppointmentListItem {
  id: string;
  patientId: string;
  doctorId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
  patientName?: string;
  patientEmail?: string;
  doctorName?: string;
  doctor?: AppointmentDoctorSummary | null;
}

export interface AppointmentRepository {
  save(appointment: Appointment, patientRecordInput?: PatientRecordInput): Promise<void>;
  findAll(doctorId?: string): Promise<AppointmentListItem[]>;
  updateStatus(id: string, status: AppointmentStatus): Promise<AppointmentListItem | null>;
  findByDoctorAndTimeRange(
    doctorId: string,
    startsAt: Date,
    endsAt: Date,
  ): Promise<Appointment[]>;
}
