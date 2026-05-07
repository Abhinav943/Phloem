import { describe, test, expect } from "vitest";
import { checkPassword } from "../password.js";

describe("PasswordValidator", () => {
  describe(".minLength()", () => {
    test("should pass when password meets minimum length", () => {
      const result = checkPassword("12345678").minLength(8).execute();
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test("should fail when password is too short", () => {
      const result = checkPassword("1234567").minLength(8).execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("min_length_error");
    });
  });

  describe(".hasUppercase()", () => {
    test("should pass when password contains an uppercase letter", () => {
      const result = checkPassword("passWord").hasUppercase().execute();
      expect(result.isValid).toBe(true);
    });

    test("should fail when password lacks an uppercase letter", () => {
      const result = checkPassword("password").hasUppercase().execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("uppercase_missing");
    });
  });

  describe(".hasLowercase()", () => {
    test("should pass when password contains a lowercase letter", () => {
      const result = checkPassword("PASSWORDa").hasLowercase().execute();
      expect(result.isValid).toBe(true);
    });

    test("should fail when password lacks a lowercase letter", () => {
      const result = checkPassword("PASSWORD").hasLowercase().execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("lowercase_missing");
    });
  });

  describe(".hasNumber()", () => {
    test("should pass when password contains a number", () => {
      const result = checkPassword("Password123").hasNumber().execute();
      expect(result.isValid).toBe(true);
    });

    test("should fail when password lacks a number", () => {
      const result = checkPassword("Password").hasNumber().execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("number_missing");
    });
  });

  describe(".hasSpecialChar()", () => {
    test("should pass when password contains a special character", () => {
      const result = checkPassword("Password!").hasSpecialChar().execute();
      expect(result.isValid).toBe(true);
    });

    test("should fail when password lacks a special character", () => {
      const result = checkPassword("Password123").hasSpecialChar().execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("special_char_missing");
    });
  });

  describe(".hasNoSpaces()", () => {
    test("should pass when password has no spaces", () => {
      const result = checkPassword("Password!").hasNoSpaces().execute();
      expect(result.isValid).toBe(true);
    });

    test("should fail when password contains spaces", () => {
      const result = checkPassword("Pass word!").hasNoSpaces().execute();
      expect(result.isValid).toBe(false);
      expect(result.errors[0].type).toBe("contains_spaces");
    });
  });

  describe("Strength Calculation", () => {
    test("should correctly calculate a Very Strong password", () => {
      const result = checkPassword("SuperSecret123!").execute();
      // Length > 12 (+2), Upper (+1), Number (+1), Special (+1) = 5
      expect(result.strength.score).toBe(5);
      expect(result.strength.label).toBe("Excellent");
    });
  });
});
