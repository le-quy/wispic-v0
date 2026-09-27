# User Roles & Permissions — Level 2

## Roles

### ANONYMOUS

Can:
- View published Photography
- View published Explore
- View published Share
- View Services/About
- Browse wedding templates
- View published wedding invitations
- Submit booking request

Cannot:
- Access admin
- Create/manage private invitation without authentication
- Edit any persisted content

### USER

Can:
- Do everything Anonymous can
- Create wedding invitations
- Edit own invitations
- Upload media belonging to own invitations
- Save drafts
- Preview own invitations
- Publish/unpublish own invitations
- Manage own invitations

Cannot:
- Edit another user's invitation
- Manage Wispic editorial content
- Manage templates
- Manage bookings

### ADMIN

Can:
- Do everything needed for Wispic management
- Manage Photography
- Manage Explore
- Manage Share
- Manage Services/About
- Manage bookings
- Manage wedding templates
- View/support user invitations
- Manage Wispic profile/settings

## Permission Matrix

| Action | Anonymous | USER | ADMIN |
|---|---:|---:|---:|
| View public content | Yes | Yes | Yes |
| Browse templates | Yes | Yes | Yes |
| Submit booking | Yes | Yes | Yes |
| Create invitation | No* | Yes | Yes |
| Edit own invitation | No | Yes | Yes |
| Edit another user's invitation | No | No | Yes |
| Manage photography | No | No | Yes |
| Manage articles | No | No | Yes |
| Manage templates | No | No | Yes |
| Manage bookings | No | No | Yes |

`*` Product may allow anonymous draft creation later, but MVP should use authenticated ownership for persistent invitations.

## Security Rule

Authorization must be enforced on the server for every protected operation.
