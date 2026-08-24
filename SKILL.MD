# SKILL.md - Project Memory & Lessons Learned

## Project Architecture Decisions
- **Decoupled Architecture:** React SPA handles all UI/UX; Laravel functions strictly as a REST API backend.
- **Unified Database:** Supabase PostgreSQL is used across all environments (Development & Production). Eliminates driver discrepancies between SQLite and PostgreSQL.
- **Layout Strategy:** 
  - Mobile (< 768px): Uses bottom navigation bar and touch-friendly card layouts.
  - Desktop (>= 768px): Transforms into full-width container layouts with top navbar, sidebar controls, and expanded multi-column grids.

## Branding & Visual Palette
- **Brand Colors:**
  - `brand-dark`: `#0D182E`
  - `brand-card`: `#16223B`
  - `brand-accent`: `#C5A059`
  - `brand-accent-hover`: `#B08B46`
  - `brand-text`: `#F8FAFC`

## Key Deployment & Integration Rules
- **Google OAuth:** Ensure `GOOGLE_REDIRECT_URI` in `.env` matches the production domain callback route exactly (`/auth/google/callback`). Authorized origins must also be registered in Google Cloud Console.
- **Laravel Caching in Deployment:** Always run `php artisan config:cache`, `route:cache`, and `view:cache` via `deploy.sh` after updating production `.env`.
- **Supabase SSL:** Hardcode `sslmode => 'require'` in `config/database.php` under the `pgsql` array to prevent connection pooling failures on Supabase.

## Change Log
### [Phase 1 - Initialization]
- Project initialized with React (Vite) Frontend + Laravel API Backend.
- Converted UI design strategy from mobile-only view to full multi-screen responsive layout.