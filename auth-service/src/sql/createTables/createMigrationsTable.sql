CREATE TABLE IF NOT EXISTS "migrations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "file" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);