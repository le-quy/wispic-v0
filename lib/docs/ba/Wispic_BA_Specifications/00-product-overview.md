# Wispic Product Overview

## 1. Product Vision

Wispic is a photography and creative platform. The platform allows anonymous visitors and registered users to explore photography, travel content, personal stories, Wispic services, and create online wedding invitations.

The core product areas are:

1. Photography
2. Explore
3. Share
4. Services

Wedding Invitation is a product inside Services.

## 2. User Types

### Anonymous Visitor
Can:
- Browse public photography collections.
- Read Explore articles.
- Read Share articles.
- View Wispic information.
- View services.
- Browse wedding invitation templates.
- Start the booking flow.
- Must authenticate before saving/publishing a personal wedding invitation.

### User
Can:
- Do everything an anonymous visitor can do.
- Create wedding invitations.
- Save and edit their own wedding invitations.
- Upload wedding photos.
- Preview invitations.
- Publish/unpublish their invitations.
- Manage their own invitations.

### Admin
Can:
- Manage photography collections and photos.
- Create, edit, publish, unpublish and delete content.
- Manage Explore articles.
- Manage Share articles.
- Manage wedding invitation templates.
- Manage user-created wedding invitations when administrative access is required.
- Manage bookings.
- Manage basic Wispic profile/service information.

## 3. Main Navigation

- Photography
- Explore
- Share
- Services

Services contains:
- Wispic Profile / About
- Booking
- Wedding Invitation

## 4. Product Principles

- Photography is the core brand identity.
- Content should be discoverable without authentication.
- Wedding Invitation is a product, not the entire identity of Wispic.
- Admin-managed content should be reusable and structured.
- User-owned wedding data must be separated from admin template definitions.
- Prefer reusable content models and components.
- Do not implement features outside the defined scope without explicit approval.

## 5. Suggested High-Level Routes

- `/photography`
- `/photography/[collectionSlug]`
- `/explore`
- `/explore/[slug]`
- `/share`
- `/share/[slug]`
- `/services`
- `/services/about`
- `/services/booking`
- `/wedding`
- `/wedding/templates`
- `/wedding/create`
- `/wedding/[slug]`
- `/admin`

Routes may be adjusted to match the existing application architecture.
