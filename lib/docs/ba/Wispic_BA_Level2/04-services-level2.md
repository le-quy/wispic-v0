# Services — Level 2 Specification

## Goal

Present Wispic's human/service side: who Wispic is, what services are offered, and how visitors can contact/book.

## Actors

- Anonymous visitor
- Admin

## Public Sections

### About
- Wispic introduction
- Photographer/profile information
- Brand philosophy
- Contact information
- Optional social links

### Services
Initial services:
- Photography
- Wedding photography
- Online wedding invitation creation

Additional services can be added later.

### Booking
Visitors can submit a booking request without creating an account.

## Booking Flow

1. Visitor opens `/services/booking`.
2. Visitor fills booking form.
3. Client-side validation runs.
4. Server validates again.
5. System creates a `PENDING` booking.
6. Visitor sees confirmation.
7. Admin reviews the request.
8. Admin changes status to `CONFIRMED`, `CANCELLED`, or later `COMPLETED`.

## Booking Data

Required:
- `id`
- `name`
- `contact`
- `service`
- `status`
- `createdAt`

Optional:
- `email`
- `phone`
- `preferredDate`
- `location`
- `message`
- `budget`
- `source`

## Business Rules

- Anonymous users may submit booking requests.
- Booking creation does not grant account access.
- Status changes are admin-only.
- Never expose private booking information publicly.
- Duplicate submission protection should be considered.

## API

Public:
- `POST /api/bookings`

Admin:
- `GET /api/admin/bookings`
- `GET /api/admin/bookings/[id]`
- `PATCH /api/admin/bookings/[id]`

## Validation

- Name required.
- At least one usable contact method required.
- Service required.
- Preferred date must be valid if supplied.
- Message length should have a configured maximum.
- Server must sanitize/validate all fields.

## Acceptance Criteria

- Visitor can submit a valid booking without login.
- Invalid requests are rejected with useful errors.
- Admin can view and update booking status.
- Public users cannot read bookings.
