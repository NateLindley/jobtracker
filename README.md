# JobTracker

A full-stack job application tracker built with React, Express, Prisma, and PostgreSQL.
Built as a Postgres learning project covering JSONB, many-to-many relations, transactions, and indexed queries.

## Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: Express + TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL 16 (Docker)

## Setup

### 1. Start Postgres

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # Already configured for Docker
npx prisma migrate dev --name init
npm run db:seed               # Optional: adds sample data
npm run dev
```

Backend runs at: http://localhost:3001

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/applications | List all (supports ?status=APPLIED) |
| GET | /api/applications/:id | Get one |
| POST | /api/applications | Create |
| PATCH | /api/applications/:id | Update (uses transaction) |
| DELETE | /api/applications/:id | Delete |

---

## Key Postgres Concepts Demonstrated

- **JSONB**: The `notes` field stores arbitrary JSON objects
- **Many-to-many**: `JobApplication` ↔ `Tag` via Prisma's implicit join table
- **Index**: `@@index([status])` on `JobApplication` for filtered queries
- **Transactions**: PATCH uses `prisma.$transaction` to safely reset and reconnect tags
- **MVCC**: Postgres handles concurrent reads/writes without read locks

### Exploring the DB directly

```bash
# Open Prisma Studio (GUI)
cd backend && npm run db:studio

# Or connect via psql
docker exec -it $(docker ps -qf "ancestor=postgres:16") psql -U jobtracker -d jobtracker

# Useful queries to run manually:
# EXPLAIN ANALYZE SELECT * FROM "JobApplication" WHERE status = 'APPLIED';
# SELECT * FROM "JobApplication" WHERE notes->>'salary' IS NOT NULL;
# SELECT j.company, array_agg(t.name) FROM "JobApplication" j JOIN "_JobApplicationToTag" jt ON j.id = jt."A" JOIN "Tag" t ON t.id = jt."B" GROUP BY j.company;
```

---

## Interview Talking Points

1. **Why Prisma over raw SQL?** Type safety, migrations, and readable query API — but I can drop to `prisma.$queryRaw` when needed.
2. **Why index on status?** Low-cardinality columns used in WHERE clauses benefit from indexes; verified with EXPLAIN ANALYZE.
3. **Why a transaction in PATCH?** Updating many-to-many relations requires disconnect + reconnect — a transaction ensures atomicity.
4. **Why JSONB for notes?** Flexible, schema-less data that varies per application doesn't warrant its own normalized table.
