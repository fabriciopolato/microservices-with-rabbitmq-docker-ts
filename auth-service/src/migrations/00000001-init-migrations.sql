CREATE TABLE IF NOT EXISTS Migrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);