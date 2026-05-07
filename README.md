<div align="center">

# Zynex

**A zero-dependency, detailed validation engine for Node.js and TypeScript.**

[![npm version](https://img.shields.io/npm/v/@abhinav943/zynex.svg?style=flat-square)](https://www.npmjs.com/package/@abhinav943/zynex)
[![npm downloads](https://img.shields.io/npm/dm/@abhinav943/zynex.svg?style=flat-square)](https://www.npmjs.com/package/@abhinav943/zynex)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg?style=flat-square)](https://opensource.org/licenses/ISC)
[![minzipped size](https://badgen.net/bundlephobia/minzip/@abhinav943/zynex)](https://bundlephobia.com/package/@abhinav943/zynex)
[![dependency count](https://badgen.net/bundlephobia/dependency-count/@abhinav943/zynex)](https://bundlephobia.com/package/@abhinav943/zynex)
[![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@abhinav943/zynex)](https://bundlephobia.com/package/@abhinav943/zynex)
[![View on GitHub](https://img.shields.io/badge/GitHub-Zynex-blue?logo=github)](https://github.com/Abhinav943/Zynex)
[![Tests](https://img.shields.io/badge/tests-31%20passed-brightgreen.svg?style=flat-square)](https://github.com/Abhinav943/Zynex/actions)

Zynex replaces messy Regex blocks with a fluent, chainable API. Instead of just returning `false` when a validation fails, Zynex returns a structured array of detailed errors, allowing you to tell your users exactly _why_ their input was rejected.

</div>

---

## Table of Contents

- [Why Zynex?](#-why-zynex)
- [Installation](#-installation)
- [Core Concept](#-core-concept)
- [Usage Examples](#-usage-examples)
  - [Email Validation](#1-email-validation)
  - [Password Validation](#2-password-validation)
  - [URL Validation](#3-url-validation)
- [API Reference](#-api-reference)
- [TypeScript Support](#-typescript-support)
- [License](#-license)

---

## Why Zynex?

- **Chainable & Fluent API:** Build complex validation rules exactly how you think about them.
- **Graceful Error Stacking:** Zynex does _not_ throw exceptions. It safely accumulates errors and returns them in a structured format, perfect for UI feedback.
- **Async Network Checks:** Go beyond basic syntax. Run active DNS and MX record queries to ensure emails and URLs actually exist on the internet.
- **Zero Dependencies:** Extremely lightweight. Keeps your `node_modules` tiny and secure.
- **100% Type-Safe:** Written entirely in TypeScript for first-class autocompletion and strict type definitions out of the box.

---

## Installation

Install Zynex using your preferred package manager:

```bash
# Using npm
npm install @abhinav943/zynex

# Using yarn
yarn add @abhinav943/zynex

# Using pnpm
pnpm add @abhinav943/zynex
```

---

## Core Concept

Every validator in Zynex follows a simple three-step lifecycle:

1. **Initialize:** Call the validator with the target string (e.g., `checkPassword('myPass')`).
2. **Chain Rules:** Attach your desired conditions (e.g., `.min(8).requireUppercase()`).
3. **Execute:** Call `.execute()` for purely synchronous rules, or `.executeAsync()` if your chain includes network checks (like DNS/MX lookups).

The final execution always returns a consistent `ValidationResult` object:

```typescript
{
  isValid: boolean;
  value: string; // The inputted (or normalized) string
  errors: Array<{
    type: string;
    message: string;
  }>;
}
```

---

## 🛡️ Battle-Tested

Zynex is built with reliability as the top priority. The engine is fully tested using **Vitest**, covering both synchronous logic and asynchronous network checks (DNS/MX lookups).

We ensure that every validation rule, custom error message, and async fallback behaves predictably before any release.

---

## Usage Examples

### 1. Email Validation

Go beyond regex. Check for syntax, block disposable emails (like Mailinator), and query actual mail servers.

```typescript
import { checkEmail } from "@abhinav943/zynex";

async function validateUserRegistration(emailInput: string) {
  // Normalization (trimming and lowercasing) happens automatically!
  const result = await checkEmail(emailInput)
    .checkSyntax() // Validates standard email formatting
    .checkDisposable() // Blocks temporary/burner emails
    .checkRoleBased() // Blocks admin@, support@, etc.
    .checkTypos() // Suggests 'gmail.com' if user typed 'gmial.com'
    .checkDNS() // [ASYNC] Verifies the domain can actually receive mail
    .executeAsync();

  console.log(result);
}
```

### 2. Password Validation

Enforce strong security policies while giving users exact feedback on what they are missing.

```typescript
import { checkPassword } from "@abhinav943/zynex";

function validateNewPassword(passwordInput: string) {
  // Purely synchronous checks use .execute()
  const result = checkPassword(passwordInput)
    .minLength(8)
    .hasUppercase()
    .hasLowercase()
    .hasNumber()
    .hasSpecialChar()
    .hasNoSpaces()
    .execute();

  if (!result.isValid) {
    result.errors.forEach((err) =>
      console.error(`[${err.type}]: ${err.message}`),
    );
  } else {
    console.log(
      `Password Strength: ${result.strength.label} (${result.strength.score}/5)`,
    );
  }
}
```

Example output for a weak password:

```json
{
  "isValid": false,
  "value": "weak",
  "errors": [
    {
      "type": "MIN_LENGTH",
      "message": "Password must be at least 8 characters long."
    },
    {
      "type": "UPPERCASE_REQUIRED",
      "message": "Password must contain at least one uppercase letter."
    },
    {
      "type": "NUMBER_REQUIRED",
      "message": "Password must contain at least one number."
    }
  ]
}
```

### 3. URL Validation

Validate links, ensure secure protocols, and verify domain reachability.

```typescript
import { checkURL } from "@abhinav943/zynex";

async function validateProfileLink(urlInput: string) {
  const result = await checkURL(urlInput)
    .isValid()
    .requireHTTPS()
    .allowedDomains(["github.com", "linkedin.com"]) // Restrict to specific hosts
    .checkDNS() // [ASYNC] Verifies the host resolves on the network
    .executeAsync();

  console.log(result);
}
```

---

## API Reference

_Tip: Almost every method in Zynex accepts an optional customMessage string as its final argument so you can override the default error text!_

### `checkEmail(email: string)`

| Method               | Type  | Description                                                                  |
| -------------------- | ----- | ---------------------------------------------------------------------------- |
| `.checkSyntax()`     | Sync  | Validates standard email formatting using RFC-compliant logic.               |
| `.checkDisposable()` | Sync  | Fails if the domain belongs to known temporary email providers.              |
| `.checkRoleBased()`  | Sync  | Fails if the local part is a generic role (e.g., admin, info).               |
| `.checkTypos()`      | Sync  | Returns a suggested domain if a common typo is detected (e.g., gamil.com).   |
| `.checkDNS()`        | Async | Performs a DNS lookup to verify the domain has active Mail Exchange records. |

_(Note: Normalization, such as trimming and lowercasing, is handled automatically upon initialization)._

### `checkPassword(password: string)`

| Method                       | Type | Description                                              |
| ---------------------------- | ---- | -------------------------------------------------------- |
| `.minLength(length: number)` | Sync | Enforces a minimum character length.                     |
| `.hasUppercase()`            | Sync | Requires at least one uppercase letter (A-Z).            |
| `.hasLowercase()`            | Sync | Requires at least one lowercase letter (a-z).            |
| `.hasNumber()`               | Sync | Requires at least one numeric digit (0-9).               |
| `.hasSpecialChar()`          | Sync | Requires at least one special character (e.g., @, #, !). |
| `.hasNoSpaces()`             | Sync | Fails if the password contains spaces.                   |

### `checkURL(url: string)`

| Method                  | Type  | Description                                                         |
| ----------------------- | ----- | ------------------------------------------------------------------- |
| `.isValid()`            | Sync  | Parses the string to ensure it is a structurally valid URL.         |
| `.requireHTTPS()`       | Sync  | Fails if the protocol is not `https:`.                              |
| `.allowedDomains(list)` | Sync  | Restricts the URL to an array of specific hostnames.                |
| `.checkDNS()`           | Async | Performs a network lookup to ensure the hostname actually resolves. |

---

## TypeScript Support

Zynex exports its core interfaces so you can strongly type your functions and UI components:

```typescript
import type {
  ValidationError,
  PasswordError,
  URLError,
  EmailValidator,
  PasswordValidator,
  URLValidator,
} from "@abhinav943/zynex";
```

---

## 🤝 Contributing

We welcome community contributions! Whether you want to add a new zero-dependency validator, fix a bug, or improve the documentation, we'd love your help.

To ensure a smooth process, we have standardized our testing and Pull Request submission rules. Please read our [Contributing Guide](CONTRIBUTING.md) before opening a PR to see how to run the test suite and format your code.

---

## License

This project is open-source and available under the [ISC License](LICENSE). Feel free to use it in your personal and commercial projects!
