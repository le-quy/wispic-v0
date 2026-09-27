# Wispic Photography

## Purpose

Photography is the core visual and brand module of Wispic.

It showcases curated collections created by Wispic.

## Categories

Initial categories:

- Wedding
- Portrait
- Landscape

The category model should be extensible.

## User Features

Anonymous and authenticated users can:

- View photography categories.
- View collection list.
- Filter collections by category.
- Open a collection.
- View collection cover and metadata.
- Browse photos in a collection.
- View photo gallery.
- Read collection description.
- See location information when available.
- Navigate to related collections.

Authentication is NOT required for viewing photography.

## Collection

A collection should support:

- id
- title
- slug
- category
- cover image
- description
- location
- shoot date
- photographer
- photos
- tags
- status
- createdAt
- updatedAt
- publishedAt

## Photo

A photo should support:

- id
- collectionId
- image URL / storage reference
- thumbnail
- caption
- alt text
- display order
- metadata if needed
- createdAt

Do not expose unnecessary camera metadata publicly unless explicitly configured.

## Admin Features

Admin can:

- Create collection.
- Edit collection.
- Delete collection.
- Publish collection.
- Unpublish collection.
- Select/change cover image.
- Add photos.
- Remove photos.
- Reorder photos.
- Edit captions and alt text.
- Assign category.
- Assign tags.
- Set location.
- Preview before publishing.

## Status

Use a simple content lifecycle:

- DRAFT
- PUBLISHED
- ARCHIVED

Only PUBLISHED collections are visible publicly.

## Acceptance Criteria

- Public users can browse published collections.
- Draft collections are not publicly accessible.
- A collection cannot be published without a title and cover image.
- Photos can be reordered.
- Deleted/unpublished content does not appear in public listing.
- Collection detail pages use stable slugs.
- Images have accessible alt text where appropriate.

## Out of Scope

Do not implement:
- Social likes.
- Comments.
- Public user photo uploads.
- Complex photographer marketplace.
- Paid photo downloads.
