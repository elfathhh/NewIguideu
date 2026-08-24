# AGENTS.md - IguideU Project Guidelines

## 1. Project Context & Vision
IguideU is a specialized travel platform connecting tourists with verified local tour guides exclusively across West Nusa Tenggara / Nusa Tenggara Barat (NTB) - including Lombok and Sumbawa. 
We are rebuilding the platform from a monolithic Blade app into a modern **Decoupled Architecture**:
- **Frontend:** React (Vite) + Tailwind CSS + PWA (Progressive Web App).
- **Backend:** Laravel RESTful API + Laravel Sanctum + Laravel Socialite (Google OAuth).
- **Database:** PostgreSQL Supabase (Local Development & Production).

## 2. Core Technical Requirements
- **Fully Responsive Layout:** Unlike the previous iteration, the new UI must natively adapt across ALL screen sizes (Mobile, Tablet, Laptop, and Ultra-wide Desktop) using Tailwind CSS responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
- **Progressive Web App (PWA):** Must support "Add to Home Screen" on Android, iOS, and Desktop with offline static caching.
- **Database Standard:** ALWAYS use PostgreSQL on Supabase for BOTH local development and production environments. Do NOT switch to SQLite or local MySQL. This ensures database schema and data consistency across all team members.
- **Color System (Luxury Navy & Gold):**
  - Main Background: Deep Navy (`#0D182E`)
  - Card/Surface: Dark Slate Navy (`#16223B`)
  - Accent / Primary CTA: Warm Gold (`#C5A059`)
  - Text Primary: Off-White (`#F8FAFC`)
  - Text Muted: Slate Gray (`#94A3B8`)

## 3. Technology Stack Breakdown
- **Frontend:** React 18+, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios.
- **Backend:** Laravel 11+, Laravel Sanctum, Laravel Socialite.
- **Deployment:** PaaS Cloud / Hosting with automated `deploy.sh` for Supabase migrations (`sslmode=require`).

## 4. Coding Conventions & Guardrails
1. **Frontend Component Architecture:** Keep components atomic, clean, and modular. Use custom hooks for API calls.
2. **API Handlers:** All authentication state must be managed via Sanctum tokens or secure cookies.
3. **No Unplanned Tech Shifts:** Do not alter the database schema or stack choices without explicit approval.

## 5. Current Task Focus (Roadmap Checklist)
- [ ] Initialize React (Vite) Frontend project with Tailwind CSS (Navy & Gold config).
- [ ] Implement PWA features (`public/manifest.json`, `public/sw.js`, and SW registration).
- [ ] Build shared navigation components (Responsive Navbar for Desktop/Tablet, Bottom Navigation Bar for Mobile).
- [ ] Build Authentication views (Login with Split-Screen visual & Google OAuth redirect, Register).
- [ ] Setup Laravel REST API endpoints for User, Guide, and Admin portals.
- [ ] Build Traveler Portal (Responsive Home, Category Filter, Guide Detail, Booking, Invoice).
- [ ] Build Guide Portal (Dashboard, Schedule/Availability Toggle, Earnings).
- [ ] Build Admin Portal (Platform Analytics, User & Guide Management).
- [ ] Test & Verify deployment script (`deploy.sh`) for Supabase PostgreSQL.

*Note to Agent: always tell the developer what you have done.*