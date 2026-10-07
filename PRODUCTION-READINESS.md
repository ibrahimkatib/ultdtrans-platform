# ULTD TRANS v3 — production readiness

## Already implemented in code

- Session authentication and password hashing
- Role checks on portal pages and API routes
- Project-level authorization
- Database-backed client, translator and manager workflows
- Project-scoped chat
- Privacy aliases for non-manager users
- Quote calculation
- Matching endpoint
- Translator verification endpoint
- Project activity history
- Notification records
- n8n event integration

## Required before public launch

1. Replace local file storage with Vercel Blob/S3.
2. Add email verification and password reset.
3. Add rate limiting on login, registration, upload and message APIs.
4. Add malware scanning for uploaded documents.
5. Connect a transactional email provider.
6. Connect a payment/escrow provider and invoice/VAT logic.
7. Add production AI provider through n8n.
8. Add MFA for Manager/Admin accounts.
9. Replace demo seed data with controlled onboarding.
10. Add legal text reviewed for the target jurisdiction.
11. Configure production PostgreSQL backups.
12. Configure monitoring and error reporting.
