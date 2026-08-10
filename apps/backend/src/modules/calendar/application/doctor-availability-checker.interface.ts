export interface DoctorAvailabilityChecker {
  isDoctorAvailable(doctorId: string, startsAt: Date, endsAt: Date): Promise<boolean>;
}
