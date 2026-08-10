export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    const normalized = value?.trim();

    if (!normalized) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalized)) {
      throw new Error('Email format is invalid');
    }

    return new Email(normalized.toLowerCase());
  }

  get value(): string {
    return this._value;
  }
}
