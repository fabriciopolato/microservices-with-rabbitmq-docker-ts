CREATE TABLE IF NOT EXISTS "office_attendance" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR DEFAULT NULL,
  "country" VARCHAR DEFAULT NULL,
  "office" VARCHAR DEFAULT NULL,
  "attendedAt" TIMESTAMP DEFAULT NOW()
);