import { isValidSyntax } from "./rules/syntax.js";
import { normalizeEmail } from "./rules/normalize.js";
import { suggestCorrection } from "./rules/typos.js";
import { hasMxRecords } from "./network/dnsLookup.js";
import { isDisposable, isRoleBased } from "./data/dataChecks.js";

export interface ValidationError {
  type: string;
  message: string;
  suggestion?: string;
}

export class EmailValidator {
  private email: string;
  private errors: ValidationError[] = [];
  private asyncTasks: (() => Promise<void>)[] = [];

  constructor(email: string) {
    this.email = normalizeEmail(email);
  }


  checkSyntax(customMessage?: string) {
    if (!isValidSyntax(this.email)) {
      this.errors.push({
        type: "invalid_syntax",
        message: customMessage || `The format of '${this.email}' is invalid.`,
      });
    }
    return this;
  }

  checkTypos() {
    const parts = this.email.split("@");
    if (parts.length === 2) {
      const suggestion = suggestCorrection(parts[1]!);
      if (suggestion) {
        this.errors.push({
          type: "possible_typo",
          message: `The domain '${parts[1]}' looks like a typo. Did you mean '${suggestion}'?`,
          suggestion: `${parts[0]}@${suggestion}`,
        });
      }
    }
    return this;
  }

  checkDisposable(customMessage?: string) {
    const parts = this.email.split("@");
    if (parts.length === 2 && isDisposable(parts[1]!)) {
      this.errors.push({
        type: "disposable_email",
        message:
          customMessage ||
          `Temporary or disposable email addresses are not allowed.`,
      });
    }
    return this;
  }

  checkRoleBased(customMessage?: string) {
    const parts = this.email.split("@");
    if (parts.length === 2 && isRoleBased(parts[0]!)) {
      this.errors.push({
        type: "role_based_email",
        message:
          customMessage ||
          `Role-based emails (like ${parts[0]}@) cannot be used to register.`,
      });
    }
    return this;
  }

  checkDNS(customMessage?: string) {
    this.asyncTasks.push(async () => {
      const parts = this.email.split("@");
      if (parts.length === 2) {
        const isValid = await hasMxRecords(parts[1]!);
        if (!isValid) {
          this.errors.push({
            type: "dns_mx_error",
            message:
              customMessage ||
              `The domain '${parts[1]}' cannot receive emails.`,
          });
        }
      }
    });
    return this;
  }


  execute() {
    if (this.asyncTasks.length > 0) {
      console.warn(
        "Warning: You queued async checks (like checkDNS) but called the synchronous execute(). Use executeAsync() instead.",
      );
    }
    return {
      isValid: this.errors.length === 0,
      email: this.email,
      errors: this.errors,
    };
  }

  async executeAsync() {
    for (const task of this.asyncTasks) {
      await task();
    }
    
    this.asyncTasks = [];
    return this.execute();
  }
}

export const checkEmail = (email: string) => new EmailValidator(email);
export { checkPassword, PasswordValidator } from "./password.js";
export { checkURL, URLValidator } from './url.js';
export { checkIP, IPValidator } from './ip.js';
export type { IPError, IPResult } from './ip.js';