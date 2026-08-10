import { PatientId } from '../../patient/domain/patient-id';
import { AppointmentId } from './appointment-id';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface AppointmentProps {
  id: AppointmentId;
  patientId: PatientId;
  doctorId: string;
  startsAt: Date;
  endsAt: Date;
  status: AppointmentStatus;
}

export class Appointment {
  private readonly _id: AppointmentId;
  private readonly _patientId: PatientId;
  private readonly _doctorId: string;
  private readonly _startsAt: Date;
  private readonly _endsAt: Date;
  private _status: AppointmentStatus;

  private constructor(props: AppointmentProps) {
    this._id = props.id;
    this._patientId = props.patientId;
    this._doctorId = props.doctorId.trim();
    this._startsAt = new Date(props.startsAt);
    this._endsAt = new Date(props.endsAt);
    this._status = props.status;
  }

  static create(props: AppointmentProps): Appointment {
    Appointment.validate(props);

    return new Appointment(props);
  }

  private static validate(props: AppointmentProps): void {
    if (!props.doctorId?.trim()) {
      throw new Error('Doctor id is required');
    }

    if (Number.isNaN(props.startsAt.getTime())) {
      throw new Error('Appointment start time is invalid');
    }

    if (Number.isNaN(props.endsAt.getTime())) {
      throw new Error('Appointment end time is invalid');
    }

    if (props.endsAt <= props.startsAt) {
      throw new Error('Appointment end time must be after start time');
    }

    if (!Object.values(AppointmentStatus).includes(props.status)) {
      throw new Error('Appointment status is invalid');
    }
  }

  get id(): AppointmentId {
    return this._id;
  }

  get patientId(): PatientId {
    return this._patientId;
  }

  get doctorId(): string {
    return this._doctorId;
  }

  get startsAt(): Date {
    return new Date(this._startsAt);
  }

  get endsAt(): Date {
    return new Date(this._endsAt);
  }

  get durationMinutes(): number {
    return Math.round((this._endsAt.getTime() - this._startsAt.getTime()) / 60000);
  }

  get status(): AppointmentStatus {
    return this._status;
  }

  complete(): void {
    this._status = AppointmentStatus.COMPLETED;
  }

  cancel(): void {
    this._status = AppointmentStatus.CANCELLED;
  }
}
