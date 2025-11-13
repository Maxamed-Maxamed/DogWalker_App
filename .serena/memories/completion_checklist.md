# Dog Walker App - Task Completion Checklist

## After Making Code Changes

### Step 1: Code Quality Analysis (CRITICAL)
After editing any file, immediately run Codacy analysis:

```bash
# Analyze the specific file(s) you edited
codacy-cli-analyze analyze --file <edited-file-path>

# Check for security vulnerabilities in dependencies
codacy-cli-analyze analyze --tool trivy
```

**Required Actions:**
- Fix all Critical and High severity issues
- Address Security issues immediately
- Review and fix Medium issues if applicable
- Document Low issues if intentional

### Step 2: Linting & Formatting
```bash
# Check ESLint compliance
pnpm lint

# Auto-format code
pnpm prettier --write <edited-files>

# Type check
pnpm tsc --noEmit
```

### Step 3: Testing (When Applicable)
```bash
# Run relevant unit tests
pnpm test <test-file>

# Check test coverage
pnpm test:coverage
```

### Step 4: Manual Verification
- [ ] Code reads naturally and follows conventions
- [ ] No unused variables or imports
- [ ] Error handling is comprehensive
- [ ] Types are explicit (no implicit `any`)
- [ ] Component props are documented
- [ ] Styles follow theme system
- [ ] Performance optimizations applied (memoization, etc.)

### Step 5: Git Workflow
```bash
# Review changes
git diff

# Stage files
git add .

# Commit with descriptive message
git commit -m "feat/fix: <description>"

# Push to feature branch
git push origin feature/<branch-name>
```

### Step 6: Commit Message Format
Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructuring (no behavior change)
- `docs:` - Documentation updates
- `chore:` - Maintenance, deps, config
- `style:` - Formatting, not affecting behavior
- `test:` - Test-related changes

Example: `feat: add error boundary to dashboard component`

### Step 7: Documentation Updates
- [ ] Update component JSDoc if interface changes
- [ ] Update README if adding major feature
- [ ] Update architecture docs if changing structure
- [ ] Add inline comments for complex logic
- [ ] Update .env.example if adding env vars

## Checklist for Architecture Changes

### Before Making Major Changes
1. [ ] Check if existing patterns support use case
2. [ ] Document rationale in ADR (Architecture Decision Record)
3. [ ] Discuss with team if applicable
4. [ ] Check for breaking changes

### After Architecture Changes
1. [ ] Run full Codacy analysis: `codacy-cli-analyze analyze --upload`
2. [ ] Update all affected tests
3. [ ] Check for unused code from old approach
4. [ ] Update documentation
5. [ ] Tag as breaking change if applicable

## Dependency Management

### When Adding Dependencies
```bash
# Install new package
pnpm add package-name

# Run security check immediately
codacy-cli-analyze analyze --tool trivy

# Commit lockfile changes
git add pnpm-lock.yaml package.json
git commit -m "chore: add package-name dependency"
```

### Security Checks
- [ ] No known vulnerabilities in new package
- [ ] Package is actively maintained
- [ ] Check package size impact on bundle
- [ ] Verify TypeScript types available

## Performance Checklist

- [ ] No unnecessary re-renders (memoization applied)
- [ ] List components use FlatList optimizations
- [ ] Images are properly sized and cached
- [ ] Async operations don't block UI
- [ ] Memory leaks from subscriptions handled

## Accessibility Checklist

- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are 44pt minimum
- [ ] Screen reader labels present
- [ ] Keyboard navigation supported
- [ ] Text is scalable

## Security Checklist

- [ ] No hardcoded secrets/API keys
- [ ] Environment variables used correctly
- [ ] Input validation present
- [ ] Error messages don't expose sensitive info
- [ ] Authentication checks in place

## Pre-Push Checklist

Before pushing code to repository:

```bash
# 1. Update your branch with latest main
git fetch origin
git rebase origin/main

# 2. Run full quality checks
pnpm lint && pnpm tsc --noEmit

# 3. Run Codacy analysis
codacy-cli-analyze analyze

# 4. Final code review
# Review git diff one more time
git diff origin/main

# 5. Push
git push origin feature/<branch-name>
```

## Issue Resolution Process

### When Codacy Reports Issues

1. **Critical Issues** → Must fix before commit
2. **High Issues** → Should fix, document if deferred
3. **Medium Issues** → Fix or create TODO ticket
4. **Low Issues** → Document or ignore if false positive

### Type: Code Quality
- Reduce complexity if > 10 cyclomatic complexity
- Remove code duplication
- Simplify nested conditions
- Extract functions/components

### Type: Security
- Never ignore security issues
- Use SecureStore for sensitive data
- Validate all inputs
- Sanitize error messages

### Type: Performance
- Optimize list rendering
- Memoize expensive computations
- Lazy load components
- Profile with React DevTools

### Type: Code Style
- Follow naming conventions
- Fix linting issues
- Ensure consistent formatting
- Document complex logic

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Unused imports | Accidental import | Remove or use auto-format |
| Type 'any' | Missing type definition | Define explicit interface |
| Re-render loops | Missing useCallback deps | Add missing dependencies |
| Memory leak | Subscription not unsubscribed | Cleanup in useEffect return |
| Type mismatch | Incorrect prop type | Fix caller or prop interface |

## Deployment Checklist (Before Production)

- [ ] All tests passing
- [ ] Codacy grade is A or B
- [ ] No critical security issues
- [ ] Environment variables documented
- [ ] Error handling comprehensive
- [ ] Monitoring/logging in place
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Mobile testing on real devices
- [ ] Version number bumped

## Review Reminders

- **Codacy is your first reviewer** - Address issues before human review
- **TypeScript strict mode is enabled** - No implicit any
- **Theme system is required** - Use Colors from constants/theme
- **Zustand for state** - Create stores for shared state
- **ErrorHandling matters** - Every async operation needs try-catch
- **Performance counts** - Memoize, optimize lists, lazy load
