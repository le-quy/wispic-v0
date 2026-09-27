# Wispic User Roles & Permissions

## Roles

### Anonymous

Can:

- Read public content.
- Browse photography.
- Browse templates.
- View public wedding invitations.
- Submit booking requests.

Cannot:

- Create persistent personal wedding invitations.
- Access private user data.
- Access admin.

### USER

Can:

- Read public content.
- Manage own wedding invitations.
- Upload images for own invitations.
- Publish/unpublish own invitations.
- View own data.

Cannot:

- Manage other users.
- Manage templates.
- Create/edit Wispic content.
- Manage bookings globally.
- Access admin.

### ADMIN

Can:

- Manage Wispic content.
- Manage photography.
- Manage Explore.
- Manage Share.
- Manage wedding templates.
- View/manage bookings.
- Manage Wispic profile.
- Support/moderate wedding invitations where required.

## Permission Matrix

| Capability | Anonymous | USER | ADMIN |
|---|---:|---:|---:|
| Read public content | Yes | Yes | Yes |
| Browse photography | Yes | Yes | Yes |
| Browse templates | Yes | Yes | Yes |
| Submit booking | Yes | Yes | Yes |
| Create wedding invitation | No | Yes | Yes |
| Edit own invitation | No | Yes | Yes |
| Edit another user's invitation | No | No | Restricted |
| Publish own invitation | No | Yes | Yes |
| Create article | No | No | Yes |
| Manage photography | No | No | Yes |
| Manage template | No | No | Yes |
| Manage booking | No | No | Yes |
| Manage Wispic profile | No | No | Yes |

Authorization must be enforced on the server/API layer.
