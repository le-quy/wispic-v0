# Wispic Content Model

## Purpose

Define reusable content concepts shared by Photography, Explore and Share.

## Content Types

Initial types:

- PHOTOGRAPHY_COLLECTION
- EXPLORE_ARTICLE
- SHARE_ARTICLE

Future types may include:

- JOURNAL
- PHOTO_TIP
- WEDDING_INSPIRATION
- LOCATION_GUIDE

## Recommendation

Prefer a reusable content architecture instead of creating a completely independent article system for every section.

However, Photography Collection is structurally different from normal articles because it contains a gallery.

Therefore:

### Editorial Content

Use a common article/content model for:

- Explore
- Share
- Future editorial sections

### Photography

Use dedicated:

- Photography Collection
- Photo

models.

## Common Article Fields

- id
- type
- title
- slug
- excerpt
- coverImage
- content
- author
- tags
- category
- location
- status
- publishedAt
- createdAt
- updatedAt

## Important Rule

Do not over-engineer the content model during MVP.

The goal is reusable infrastructure without turning simple article management into a generic CMS framework that is difficult to maintain.
