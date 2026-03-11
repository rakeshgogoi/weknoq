# 🌀 Weknoq

> The world's knowledge, finally looped together.

A self-hosted educational video aggregator. Pulls from YouTube, TED, and more — organized into topics and learning paths.

---

## Stack

| Layer       | Tech                              |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router) + Tailwind |
| Backend     | Next.js API Routes                |
| Database    | PostgreSQL + Prisma ORM           |
| Auth        | NextAuth.js (Google OAuth)        |
| Cache       | Redis (ioredis)                   |
| AI Tagger   | Python FastAPI + OpenAI / Ollama  |
| Hosting     | Docker Compose on Hetzner VPS     |
| Proxy       | Nginx + SSL                       |

---

## Quick Start (Local Dev)

### 1. Clone and install

```bash
git clone https://github.com/yourname/weknoq
cd weknoq
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Fill in: DATABASE_URL, NEXTAUTH_SECRET, YOUTUBE_API_KEY, GOOGLE_CLIENT_ID/SECRET
```

### 3. Start Postgres + Redis via Docker

```bash
docker compose up postgres redis -d
```

### 4. Push DB schema + seed topics

```bash
npm run db:push
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## Ingest Videos

To pull videos from YouTube into your database:

```bash
curl -X POST http://localhost:3000/api/youtube/ingest \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_INGEST_API_KEY" \
  -d '{ "query": "python tutorial", "topicSlug": "programming", "maxResults": 20 }'
```

Add this as a daily cron job to keep content fresh.

---

## Self-Hosted Deployment (Hetzner VPS)

```bash
# 1. SSH into your VPS
ssh root@your-vps-ip

# 2. Clone the repo
git clone https://github.com/yourname/weknoq && cd weknoq

# 3. Copy and fill env
cp .env.example .env && nano .env

# 4. Add SSL certs (using Certbot)
certbot certonly --standalone -d yourdomain.com
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem   nginx/ssl/

# 5. Build and run everything
docker compose up -d --build

# 6. Run migrations
docker compose exec web npx prisma migrate deploy
docker compose exec web npx ts-node packages/db/prisma/seed.ts
```

---

## Project Structure

```
weknoq/
├── apps/
│   └── web/                  ← Next.js 14 app
│       ├── app/              ← App Router pages + API routes
│       ├── components/       ← UI components
│       └── lib/              ← youtube.ts, tagger.ts, cache.ts
├── packages/
│   └── db/                   ← Prisma schema + client (shared)
├── services/
│   └── ai-tagger/            ← Python FastAPI (optional AI upgrade)
├── nginx/                    ← Nginx reverse proxy config
├── docker-compose.yml
└── .env.example
```

---

## Tagging Strategy

**MVP (no cost):** Rule-based keyword matching in `lib/tagger.ts`.
Works surprisingly well for common topics.

**Upgrade path:** Once you have traction, enable the AI tagger:
- Set `OPENAI_API_KEY` → uses `gpt-4o-mini` (~$0.001/video)
- Or set `OLLAMA_HOST` → free, runs locally, needs 8GB+ RAM

---

## YouTube API Quota

Free quota: **10,000 units/day**
- `search.list` = 100 units → 100 searches/day
- `videos.list` =   1 unit  → 10,000 detail fetches/day

**Tip:** Run ingest jobs at off-peak hours. Cache all results in Redis + DB so the API is only hit during ingest, not user queries.

---

## Estimated Cost

| Service         | Cost         |
|-----------------|--------------|
| Hetzner CX22    | ~€6/mo       |
| Domain          | ~₹800/yr     |
| YouTube API     | Free         |
| Redis (Upstash) | Free tier    |
| OpenAI (opt.)   | ~$5–10/mo    |
| **Total**       | **~$10–15/mo** |

---

## License

MIT — build something great.
