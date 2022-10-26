CREATE TABLE IF NOT EXISTS "OfficeAttendance" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "country" varchar,
  "office" varchar,
  "attendedAt" timestamp default NOW(),
)