# Content Model — Level 2 Specification

## Goal

Define reusable content infrastructure without forcing every Wispic content type into the same domain model.

## Recommended Architecture

### Shared Editorial Article

Use for:
- Explore
- Share
- Future editorial categories

Core fields:
- `id`
- `contentType`
- `title`
- `slug`
- `excerpt`
- `coverImage`
- `content`
- `authorId` or author reference
- `status`
- `publishedAt`
- `createdAt`
- `updatedAt`

Optional:
- category
- tags
- location

### Dedicated Photography Models

Do not force photography galleries into article structure.

Use:
- `PhotographyCollection`
- `Photo`

Reason:
- A collection has ordered media.
- A collection has a cover photo.
- Gallery presentation differs from article presentation.

### Dedicated Wedding Models

Use:
- `WeddingTemplate`
- `WeddingInvitation`

Reason:
- Template is reusable design.
- Invitation is user-owned instance/data.
- Their lifecycle and authorization differ.

## Relationships

```text
User
 ├── Article (author)
 ├── WeddingInvitation (owner)
 └── Booking (optional requester/account relation)

Article
 └── ContentType: EXPLORE | SHARE

PhotographyCollection
 └── Photo[]

WeddingTemplate
 └── WeddingInvitation[]
```

## Data Ownership

- Admin owns/manages editorial content and templates.
- User owns their own wedding invitations.
- Public visitor owns no persistent content unless booking creates a record.

## Deletion Strategy

Prefer archive/soft-delete for:
- Articles
- Photography collections
- Templates
- Bookings
- Published invitations

Hard deletion should be reserved for clearly safe cases.
