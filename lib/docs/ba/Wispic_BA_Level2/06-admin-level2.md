# Admin — Level 2 Specification

## Goal

Provide a protected management area for Wispic operations and editorial content.

## Actor

- ADMIN only

## Admin Modules

1. Dashboard
2. Photography
3. Explore
4. Share
5. Services/About
6. Bookings
7. Wedding Templates
8. User Wedding Invitations
9. Profile/Settings

## Authorization

Every admin page and mutation API must verify admin authorization server-side.

Do not rely on:
- Hidden buttons
- Client-side role checks alone
- Route obscurity

## Dashboard

Initial metrics:
- Published photography collections
- Published articles
- Pending bookings
- Published wedding templates
- Published user invitations

Metrics are informational and should not block core CRUD implementation.

## CRUD Expectations

For each managed resource:
- List
- Search/filter where useful
- Create
- Edit
- Preview
- Publish
- Unpublish/archive where applicable
- Delete only when business rules permit

## Admin UI States

Every list/form must handle:
- Loading
- Empty
- Validation error
- Server error
- Unauthorized
- Forbidden
- Success feedback

## Audit Consideration

For future production use, consider storing:
- `createdBy`
- `updatedBy`
- publication timestamp
- publication actor
- status transition history

Do not implement a full audit system unless required by MVP scope.

## Acceptance Criteria

- Non-admin users cannot access admin routes.
- Non-admin users cannot call admin mutation APIs successfully.
- Admin can manage each MVP module.
- Failed operations provide actionable feedback.
