import { Email } from './email';
import { PatientId } from './patient-id';
import { PhoneNumber } from './phone-number';

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface PatientProps {
  id: PatientId;
  firstName: string;
  lastName: string;
  email: Email;
  phone: PhoneNumber;
  dateOfBirth: Date;
  status: PatientStatus;
}

export class Patient {
  private readonly _id: PatientId;
  private _firstName: string;
  private _lastName: string;
  private readonly _email: Email;
  private readonly _phone: PhoneNumber;
  private readonly _dateOfBirth: Date;
  private _status: PatientStatus;

  private constructor(props: PatientProps) {
    this._id = props.id;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._email = props.email;
    this._phone = props.phone;
    this._dateOfBirth = new Date(props.dateOfBirth);
    this._status = props.status;
  }

  static create(props: PatientProps): Patient {
    Patient.validate(props);

    return new Patient({
      ...props,
      firstName: props.firstName.trim(),
      lastName: props.lastName.trim(),
    });
  }

  private static validate(props: PatientProps): void {
    if (!props.firstName?.trim()) {
      throw new Error('First name is required');
    }

    if (!props.lastName?.trim()) {
      throw new Error('Last name is required');
    }

    if (Number.isNaN(props.dateOfBirth.getTime())) {
      throw new Error('Date of birth is invalid');
    }

    if (props.dateOfBirth > new Date()) {
      throw new Error('Date of birth cannot be in the future');
    }

    if (!Object.values(PatientStatus).includes(props.status)) {
      throw new Error('Patient status is invalid');
    }
  }

  get id(): PatientId {
    return this._id;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`.trim();
  }

  get email(): Email {
    return this._email;
  }

  get phone(): PhoneNumber {
    return this._phone;
  }

  get dateOfBirth(): Date {
    return new Date(this._dateOfBirth);
  }

  get status(): PatientStatus {
    return this._status;
  }

  activate(): void {
    this._status = PatientStatus.ACTIVE;
  }

  deactivate(): void {
    this._status = PatientStatus.INACTIVE;
  }
}
