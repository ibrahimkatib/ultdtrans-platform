# ULTD TRANS v3 — project summary

## Product model
ULTD TRANS is a controlled translation marketplace with three role-specific workspaces:

1. Client — requests work, chooses the delivery model, communicates, reviews and rates.
2. Translator — manages a professional profile, availability, languages and projects.
3. Manager — matches, assigns, verifies and monitors the operation.

## Core lifecycle
REQUESTED → MATCHING → ASSIGNED → IN_PROGRESS → REVIEW → COMPLETED

A project may also be CANCELLED by authorized users.

## Privacy model
The manager/admin view can see operational identities. Client and translator views use platform aliases inside the project workspace so the normal workflow does not expose each participant's private contact details.

## AI model
AI-only work is intentionally cheaper and clearly labeled. AI + Human Review combines an AI first pass with a professional review stage. The actual AI provider key belongs in the server-side n8n integration, not in browser code.

## Production boundary
The MVP is structurally ready for Vercel, PostgreSQL and n8n. Durable file storage, transactional email, payment/escrow, MFA and production AI provider credentials still require external providers and production configuration.
