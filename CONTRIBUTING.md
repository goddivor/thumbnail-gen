# Contributing to Thumbnail Generator

Thank you for considering contributing to this project! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, browser)

### Suggesting Features

Feature requests are welcome! Please open an issue with:
- A clear description of the feature
- Why this feature would be useful
- Any examples or mockups

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/goddivor/thumbnail-gen.git
   cd thumbnail-gen
   ```

2. **Create a branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes

4. **Commit your changes**

   Use conventional commits format:
   ```bash
   feat: add user authentication
   fix: resolve hydration error
   docs: update installation guide
   style: format code
   refactor: optimize image processing
   test: add upload zone tests
   chore: update dependencies
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Ensure all tests pass
   - Wait for review

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Add your GOOGLE_GENERATIVE_AI_API_KEY
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable and function names
- Keep components small and focused
- Write comments for complex logic

## Testing

Before submitting a PR:
- Test your changes locally
- Ensure the build passes: `npm run build`
- Check for TypeScript errors
- Test in both light and dark themes

## Questions?

Feel free to open an issue for any questions or clarifications.

Thank you for contributing! 🎉
