export class PhoneNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PhoneNumber {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Phone number is required');
    }

    const validPattern = /^\+?[0-9()\-\s]{7,20}$/;
    if (!validPattern.test(normalized)) {
      throw new Error('Phone number format is invalid');
    }

    return new PhoneNumber(normalized);
  }

  get value(): string {
    return this._value;
  }
}
