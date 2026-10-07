# ULTD TRANS Platform v3

ULTD TRANS is a translation marketplace and translation-management platform designed around three controlled workspaces:

- **Client Portal** — request work, choose Human / AI / AI + Human Review, upload files, communicate inside a project, approve delivery and rate a translator.
- **Translator Portal** — build a verified professional profile, manage languages, specializations, rates and availability, accept/complete projects and communicate through project chat.
- **Manager Portal** — review incoming requests, match translators, assign projects, verify translators, monitor delivery and review operational analytics.

## What is real in this MVP

- PostgreSQL + Prisma data model
- Session authentication with hashed passwords and httpOnly session cookies
- Role based access control: CLIENT / TRANSLATOR / MANAGER / ADMIN
- Database-backed projects, quotes, files metadata, chat messages, ratings, notifications and activity history
- Price calculation for Human, AI and AI + Human Review services
- Translator matching based on language, specialization, verification, availability and rating
- Client/translator privacy aliases in project communication
- Manager assignment workflow
- Translator status progression
- Client delivery approval and rating workflow
- n8n webhook integration points
- AI translation workflow integration point
- Seeded demo accounts and sample projects

## What remains an external production integration

These require a real provider/account and are intentionally not faked:

- Durable production file storage (Vercel Blob / S3-compatible storage)
- Transactional email provider
- Real-time WebSocket/chat transport
- Payment provider and escrow/payment reconciliation
- Production AI provider through the n8n workflow
- Email verification / password reset / MFA

The application already contains the architecture points for these integrations.

## Demo accounts

- Client: `client@ultdtrans.test` / `Password123!`
- Translator: `translator@ultdtrans.test` / `Password123!`
- Manager: `manager@ultdtrans.test` / `Password123!`

## Local setup

1. Install Node.js 20+.
2. Create `.env` from `.env.example`.
3. Put the pooled Prisma Postgres connection string in `DATABASE_URL` and the direct connection string in `DIRECT_URL`. For local development, you may use the direct string for both values.
4. Run `npm install`.
5. Run `npm run db:generate`.
6. Run `npm run db:migrate`.
7. Run `npm run db:seed`.
8. Run `npm run dev`.
9. Open `http://localhost:3000`.

## Production plan

GitHub → Vercel → Production PostgreSQL → Vercel Blob → n8n → AI → custom domain.

Do not copy the local `.env` into GitHub. Use Vercel Environment Variables for production secrets.
