# Explore — Level 2 Specification

## Goal

Provide editorial travel/discovery content that expands Wispic beyond photography galleries.

## Actors

- Anonymous visitor
- Admin

## Public Flow

1. Visitor opens `/explore`.
2. System lists published Explore articles.
3. Visitor optionally filters by category/tag/location.
4. Visitor opens `/explore/[slug]`.
5. System renders article content and metadata.
6. Visitor can navigate to related published content when available.

## Article Data

Required:
- `id`
- `title`
- `slug`
- `excerpt`
- `content`
- `status`
- `createdAt`
- `updatedAt`

Optional:
- `coverImage`
- `author`
- `category`
- `tags`
- `location`
- `publishedAt`

## Business Rules

- Only `PUBLISHED` articles are public.
- `slug` must be unique.
- `publishedAt` should be set when first published.
- Draft content must not be accessible through public routes.
- Archived content should not appear in normal listing or recommendations.

## Suggested API

Public:
- `GET /api/explore`
- `GET /api/explore/[slug]`

Admin:
- `POST /api/admin/articles`
- `PATCH /api/admin/articles/[id]`
- `DELETE /api/admin/articles/[id]`

The article model should support a content type such as `EXPLORE` so Explore and Share can reuse infrastructure without losing semantic separation.

## UI

Explore index:
- Editorial hero
- Article list/grid
- Cover image
- Title
- Short excerpt
- Location/category where relevant

Article detail:
- Hero image
- Title
- Metadata
- Rich content
- Related content
- Navigation back to Explore

## Acceptance Criteria

- Published articles are visible.
- Draft/archived articles are hidden.
- Article URLs are stable.
- Admin can create/edit/publish/archive articles.
- Related content never exposes unpublished content.
