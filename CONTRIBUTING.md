# Contributing to Zynex

First off, thank you for considering contributing to Zynex! It's people like you that make open-source software such a great community.

Zynex is designed to be a zero-dependency, type-safe, and highly rigorous validation engine. To maintain this standard, we have a strict automated pipeline. Please read this guide to understand our development workflow before submitting a Pull Request.

## 🧠 Core Philosophy

- **Zero Dependencies**: The core library must never rely on third-party NPM packages for production logic. (devDependencies for testing and linting are fine).
- **Type Safety**: All features must include strict TypeScript interfaces. The use of `any` or `// @ts-ignore` is strictly prohibited.
- **Fluent API**: Validation should be chainable and return our standard `{ isValid: boolean, errors: ValidationError[] }` object.

## 🛠️ Local Setup

1. Fork the repository and clone it to your local machine.
2. Install the development dependencies:

```bash
npm install
```

3. Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
```

## 🧪 Testing Standards

Zynex operates with an iron-clad testing architecture. Your Pull Request will be automatically blocked by our CI pipeline if it lowers the repository's test coverage below 95%.

We use two types of testing:

1. **Unit Tests (Vitest)**  
   Every new feature requires a standard unit test testing both valid and invalid "happy paths."

```bash
# Run the test suite and check your coverage
npm run test:coverage
```

2. **The "Chaos Engine" (Property-Based Fuzzing)**  
   We use fast-check to fuzz the engine with thousands of randomized strings. If you add a new validator, you must register a generator for it in `src/test/fuzzer-registry.ts`.

```bash
# Run the test suite (the Chaos Engine runs automatically)
npm run test
```

## 💅 Formatting & Linting

You do not need to worry about formatting your code manually. Zynex uses Prettier and ESLint, powered by automated Husky pre-commit hooks.

When you attempt to commit your code, our hooks will automatically format your files and check for logic errors (like unused variables). If your code fails the logic check, the commit will be aborted.

You can run these checks manually at any time:

```bash
# Auto-format your code
npm run format

# Run ESLint logic checks
npm run format:check
```

## 📝 Commit Message Guidelines

We enforce the Conventional Commits standard using commitlint. Your commit messages must follow this exact structure, or the Husky pre-commit hook will reject them:

```
type(scope?): description
```

**Valid Types:**

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process, auxiliary tools, or configuration

**Examples:**

- `feat(email): add support for validating custom top-level domains`
- `fix(ip): handle empty strings without throwing fatal error`
- `chore: update github action node versions`

## 🚀 Pull Request Process

1. Ensure your code passes `npm run test:coverage` and `npm run format:check`.
2. Push your branch to your fork and open a Pull Request against the main branch.
3. **AI Review**: Our automated co-maintainer (@coderabbitai) will conduct an initial review of your code. Please address any comments it leaves.
4. **CI Pipeline**: GitHub Actions will run our test suite, coverage checks, and formatting rules.
5. **Human Review**: Once the bots turn green, a core maintainer will review your logic and merge your feature!

Thank you for helping us build an uncrashable validation engine!
