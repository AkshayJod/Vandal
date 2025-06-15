# Contributing to VandalHub

Thank you for your interest in contributing to VandalHub! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/vandalhub-platform.git
   cd vandalhub-platform
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend-main
   npm install
   
   # Frontend
   cd ../frontend-main
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment templates
   cp backend-main/.env.example backend-main/.env
   cp frontend-main/.env.example frontend-main/.env
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend-main
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend-main
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use ES6+ features and modern JavaScript
- Follow React functional components with hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent indentation (2 spaces)

### Component Structure
```javascript
// React Component Template
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### CSS Guidelines
- Use BEM naming convention
- Mobile-first responsive design
- Consistent color scheme (GitHub dark theme)
- Use CSS custom properties for theming
- Avoid inline styles

### API Development
- RESTful API design principles
- Proper HTTP status codes
- Consistent error handling
- Input validation and sanitization
- Comprehensive API documentation

## 🐛 Bug Reports

### Before Submitting
- Check existing issues for duplicates
- Test with the latest version
- Provide minimal reproduction steps

### Bug Report Template
```markdown
**Bug Description**
A clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node.js version: [e.g., 16.14.0]
```

## ✨ Feature Requests

### Feature Request Template
```markdown
**Feature Description**
A clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### Before Submitting
1. Create a feature branch from `main`
2. Make your changes with clear commits
3. Test your changes thoroughly
4. Update documentation if needed
5. Ensure all tests pass

### Pull Request Template
```markdown
**Description**
Brief description of changes.

**Type of Change**
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Testing**
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

**Screenshots**
If applicable, add screenshots.

**Checklist**
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process
1. Automated checks must pass
2. Code review by maintainers
3. Address feedback promptly
4. Squash commits before merge

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend-main
npm test

# Frontend tests
cd frontend-main
npm test

# E2E tests
npm run test:e2e
```

### Writing Tests
- Unit tests for utilities and helpers
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows

## 📚 Documentation

### Code Documentation
- JSDoc comments for functions
- README files for complex modules
- Inline comments for complex logic
- API documentation with examples

### User Documentation
- Feature documentation
- Setup and installation guides
- Troubleshooting guides
- FAQ updates

## 🏷️ Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test additions/changes
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add password reset functionality
fix(ui): resolve mobile navigation issue
docs(api): update repository endpoints
style(css): improve button hover states
```

## 🌟 Recognition

### Contributors
All contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation
- Annual contributor highlights

### Contribution Types
- Code contributions
- Documentation improvements
- Bug reports and testing
- Feature suggestions
- Community support

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time community chat
- **Email**: maintainers@vandalhub.com

### Mentorship
- New contributor onboarding
- Code review guidance
- Architecture discussions
- Career development support

## 📄 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other members

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the project maintainers at conduct@vandalhub.com.

## 🎯 Roadmap

### Current Priorities
1. Performance optimization
2. Mobile experience improvements
3. Advanced search functionality
4. Real-time collaboration features
5. API rate limiting and security

### Future Goals
- Plugin system architecture
- Advanced analytics dashboard
- Multi-language support
- Enterprise features
- Cloud deployment options

---

Thank you for contributing to VandalHub! Together, we're building the future of collaborative development platforms. 🚀
