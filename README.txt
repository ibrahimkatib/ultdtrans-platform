ULTD TRANS - logo navigation fix

Replace these files in your existing project:
components/Logo.tsx
components/PortalShell.tsx

Behavior:
- Public pages: Logo still links to /
- Client portal: Logo links to /client
- Translator portal: Logo links to /translator
- Manager/Admin portal: Logo links to /manager

This does NOT log the user out. The existing Log out button remains the only explicit logout action.
No database migration is required.
