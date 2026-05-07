# Contributing to Zynex

First off, thank you for considering contributing to Zynex! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## 🧠 Our Core Philosophy

Before writing code, please keep the core tenets of Zynex in mind:

1. **Zero Dependencies:** We do not use external NPM packages for validation logic. Everything must be written using native Node.js and JavaScript/TypeScript.
2. **Fluent API:** Validation rules should be chainable.
3. **Graceful Errors:** We never throw exceptions for bad user input; we accumulate them in the `errors` array.

## 🛠️ Local Development Setup

To get the codebase running on your local machine:

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork:**
   ```bash
   git clone https://github.com/Abhinav943/Zynex
   cd Zynex
   ```
   Install dependencies (these are strictly devDependencies like TypeScript and testing frameworks):

```bash
npm install
```

## 🧪 Testing

Zynex is a validation engine, so making sure our logic is bulletproof is the top priority.

Before submitting any Pull Request, you must ensure all tests pass. If you are adding a new validation method, you must include test cases covering both passing and failing scenarios.

```bash
npm run test
```

## 🚀 Submitting a Pull Request

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/my-new-validator
```

Make your changes and commit them using Conventional Commits (e.g., feat:, fix:, docs:):

```bash
git commit -m "feat: add IP address validation method"
```

Push to your fork:

```bash
git push origin feature/my-new-validator
```

Open a Pull Request against the main branch of this repository.

## 💡 Finding Things to Do

If you want to contribute but aren't sure where to start, check out our Issues tab! Look for issues labeled good first issue or help wanted.
