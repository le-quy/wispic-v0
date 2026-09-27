# Share — Level 2 Specification

## Goal

Create a space for personal stories, reflections, photography notes and the Wispic point of view.

## Actors

- Anonymous visitor
- Admin

## Content Types

Initial examples:
- Story
- Photography note
- Behind the scenes
- Personal reflection
- Wispic update

These should reuse the common article/content infrastructure.

## Public Flow

1. Visitor opens `/share`.
2. System lists published Share posts.
3. Visitor opens `/share/[slug]`.
4. System renders the post.
5. Visitor may navigate to related Share posts or other public Wispic content.

## Data

Reuse common article fields:
- `id`
- `title`
- `slug`
- `excerpt`
- `coverImage`
- `content`
- `author`
- `category`
- `tags`
- `status`
- `publishedAt`
- `createdAt`
- `updatedAt`

Add semantic `contentType = SHARE`.

## Business Rules

- Share content must not be mixed into Explore listings unless explicitly requested.
- Shared content uses the same publication lifecycle.
- Admin controls publication.
- Public routes only expose published content.

## API

Prefer shared article APIs with a content-type filter rather than creating duplicate article infrastructure.

Examples:
- `GET /api/articles?type=SHARE`
- `GET /api/articles/[slug]`
- `POST /api/admin/articles`
- `PATCH /api/admin/articles/[id]`

## Acceptance Criteria

- Share posts have their own public navigation.
- Share posts can reuse article components.
- Explore and Share remain semantically separated.
- Admin can manage both using shared infrastructure.
