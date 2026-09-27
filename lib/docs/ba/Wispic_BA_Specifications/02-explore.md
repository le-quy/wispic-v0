# Wispic Explore

## Purpose

Explore is Wispic's travel and destination content area.

Its purpose is discovery, inspiration and organic content consumption.

## Initial Content Direction

Examples:

- Travel guides.
- Destination stories.
- Photography locations.
- Places to visit.
- Couple travel ideas.
- Photo locations.

## User Features

Anonymous and authenticated users can:

- Browse published articles.
- Filter articles by category.
- Search articles if search is implemented.
- Open an article.
- View article images.
- Read article content.
- View author.
- View publication date.
- View location when available.
- View related articles.

Authentication is NOT required.

## Article

Fields:

- id
- title
- slug
- excerpt
- cover image
- content
- author
- category
- tags
- location
- status
- publishedAt
- createdAt
- updatedAt

Content should support rich text and embedded images.

## Admin Features

Admin can:

- Create article.
- Edit article.
- Save draft.
- Preview article.
- Publish article.
- Unpublish article.
- Archive/delete article.
- Manage cover image.
- Manage categories.
- Manage tags.
- Set location.
- Set SEO metadata if SEO is supported.

## Status

- DRAFT
- PUBLISHED
- ARCHIVED

Only PUBLISHED articles are publicly visible.

## Acceptance Criteria

- Public users can read published articles without login.
- Draft articles are inaccessible publicly.
- Article URLs use slugs.
- Article content supports images.
- Cover image is displayed in listing/detail views.
- Related content can be shown without duplicating article data.

## Out of Scope

- User comments.
- User-generated articles.
- Social network features.
- Paid subscriptions.
