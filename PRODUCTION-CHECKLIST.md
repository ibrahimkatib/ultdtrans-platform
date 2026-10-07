# ULTD TRANS v3 — production checklist

## Local
- [x] Next.js application structure
- [x] PostgreSQL / Prisma schema
- [x] Session authentication
- [x] Client / Translator / Manager roles
- [x] Seeded demo data
- [x] Project lifecycle
- [x] Project-scoped messages
- [x] Quote calculation
- [x] Translator matching
- [x] Translator verification
- [x] Ratings and project activity
- [x] n8n event hooks

## Vercel
- [ ] Push repository to GitHub
- [ ] Import repository into Vercel
- [ ] Configure `DATABASE_URL`
- [ ] Configure `SESSION_SECRET`
- [ ] Configure `N8N_WEBHOOK_URL`
- [ ] Configure `N8N_AI_WEBHOOK_URL`
- [ ] Configure `N8N_WEBHOOK_SECRET`
- [ ] Configure `APP_URL`
- [ ] Deploy Preview
- [ ] Verify Preview login and database connection
- [ ] Promote to Production
- [ ] Connect the ULTD TRANS domain

## Production infrastructure
- [ ] Production PostgreSQL
- [ ] Production migrations
- [ ] Durable file/object storage
- [ ] Transactional email provider
- [ ] Error monitoring
- [ ] Database backups
- [ ] Rate limiting
- [ ] Malware scanning for uploads

## Security / legal
- [ ] Email verification
- [ ] Password reset
- [ ] Manager/Admin MFA
- [ ] Account disable / session invalidation
- [ ] Privacy policy reviewed
- [ ] Terms reviewed
- [ ] Translator agreement
- [ ] Client agreement
- [ ] GDPR/data-retention review

## Automation
- [ ] Project-created webhook
- [ ] Project-assigned webhook
- [ ] Project-status webhook
- [ ] AI translation workflow
- [ ] Email notification workflow
- [ ] Reminder workflow
- [ ] Failure/retry handling

## Commercial
- [ ] Payment provider
- [ ] Invoice generation
- [ ] VAT/tax rules
- [ ] Platform commission
- [ ] Translator payout workflow
- [ ] Dispute/refund rules
