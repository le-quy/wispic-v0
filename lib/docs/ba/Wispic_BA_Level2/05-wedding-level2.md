# Wedding Invitation — Level 2 Specification

## Goal

Allow users to create and publish digital wedding invitations using reusable Wispic templates.

## Important Domain Separation

Two different entities must exist:

### Wedding Invitation Template
A reusable design owned/managed by Wispic.

### Wedding Invitation
A specific invitation instance created by a user from a template.

One template can be used by many wedding invitations.

## Actors

- Anonymous visitor
- USER
- ADMIN

## Public Template Flow

1. Visitor opens `/wedding/templates`.
2. System lists published templates.
3. Visitor previews a template.
4. Visitor chooses to create an invitation.
5. If login is required by the implementation, redirect to authentication and return to creation flow.

## User Creation Flow

1. User selects template.
2. System creates invitation draft.
3. User enters couple information.
4. User uploads/selects photos.
5. User configures event information.
6. User previews invitation.
7. User saves draft.
8. User publishes.
9. System generates public invitation URL/slug.
10. User can later unpublish or edit.

## Invitation Data

Required:
- `id`
- `ownerId`
- `templateId`
- `title`
- `slug`
- `status`
- `createdAt`
- `updatedAt`

Likely domain data:
- Couple names
- Wedding date/time
- Venue
- Address/location
- Story
- Gallery
- Schedule/events
- Contact information
- RSVP configuration
- Theme/configuration

The exact fields should follow the existing template-definition file rather than duplicating schema definitions.

## Template Data

Required:
- `id`
- `name`
- `slug`
- `previewImage`
- `status`
- `createdAt`
- `updatedAt`

Optional:
- `description`
- `category`
- `configSchema`
- `version`

## Business Rules

- User can modify only their own invitations.
- Template must be published/available when selected for new creation.
- Existing invitations should preserve compatibility if a template is later updated.
- Template versioning should be considered before production.
- Draft invitations are private to their owner.
- Published invitations are publicly accessible through their slug.
- Unpublished invitations must stop being publicly accessible.
- Slugs must be unique.

## Suggested API

Templates:
- `GET /api/wedding/templates`
- `GET /api/wedding/templates/[slug]`

User invitations:
- `GET /api/wedding/invitations`
- `POST /api/wedding/invitations`
- `GET /api/wedding/invitations/[id]`
- `PATCH /api/wedding/invitations/[id]`
- `DELETE /api/wedding/invitations/[id]`
- `POST /api/wedding/invitations/[id]/publish`
- `POST /api/wedding/invitations/[id]/unpublish`

Public:
- `GET /api/public/wedding/[slug]`

## UI

Template listing:
- Large visual previews
- Minimal metadata
- Preview action
- Create action

Editor:
- Section navigation
- Form fields
- Photo upload
- Save draft
- Preview
- Publish

Public invitation:
- Mobile-first
- Fast image loading
- Template-defined visual structure
- No admin/editor controls

## Validation

- Required couple/event fields according to template schema.
- Slug unique.
- Image type/size validation.
- Only owner can mutate.
- Publish operation validates all required publication fields.

## Acceptance Criteria

- User can create a draft from a published template.
- User can save and reopen a draft.
- User can preview before publishing.
- User can publish an invitation.
- Published invitation is publicly reachable.
- User can unpublish their own invitation.
- Another user cannot edit it.
- Admin can manage templates.
