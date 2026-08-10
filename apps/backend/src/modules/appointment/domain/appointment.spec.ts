import { Appointment, AppointmentStatus } from './appointment';
import { AppointmentId } from './appointment-id';
import { PatientId } from '../../patient/domain/patient-id';

describe('Appointment aggregate', () => {
  it('creates a valid appointment', () => {
    const startsAt = new Date('2026-08-20T09:00:00Z');
    const endsAt = new Date('2026-08-20T09:30:00Z');

    const appointment = Appointment.create({
      id: AppointmentId.create('apt-1'),
      patientId: PatientId.create('p-123'),
      doctorId: 'doc-12',
      startsAt,
      endsAt,
      status: AppointmentStatus.SCHEDULED,
    });

    expect(appointment.id.value).toBe('apt-1');
    expect(appointment.patientId.value).toBe('p-123');
    expect(appointment.durationMinutes).toBe(30);
  });

  it('rejects end time before start time', () => {
    expect(() =>
      Appointment.create({
        id: AppointmentId.create('apt-2'),
        patientId: PatientId.create('p-456'),
        doctorId: 'doc-12',
        startsAt: new Date('2026-08-20T09:30:00Z'),
        endsAt: new Date('2026-08-20T09:00:00Z'),
        status: AppointmentStatus.SCHEDULED,
      }),
    ).toThrow('Appointment end time must be after start time');
  });

  it('marks appointment as completed', () => {
    const appointment = Appointment.create({
      id: AppointmentId.create('apt-3'),
      patientId: PatientId.create('p-789'),
      doctorId: 'doc-12',
      startsAt: new Date('2026-08-20T10:00:00Z'),
      endsAt: new Date('2026-08-20T10:30:00Z'),
      status: AppointmentStatus.SCHEDULED,
    });

    appointment.complete();

    expect(appointment.status).toBe(AppointmentStatus.COMPLETED);
  });
});
