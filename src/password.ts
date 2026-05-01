export interface PasswordError {
  type: string;
  message: string;
}

export class PasswordValidator {
  private password: string;
  private errors: PasswordError[] = [];
  private score: number = 0;

  constructor(password: string) {
    this.password = password;
  }

  minLength(min: number, customMessage?: string) {
    if (this.password.length < min) {
      this.errors.push({
        type: "min_length_error",
        message:
          customMessage || `Password must be at least ${min} characters long.`,
      });
    }
    return this;
  }

  hasUppercase(customMessage?: string) {
    if (!/[A-Z]/.test(this.password)) {
      this.errors.push({
        type: "uppercase_missing",
        message:
          customMessage ||
          `Password must contain at least one uppercase letter.`,
      });
    }
    return this;
  }

  hasLowercase(customMessage?: string) {
    if (!/[a-z]/.test(this.password)) {
      this.errors.push({
        type: "lowercase_missing",
        message:
          customMessage ||
          `Password must contain at least one lowercase letter.`,
      });
    }
    return this;
  }

  hasNumber(customMessage?: string) {
    if (!/[0-9]/.test(this.password)) {
      this.errors.push({
        type: "number_missing",
        message: customMessage || `Password must contain at least one number.`,
      });
    }
    return this;
  }

  hasSpecialChar(customMessage?: string) {
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) {
      this.errors.push({
        type: "special_char_missing",
        message:
          customMessage ||
          `Password must contain at least one special character.`,
      });
    }
    return this;
  }

  hasNoSpaces(customMessage?: string) {
    if (/\s/.test(this.password)) {
      this.errors.push({
        type: "contains_spaces",
        message: customMessage || `Password cannot contain spaces.`,
      });
    }
    return this;
  }

  private calculateStrength() {
    let currentScore = 0;
    if (this.password.length > 7) currentScore += 1;
    if (this.password.length > 12) currentScore += 1;
    if (/[A-Z]/.test(this.password)) currentScore += 1;
    if (/[0-9]/.test(this.password)) currentScore += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(this.password)) currentScore += 1;

    const finalScore = Math.min(currentScore, 5);

    const labels = [
      "Very Weak",
      "Weak",
      "Fair",
      "Strong",
      "Very Strong",
      "Excellent",
    ];

    return {
      score: finalScore,
      label: labels[finalScore],
    };
  }

  execute() {
    const strength = this.calculateStrength();

    return {
      isValid: this.errors.length === 0,
      passwordLength: this.password.length,
      strength: strength,
      errors: this.errors,
    };
  }
}

export const checkPassword = (password: string) =>
  new PasswordValidator(password);
