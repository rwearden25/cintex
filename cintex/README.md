# Cintex (by RockStandard) — Starter App

This is a ready-to-push starter for:
- Roles: admin / tech
- Pages: Dashboard (Overview/Content/Tips Queue/KB Gaps/Chat Logs), Knowledge Base (Contents/Web Scraper/Analytics), Users (Accounts)
- Postgres via Prisma
- OpenAI chat endpoint

## Quickstart (local)
1) Install deps:
   - npm i
2) Create `.env` (see `.env.example`)
3) Run migrations + seed an admin:
   - npm run prisma:migrate
   - npm run seed
4) Start:
   - npm run dev

## Deploy (Vercel + Railway)
- Railway: provision Postgres and copy `DATABASE_URL`
- Vercel: import repo, set env vars from `.env.example`, deploy.
