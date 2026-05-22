# Mehfil — A Gathering for Verse

A social platform for English-language poetry. Post poems, react, comment, follow writers.

## Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose

### Setup

```bash
# Start PostgreSQL
docker compose up -d

# Backend
cd backend && npm i && npx prisma migrate dev && npm run seed && npm run dev

# Frontend (in another terminal)
cd frontend && npm i && npm run dev
```

Backend runs at `http://localhost:4000`, frontend at `http://localhost:5173`.

### Seed Data
- Creates admin only if missing: `admin@gmail.com` / `Admin@123` (re-runs do not change existing users or posts)

## Deployment (Render Free Tier)

Uses `render.yaml` for infrastructure-as-code. Three free resources:
- **mehfil-api** — Node.js web service
- **mehfil-web** — Static site (React)
- **mehfil-db** — Managed PostgreSQL

After first deploy:
1. Set `CORS_ORIGIN` on the API to the static site URL
2. Set `VITE_API_BASE_URL` on the frontend to `https://<api-url>/api/v1`
3. Set `SUPERADMIN_EMAILS` on the API

> **Note:** Free Postgres on Render expires after 30 days. Back up data before expiry.

> **Note:** The API spins down after ~15 min of inactivity. First request may take 30-60s.
