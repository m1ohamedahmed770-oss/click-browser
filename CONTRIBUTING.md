# Contributing to Click Browser

Thank you for your interest in contributing to Click Browser! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a welcoming community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/click_browser/issues)
2. If not, create a new issue with:
   - Clear title describing the bug
   - Detailed description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Check existing [Issues](https://github.com/yourusername/click_browser/issues) and [Discussions](https://github.com/yourusername/click_browser/discussions)
2. Create a new issue with:
   - Clear title
   - Detailed description of the feature
   - Use cases and benefits
   - Possible implementation approach (optional)

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/click_browser.git
   cd click_browser
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Make your changes**
   - Follow the code style guidelines below
   - Write clear, descriptive commit messages
   - Add tests for new functionality
   - Update documentation as needed

5. **Run tests and checks**
   ```bash
   pnpm test
   pnpm check
   pnpm format
   ```

6. **Commit and push**
   ```bash
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Link related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

## Code Style Guidelines

### TypeScript
- Use strict mode
- Avoid `any` types when possible
- Use meaningful variable names
- Add JSDoc comments for public functions

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript for prop types
- Follow the existing component structure

### File Organization
```
client/src/
├── pages/        # Page-level components
├── components/   # Reusable UI components
├── lib/          # Utilities and helpers
├── contexts/     # React contexts
└── hooks/        # Custom hooks
```

### Naming Conventions
- Components: PascalCase (e.g., `Dashboard.tsx`)
- Functions/variables: camelCase (e.g., `handleCreateTask`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- CSS classes: kebab-case (e.g., `task-card`)

## Development Workflow

### Setting Up Development Environment

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Initialize database**
   ```bash
   pnpm db:push
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

### Database Changes

1. Update schema in `drizzle/schema.ts`
2. Run migrations:
   ```bash
   pnpm db:push
   ```
3. Update database helpers in `server/db.ts`
4. Update API routes in `server/routers.ts`

### Adding New Features

1. Create feature branch
2. Update database schema if needed
3. Add backend logic (db helpers, routes)
4. Add frontend components
5. Write tests
6. Update documentation
7. Submit PR

## Testing

### Running Tests
```bash
pnpm test
```

### Writing Tests
- Use Vitest for unit tests
- Place tests next to source files
- Name test files with `.test.ts` extension
- Test both happy paths and error cases

Example:
```typescript
import { describe, it, expect } from "vitest";

describe("myFunction", () => {
  it("should return expected result", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });
});
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments to functions
- Include examples for new features
- Update API documentation
- Keep CHANGELOG.md updated

## Commit Messages

Follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` test additions/changes
- `chore:` build, dependencies, etc.

Examples:
```
feat: add task scheduling system
fix: resolve bookmark deletion issue
docs: update API documentation
refactor: simplify agent execution logic
```

## Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass
   - Run type checking
   - Format code
   - Update documentation

2. **PR description should include:**
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Any breaking changes
   - Related issues/PRs

3. **Review process:**
   - At least one maintainer review required
   - Address feedback and suggestions
   - Keep commits clean and organized

## Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create git tag
4. Push to main branch
5. Create GitHub release

## Getting Help

- Check existing documentation
- Search closed issues for similar problems
- Ask in GitHub Discussions
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Click Browser! 🚀
