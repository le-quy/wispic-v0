# Wispic Wedding Invitation

## Purpose

Wedding Invitation is a user-facing product inside Wispic.

Users can create personal online wedding invitations using templates managed by Admin.

## Core Concepts

There are two separate entities:

### Template

Created and managed by Admin.

A template defines the visual/design structure.

### Wedding Invitation

Created by a User from a Template.

The invitation contains the user's personal wedding data.

One template can be used by many wedding invitations.

## Template Features

Admin can:

- Create template.
- Edit template.
- Preview template.
- Publish/unpublish template.
- Archive/delete template.
- Set template name.
- Set cover/preview.
- Set category.
- Set style.
- Configure template structure.
- Define supported sections.

Initial styles may include:

- Minimal
- Romantic
- Editorial
- Elegant
- Traditional

The system should allow additional styles later.

## Wedding Invitation Features

Authenticated users can:

- Browse templates.
- Preview templates.
- Select a template.
- Create invitation.
- Enter bride/groom information.
- Enter wedding date/time.
- Enter venue.
- Add wedding story.
- Upload photos.
- Customize supported visual settings.
- Preview invitation.
- Save invitation.
- Edit invitation later.
- Publish invitation.
- Unpublish invitation.
- Delete invitation.

## Suggested Invitation Data

- id
- ownerId
- templateId
- slug
- title
- groom name
- bride name
- wedding date
- wedding time
- venue
- address
- story
- gallery
- custom configuration
- status
- createdAt
- updatedAt
- publishedAt

## Status

- DRAFT
- PUBLISHED
- UNPUBLISHED
- ARCHIVED

## Public Invitation

Published invitations have a public URL, for example:

`/wedding/[slug]`

Only the invitation owner can edit it.

The public page should expose only information configured for public display.

## Authentication

Anonymous users can:

- Browse templates.
- Preview templates.
- Start the creation journey.

Authentication is required before persisting a personal invitation.

## Acceptance Criteria

- User cannot edit another user's invitation.
- User can create multiple invitations if business rules allow.
- A published invitation has a stable public URL.
- Unpublished invitations are not publicly accessible.
- Template changes must not unexpectedly overwrite user-specific invitation data.
- Template and invitation are separate entities.
- Uploaded images are associated with the correct invitation/user.
