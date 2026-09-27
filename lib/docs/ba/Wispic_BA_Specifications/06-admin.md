# Wispic Admin

## Purpose

Admin is the management area for Wispic content, products and service requests.

Admin access must be protected by authentication and authorization.

## Dashboard

Initial dashboard can show:

- Published photography collections.
- Draft content.
- Published articles.
- Wedding templates.
- Total user invitations.
- Pending bookings.

Dashboard statistics are secondary. CRUD and content management are the priority.

## Admin Modules

### Photography

- Manage collections.
- Manage photos.
- Manage categories.
- Publish/unpublish.
- Reorder gallery.

### Explore

- Manage articles.
- Manage categories.
- Manage tags.
- Publish/unpublish.

### Share

- Manage articles.
- Manage categories/tags.
- Publish/unpublish.

### Wedding Templates

- Create template.
- Edit template.
- Preview.
- Publish/unpublish.
- Archive/delete.
- Manage template metadata.
- Manage template configuration.

### Wedding Invitations

Admin may need read/manage access for support purposes.

Admin should NOT silently modify user-owned content unless explicitly required by an administrative workflow.

Possible capabilities:

- View invitation.
- Search invitations.
- View owner.
- Disable/unpublish when required by moderation/business rules.

### Bookings

- List bookings.
- Filter by status.
- View details.
- Change status.
- Add internal notes.

### Wispic Profile

- Edit public Wispic profile.
- Edit contact information.
- Edit social links.
- Manage selected work.

## Authorization

Minimum roles:

- USER
- ADMIN

Do not expose admin APIs or pages to USER.

Server-side authorization must be enforced. Client-side hiding alone is not sufficient.

## Content Lifecycle

Use consistent lifecycle states:

- DRAFT
- PUBLISHED
- ARCHIVED

Only published public content should appear on public pages.

## Acceptance Criteria

- Unauthorized users cannot access admin pages.
- USER cannot call protected admin operations successfully.
- Admin can manage all defined content types.
- Draft content is not publicly visible.
- Delete/archive operations should avoid accidental permanent data loss where possible.
