# Wispic BA Level 2 — Conventions

## 1. Purpose

This document defines the common conventions used by all Level 2 specifications. These files are implementation-oriented and should be usable by AI coding agents.

## 2. Common Statuses

### Editorial Content
- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

### Wedding Invitation
- `DRAFT`
- `PUBLISHED`
- `UNPUBLISHED`
- `ARCHIVED`

### Booking
- `PENDING`
- `CONFIRMED`
- `CANCELLED`
- `COMPLETED`

## 3. Common Rules

- Public pages must only expose `PUBLISHED` content unless explicitly stated otherwise.
- Admin-only operations require `ADMIN`.
- A `USER` can modify only resources they own.
- Slugs must be unique within their resource type.
- Soft archive is preferred over destructive deletion for published/business data.
- Uploaded media must have validation for type, size and ownership.
- Server-side authorization is mandatory; hiding UI controls is not sufficient.
- API errors should return a stable machine-readable error code and human-readable message.
- Dates should be stored consistently in UTC and formatted in the user's locale at presentation time.

## 4. Standard API Response

### Success
```json
{
  "data": {},
  "meta": {}
}
```

### Error
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found"
  }
}
```

## 5. Standard UI States

Every async screen should consider:
- Loading
- Empty
- Success
- Error
- Unauthorized
- Forbidden
- Not Found

## 6. AI Implementation Rule

Before creating new models/components/APIs:
1. Reuse existing domain models where appropriate.
2. Reuse existing upload/auth/content infrastructure.
3. Do not create duplicate entities for the same business concept.
4. Keep public presentation and admin management concerns separated.
5. Do not introduce a second backend if the current Next.js architecture already provides the required server functionality.
