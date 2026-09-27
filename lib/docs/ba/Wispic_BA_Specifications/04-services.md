# Wispic Services

## Purpose

Services contains the commercial and identity-related capabilities of Wispic.

Initial sections:

1. Wispic Profile / About
2. Booking
3. Wedding Invitation

## 1. Wispic Profile / About

Public users can view:

- Wispic introduction.
- Photographer information.
- Photography style.
- Wispic story/philosophy.
- Contact information.
- Social links.
- Selected work.

Admin should be able to update profile content without changing application code where practical.

## 2. Booking

Booking allows a visitor/user to request a Wispic service.

Initial service types:

- Wedding Photography
- Couple Photography
- Portrait Photography
- Travel Photography
- Other services added later

### Booking Fields

- id
- customer name
- email
- phone
- service type
- preferred date
- location
- number of people if applicable
- message/note
- status
- createdAt
- updatedAt

### Booking Status

- PENDING
- CONFIRMED
- CANCELLED
- COMPLETED

### User Flow

1. Open Booking.
2. Select service.
3. Enter contact information.
4. Select preferred date.
5. Enter location.
6. Add note.
7. Submit booking.
8. Show confirmation.

Anonymous booking may be supported. Do not force account creation unless required by business rules.

### Admin

Admin can:

- View bookings.
- Filter bookings.
- Open booking details.
- Change status.
- Add internal notes if required.
- Cancel booking.
- Mark completed.

## 3. Wedding Invitation

Wedding Invitation is documented separately in `05-wedding-invitation.md`.

## Acceptance Criteria

- Booking submission validates required information.
- Customer receives clear confirmation after submission.
- Admin can see submitted bookings.
- Booking status changes are persisted.
- Private customer information must not be exposed publicly.
