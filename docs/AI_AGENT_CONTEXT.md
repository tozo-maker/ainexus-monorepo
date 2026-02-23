# AILexus — AI Agent Context & Rules

## What This App Is
AILexus is a compliance-first AI tool directory. Its core value is accurate, 
defensible compliance data for every tool. Data quality is the product.

## Before You Touch Any Compliance Data
Read /docs/SCORING_RUBRIC.md first. Every time. Without exception.

## Scoring Rules (non-negotiable)
1. EU AI Act risk tiers follow the DESIGN of the tool, not downstream use cases.
   A general-purpose LLM is ALWAYS "minimal" or "limited" — never "high".
2. Open-source/self-hosted tools get Data Governance Grade "N/A" (best outcome).
3. Every score must have a scoring_rationale string explaining the basis.
4. compliance_last_reviewed must be updated whenever scores change.
5. Never hardcode statistics in the UI — all counts must be derived from real data.

## When Adding a New Tool
- Apply the EU AI Act decision tree from /docs/SCORING_RUBRIC.md
- Do not guess risk tiers — use the decision tree
- If insufficient public info: set tier to "unclassified" with a rationale explaining why
- Fill ALL compliance fields — no nulls except where explicitly allowed by the schema

## When Updating Existing Tools
- Read the current scoring_rationale before changing any scores
- If you change a score, update compliance_last_reviewed to today
- Document what changed and why in the scoring_rationale

## Key Files
- /docs/SCORING_RUBRIC.md — canonical scoring methodology
- /docs/AI_AGENT_CONTEXT.md — this file
- Schema definition: The `tools` table in Supabase.

## Methodology Page
Public-facing explanation of scoring lives at /methodology route.
Keep it in sync with /docs/SCORING_RUBRIC.md whenever the rubric changes.
