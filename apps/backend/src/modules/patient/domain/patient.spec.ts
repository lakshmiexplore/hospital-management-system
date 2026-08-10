import { Patient, PatientStatus } from './patient';
import { PatientId } from './patient-id';
import { Email } from './email';
import { PhoneNumber } from './phone-number';

describe('Patient aggregate', () => {
  it('creates a valid patient with required fields', () => {
    const patient = Patient.create({
      id: PatientId.create('p-123'),
      firstName: 'Alice',
      lastName: 'Johnson',
      email: Email.create('alice@example.com'),
      phone: PhoneNumber.create('+1234567890'),
      dateOfBirth: new Date('1990-01-15'),
      status: PatientStatus.ACTIVE,
    });

    expect(patient.id.value).toBe('p-123');
    expect(patient.fullName).toBe('Alice Johnson');
    expect(patient.status).toBe(PatientStatus.ACTIVE);
  });

  it('rejects empty first name', () => {
    expect(() =>
      Patient.create({
        id: PatientId.create('p-456'),
        firstName: '',
        lastName: 'Smith',
        email: Email.create('smith@example.com'),
        phone: PhoneNumber.create('+1234567890'),
        dateOfBirth: new Date('1995-05-10'),
        status: PatientStatus.ACTIVE,
      }),
    ).toThrow('First name is required');
  });

  it('marks patient as inactive when status is updated', () => {
    const patient = Patient.create({
      id: PatientId.create('p-789'),
      firstName: 'Bob',
      lastName: 'Brown',
      email: Email.create('bob@example.com'),
      phone: PhoneNumber.create('+1234567890'),
      dateOfBirth: new Date('1988-08-12'),
      status: PatientStatus.ACTIVE,
    });

    patient.deactivate();

    expect(patient.status).toBe(PatientStatus.INACTIVE);
  });
});
