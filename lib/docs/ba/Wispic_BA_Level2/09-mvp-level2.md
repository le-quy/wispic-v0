# Wispic MVP — Level 2 Specification

## MVP Objective

Ship a coherent Wispic experience where Photography is the brand core and Wedding Invitation is the first digital product.

## P0 — Must Have

### Public
- `/photography`
- `/photography/[collectionSlug]`
- `/explore`
- `/explore/[slug]`
- `/share`
- `/share/[slug]`
- `/services`
- `/services/about`
- `/services/booking`
- `/wedding/templates`
- Public wedding invitation route

### Authentication
- Login
- Session management
- USER/ADMIN role enforcement

### Wedding
- Template listing
- Template preview
- Create invitation
- Edit invitation
- Upload photos
- Save draft
- Preview
- Publish
- Unpublish
- Public invitation

### Admin
- Photography CRUD
- Article CRUD
- Template CRUD
- Booking management
- Profile/about management

## P1 — Should Have

- Search
- Tags
- Related articles
- Better gallery navigation
- Booking filtering
- Basic analytics
- Social sharing metadata
- Image optimization

## P2 — Later

- Booking calendar
- Email notifications
- Customer portal
- Premium templates
- Payments
- Reviews
- Multiple photographers
- AI-assisted content/photo features

## MVP Non-Goals

Do not overbuild:
- Full CMS
- Complex workflow engine
- Multi-tenant SaaS architecture
- Advanced analytics
- Payment system
- AI generation
- Complex role hierarchy

## Definition of Done

A module is MVP-ready when:
1. Public behavior matches its Level 2 flow.
2. Authorization is enforced server-side.
3. Validation exists on both client and server where applicable.
4. Loading/empty/error states are handled.
5. Data model supports the stated use case.
6. API contracts are stable enough for frontend consumption.
7. Basic responsive behavior works.
8. No test/demo data leaks into production behavior.
