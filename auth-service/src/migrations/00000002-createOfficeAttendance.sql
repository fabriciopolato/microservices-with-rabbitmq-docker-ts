CREATE TABLE IF NOT EXISTS "OfficeAttendance" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR,
  "country" VARCHAR,
  "office" VARCHAR,
  "attendedAt" TIMESTAMP DEFAULT NOW(),
)