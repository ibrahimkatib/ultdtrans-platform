# Tailwind compatibility fix

This build uses Tailwind CSS 3.4 with PostCSS because the local Next.js/Turbopack environment was unable to resolve the Tailwind 4 PostCSS plugin even when npm reported it installed.

After extracting:
1. `npm.cmd install`
2. `Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue`
3. `npm.cmd run dev`

The project keeps the same Tailwind utility classes; no component code needs to change.
