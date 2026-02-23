-- Phase 6 Compliance Refinement Schema Updates
-- Run this in your Supabase SQL Editor

ALTER TABLE tools
ADD COLUMN IF NOT EXISTS scoring_rationale TEXT,
ADD COLUMN IF NOT EXISTS compliance_last_reviewed DATE;

-- Backfill any existing compliance rows with today's date
UPDATE tools 
SET compliance_last_reviewed = CURRENT_DATE 
WHERE compliance_last_reviewed IS NULL;
