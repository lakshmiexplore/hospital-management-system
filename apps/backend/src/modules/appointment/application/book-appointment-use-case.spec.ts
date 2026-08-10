import { BookAppointmentUseCase } from './book-appointment-use-case';
import { AppointmentRepository } from './appointment-repository.interface';
import { DoctorAvailabilityChecker } from '../../calendar/application/doctor-availability-checker.interface';

describe('BookAppointmentUseCase', () => {
  let appointmentRepository: AppointmentRepository;
  let doctorAvailabilityChecker: DoctorAvailabilityChecker;
  let useCase: BookAppointmentUseCase;

  const startsAt = new Date('2026-08-20T09:00:00Z');
  const endsAt = new Date('2026-08-20T09:30:00Z');

  beforeEach(() => {
    appointmentRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findAll: jest.fn().mockResolvedValue([]),
      updateStatus: jest.fn().mockResolvedValue(null),
      findByDoctorAndTimeRange: jest.fn().mockResolvedValue([]),
    };

    doctorAvailabilityChecker = {
      isDoctorAvailable: jest.fn().mockResolvedValue(true),
    };

    useCase = new BookAppointmentUseCase(appointmentRepository, doctorAvailabilityChecker);
  });

  it('books an appointment when the doctor is available', async () => {
    const appointment = await useCase.execute({
      patientId: 'p-123',
      doctorId: 'doc-9',
      startsAt,
      endsAt,
    });

    expect(doctorAvailabilityChecker.isDoctorAvailable).toHaveBeenCalledWith(
      'doc-9',
      startsAt,
      endsAt,
    );
    expect(appointmentRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        patientId: expect.objectContaining({ value: 'p-123' }),
        doctorId: 'doc-9',
      }),
    );
    expect(appointment.status).toBe('SCHEDULED');
  });

  it('rejects the booking when the doctor is not available', async () => {
    (doctorAvailabilityChecker.isDoctorAvailable as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute({
        patientId: 'p-123',
        doctorId: 'doc-9',
        startsAt,
        endsAt,
      }),
    ).rejects.toThrow('Doctor doc-9 is not available for the selected time slot');

    expect(appointmentRepository.save).not.toHaveBeenCalled();
  });
});
