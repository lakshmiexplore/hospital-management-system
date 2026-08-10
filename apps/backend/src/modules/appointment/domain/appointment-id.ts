export class AppointmentId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): AppointmentId {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Appointment id is required');
    }

    return new AppointmentId(normalized);
  }

  get value(): string {
    return this._value;
  }
}
