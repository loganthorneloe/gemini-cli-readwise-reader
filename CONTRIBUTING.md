# Contributing

Thanks for your interest in improving the Readwise Reader extension! We want to make contributing as easy as possible.

## How to Contribute

### Reporting Bugs
If you find a bug, please [open an issue](https://github.com/loganthorneloe/gemini-cli-readwise-reader/issues). To help us fix it quickly, please include:
- A clear, descriptive title.
- Steps to reproduce the issue.
- What you expected to happen vs. what actually happened.
- Any relevant logs or screenshots.

### Suggesting Features
We love new ideas! Before writing code, please open an issue to describe:
- The problem this feature solves.
- How you imagine it working.
- Any alternative solutions you've considered.

### Pull Requests
1.  **Fork** the repository and create your branch from `main`.
2.  **Install dependencies** with `npm install`.
3.  **Implement your changes**. Ensure you follow the project's TypeScript strict mode.
4.  **Verify your build** by running `npm run build`.
5.  **Commit your changes** using descriptive messages. We recommend [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: ...` or `fix: ...`).
6.  **Submit a PR** with a clear description of your changes and a link to any related issues.

## Style Guidelines

### TypeScript
- This project uses **Strict Mode**. Avoid using `any` unless absolutely necessary.
- Use `async/await` for asynchronous logic.
- Ensure all new tools added to `reader.ts` have proper Zod schemas and TypeScript interfaces.

### Commits
- Use the present tense ("Add feature", not "Added feature").
- Keep the first line short (under 72 characters).

Thanks again for contributing!
