# Wispic — AI Implementation Workflow

## Purpose

Use this document as the operating contract for an AI coding agent implementing Wispic from the BA specifications.

## Required Order

1. Inspect existing repository structure.
2. Read existing template-definition/configuration files.
3. Read current database/schema code.
4. Read current auth/session implementation.
5. Read existing upload/storage implementation.
6. Identify reusable components and services.
7. Compare current implementation against Level 2 specifications.
8. Propose minimal changes.
9. Implement one module at a time.
10. Run type checks/tests/build where available.

## Do Not Guess

If the repository already contains:
- A model
- API route
- component
- utility
- auth mechanism
- storage helper
- template schema

reuse or extend it rather than creating a parallel implementation.

## Implementation Priority

1. Domain/data model
2. Server authorization
3. API/server actions
4. Validation
5. Public UI
6. Admin UI
7. Loading/error/empty states
8. Tests
9. Visual refinement

## Definition of Done per Feature

- Requirement traceable to BA file.
- No duplicate domain concept.
- Server authorization verified.
- Validation implemented.
- Happy path works.
- Important edge cases handled.
- TypeScript/build passes.
- Existing behavior not unnecessarily broken.

## Change Discipline

Prefer:
- Small changes
- Reusable functions
- Existing project conventions
- Clear naming
- Minimal dependencies

Avoid:
- Unrelated refactors
- Premature abstractions
- New libraries without need
- Duplicated API layers
- Duplicated database models
- Rewriting working code without a requirement

## Agent Output Format

After each implementation task, report:

### Changed
- Files changed
- What changed

### Behavior
- User-visible behavior

### Validation
- Tests/checks run

### Risks
- Known limitations or assumptions

### Next
- Recommended next implementation unit
