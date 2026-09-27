# Photography — Level 2 Specification

## Goal

Make Photography the visual and brand core of Wispic, allowing visitors to discover curated photographic work through collections and individual photos.

## Actors

- Anonymous visitor
- Admin

## Preconditions

- Admin can authenticate.
- Photography collection data exists before a collection is publicly visible.
- A collection must contain at least one valid photo before publication.

## Public User Flow

1. Visitor opens `/photography`.
2. System loads published photography collections.
3. Visitor filters or browses by category.
4. Visitor opens a collection.
5. System displays collection metadata and photos.
6. Visitor can navigate through the gallery.
7. Visitor can return to the photography index.

## Admin Flow

1. Admin opens Photography management.
2. Admin creates or edits a collection.
3. Admin uploads/reorders photos.
4. Admin sets metadata.
5. Admin saves as draft.
6. Admin previews the public presentation.
7. Admin publishes or archives the collection.

## Photography Categories

Initial categories:
- Wedding
- Portrait
- Landscape

The implementation should allow additional categories later without redesigning the collection model.

## Collection Data

Required:
- `id`
- `title`
- `slug`
- `category`
- `coverPhotoId`
- `status`
- `createdAt`
- `updatedAt`

Optional:
- `description`
- `location`
- `shootDate`
- `photographer`
- `tags`

## Photo Data

Required:
- `id`
- `collectionId`
- `imageUrl`
- `sortOrder`
- `createdAt`

Optional:
- `altText`
- `caption`
- `width`
- `height`
- `metadata`

## Business Rules

- Only published collections appear publicly.
- A published collection must have a cover photo.
- Photo ordering is explicit via `sortOrder`.
- Deleting a photo must not silently change the order of unrelated photos.
- Admin may reorder photos.
- Public photo URLs must not expose private upload paths when the storage layer supports signed/public abstractions.
- Original image files and display derivatives should be separable for future optimization.

## Suggested API

### Public
- `GET /api/photography`
- `GET /api/photography/[slug]`

### Admin
- `POST /api/admin/photography`
- `PATCH /api/admin/photography/[id]`
- `DELETE /api/admin/photography/[id]`
- `POST /api/admin/photography/[id]/photos`
- `PATCH /api/admin/photography/[id]/photos/reorder`
- `DELETE /api/admin/photography/[id]/photos/[photoId]`

## UI Requirements

Photography index:
- Strong visual hierarchy
- Large imagery
- Category navigation
- Minimal metadata
- Responsive grid/list

Collection page:
- Collection title
- Location/date when available
- Editorial description
- Large gallery
- Photo navigation
- Back navigation

Admin:
- Collection table/list
- Create/edit form
- Upload area
- Drag/reorder
- Preview
- Publish/archive controls

## Validation

- `title`: required, non-empty.
- `slug`: required, unique, URL-safe.
- `category`: required.
- `coverPhotoId`: required before publish.
- Photo type: image only.
- File size must respect configured upload limit.
- Collection cannot be published with zero photos.

## Acceptance Criteria

- Published collections appear on `/photography`.
- Draft collections are invisible publicly.
- Opening a collection shows photos in configured order.
- Admin can create, edit, publish and archive a collection.
- Admin can upload and reorder photos.
- Invalid image uploads are rejected.
- Unauthorized users cannot access admin mutation APIs.

## Edge Cases

- Collection has no photos.
- Cover photo is deleted.
- Two photos have the same sort order.
- Slug collision.
- Upload succeeds but database write fails.
- Database write succeeds but upload fails.
- Collection is archived while a visitor has it open.
