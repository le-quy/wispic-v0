# Wispic Share

## Purpose

Share is Wispic's personal storytelling and opinion/content area.

Explore focuses mainly on travel and external discovery.

Share focuses on Wispic's own experiences, thoughts, photography journey, behind-the-scenes stories and personal perspective.

## Example Topics

- Why Wispic started.
- Photography learning journey.
- Behind the scenes.
- Personal photography experiences.
- Stories behind a photo session.
- Lessons learned from photography.
- Creative process.

## User Features

Anonymous and authenticated users can:

- Browse published Share articles.
- Filter by category/tag.
- Open an article.
- Read article content.
- View images.
- View author and publication date.
- View related stories.

No authentication is required for reading.

## Article Model

Use the same reusable content/article model as Explore where possible.

Required conceptual fields:

- id
- type = SHARE
- title
- slug
- excerpt
- cover image
- content
- author
- tags
- status
- publishedAt
- createdAt
- updatedAt

## Admin Features

Admin can:

- Create Share article.
- Edit article.
- Save draft.
- Preview.
- Publish.
- Unpublish.
- Archive/delete.
- Manage cover image.
- Manage tags/categories.
- Manage SEO metadata if supported.

## Acceptance Criteria

- Share content is clearly distinguishable from Explore content.
- Only published content is publicly visible.
- Article URLs are stable.
- Content supports rich text and images.
- The system should reuse the same content infrastructure as Explore where practical.

## Out of Scope

- User comments.
- Public submissions.
- Social feed.
