export class PatientId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PatientId {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Patient id is required');
    }

    return new PatientId(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PatientId): boolean {
    return this._value === other._value;
  }
}
