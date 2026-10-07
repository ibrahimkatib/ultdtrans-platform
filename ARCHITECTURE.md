# ULTD TRANS Architecture

## User roles

### CLIENT
Creates requests, views only their own projects, messages the project participants and rates completed work.

### TRANSLATOR
Maintains a professional profile with language pairs, levels, specializations, rates, timezone, working hours and availability. Can view assigned projects and move them through their allowed work states.

### MANAGER
Oversees all projects, translator pool and assignment. Can inspect matching recommendations and control operational statuses.

### ADMIN
Same operational access as Manager in the MVP. A later release can add platform-wide configuration and audit controls.

## Core entities

- `User`
- `Session`
- `ClientProfile`
- `TranslatorProfile`
- `Language`
- `TranslatorLanguage`
- `Specialization`
- `TranslatorSpecialization`
- `Project`
- `Quote`
- `ProjectFile`
- `Message`
- `Rating`
- `Notification`
- `ProjectActivity`

## Privacy model

The client and translator communicate through project-scoped messages. The public UI uses display names and translator profile signals such as verification and rating rather than exposing direct contact details.

Managers can access operational project details. Authentication and authorization are enforced server-side in the current MVP.

## Matching model

The first matching version is deterministic and transparent. It scores translators using:

1. source language support
2. target language support
3. specialization match
4. verification status
5. availability
6. average rating

This is intentionally simple so it can later be replaced or augmented with an AI / n8n ranking workflow.

## AI service model

### HUMAN
Professional translator workflow.

### AI
Lower-cost AI-generated translation. The UI explicitly states that human review is not included.

### AI_HUMAN_REVIEW
AI creates the first pass, then a professional translator reviews and improves it.

## Automation architecture

`Next.js API → n8n Webhook → automation workflow → email / CRM / AI / notifications`

Project events currently emitted include:

- `project.created`
- `project.updated`
- `project.assigned`

## Production upgrades before real customer use

- Durable file storage
- Stronger password policy / account recovery
- Email verification
- 2FA for managers
- Rate limiting
- CSRF / abuse controls appropriate to deployment architecture
- Content scanning for uploads
- Real-time chat delivery
- Payment provider + platform commission / escrow model
- Invoice generation
- Full audit trail
- Privacy policy / terms / cookie controls
- Automated backups and observability
