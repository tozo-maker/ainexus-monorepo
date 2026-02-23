## ⚠️ CRITICAL CONTEXT — READ BEFORE DOING ANYTHING

This app is a compliance-first AI tool directory. Its core value proposition is that 
every tool has accurate, defensible EU AI Act risk scores, GDPR grades, and transparency 
ratings. Currently, several tools have WRONG compliance data (e.g. general-purpose LLMs 
incorrectly labelled "High Risk"). This is the most important thing to fix.

The scoring rubric below is the canonical source of truth for ALL compliance data 
in this app — now and in every future update. Save it as a file in the repo at:

  /docs/SCORING_RUBRIC.md

Every time a new tool is added, every time compliance data is updated, every time an AI 
agent works on this codebase — it must consult /docs/SCORING_RUBRIC.md first.

---

## THE SCORING RUBRIC (save as /docs/SCORING_RUBRIC.md)

### EU AI Act Risk Tier — Decision Logic

The risk tier is determined by the tool's DESIGN and INTENDED USE — not by how a 
customer might deploy it downstream. Apply the following decision tree:

STEP 1: Is the tool on the Article 5 prohibited list?
  - Social scoring of individuals by public authorities
  - Real-time remote biometric identification in public spaces (law enforcement)
  - Subliminal manipulation exploiting vulnerabilities
  → YES: tier = "unacceptable"

STEP 2: Is the tool specifically designed for an Annex III high-risk use case?
  - Biometric identification or categorisation at scale
  - Critical infrastructure management (power grids, water, traffic)
  - Educational access decisions or assessment scoring
  - Employment: CV screening, automated hiring decisions, performance monitoring
  - Access to credit, insurance, or social benefits
  - Law enforcement: crime prediction, evidence evaluation, polygraphs
  - Migration, asylum, border risk assessment
  - Court/judicial decision support
  → YES: tier = "high"

STEP 3: Is the tool a public-facing conversational agent OR does it generate 
synthetic media (video, audio, images) that could be mistaken for real?
  → YES: tier = "limited"
  (These require transparency/disclosure obligations under Article 50)

STEP 4: Everything else → tier = "minimal"

STEP 5: If public information is genuinely insufficient to classify → tier = "unclassified"

CRITICAL RULE: A general-purpose LLM (ChatGPT, Claude, Gemini, Llama, etc.) is ALWAYS 
"minimal" or "limited" — never "high" — unless it is specifically marketed and 
designed for an Annex III use case. Being capable of discussing medical topics does 
not make a general LLM "high risk."

### Compliance Score (0–100) — 5 components × 20 points each

Component A — Transparency & Documentation (0–20):
  18–20: Model card published, training data disclosed, third-party evaluations exist
  13–17: Partial model documentation, some training data disclosure
  8–12:  Basic product documentation only, no model-level transparency
  3–7:   Marketing copy only, minimal documentation
  0–2:   No meaningful documentation, black box

Component B — Data Governance Disclosure (0–20):
  18–20: Privacy policy explicitly covers retention period, training use, opt-out mechanism,
         third-party sharing, DPA contact
  13–17: Most of the above present, one or two gaps
  8–12:  Basic privacy policy, little detail on retention or training use
  3–7:   Vague policy, cannot determine training data practices
  0–2:   No privacy policy or clearly deceptive

Component C — GDPR / Regulatory Alignment (0–20):
  18–20: GDPR DPA available, EU data residency option, formal certifications (SOC2/ISO27001),
         EU AI Act compliance statement published
  13–17: DPA available, some EU-specific compliance features, no formal certifications
  8–12:  Claims GDPR compliance without substantial evidence
  3–7:   Minimal GDPR acknowledgement, no DPA
  0–2:   Active violations, enforcement actions, or no GDPR acknowledgement

Component D — Safety & Misuse Prevention (0–20):
  18–20: Published safety policy, red-teaming results disclosed, abuse reporting mechanism,
         content policies documented, regular safety updates
  13–17: Clear usage policies, basic abuse reporting, some safety documentation
  8–12:  Generic ToS prohibitions only
  3–7:   Minimal restrictions
  0–2:   No restrictions or designed to circumvent safety norms

Component E — Accountability & Contact (0–20):
  18–20: Named ethics/compliance contact, public incident response history,
         EU representative named (required for non-EU companies under GDPR)
  13–17: Clear contact for compliance issues, some accountability mechanisms
  8–12:  General support contact only
  3–7:   No clear compliance contact
  0–2:   Unreachable or anonymised operator

### Data Governance Grade (A–F):
  A:   Does NOT train on user data by default. Clear opt-out. Explicit retention limits. Data deletion on request.
  B:   Does not train by default OR has clear opt-out. Retention policy stated.
  C:   May train on user data. Opt-out exists but not default or hard to find. Vague retention.
  D:   Trains on user data, no easy opt-out. Unclear retention. Third-party sharing unclear.
  F:   Trains on user data, no opt-out. No deletion mechanism. Active violations or breaches.
  N/A: Open-source or self-hosted. User controls all data. Zero centralised collection.
       Note: N/A is the BEST possible outcome — the user has full data sovereignty.

### Transparency Index (0–100):
  Model card or equivalent published:  25 points
  Open weights / open source:          20 points
  Training data disclosed:             15 points
  Third-party evaluations published:   15 points
  Benchmark performance published:     10 points
  Audit history documented:            10 points
  Known limitations explicitly stated:  5 points

---

## SECTION 1 — CORRECT COMPLIANCE DATA FOR ALL TOOLS

This is the highest-priority task. Find ALL tools in the database/data source 
and apply the correct compliance data based on the rubric above.

For tools already in the database with wrong scores, update them.
For any tool missing compliance fields, add them.

Apply these specific corrections (matched by tool name, case-insensitive):

---
TOOL: Claude (by Anthropic)
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 87
  data_governance_grade: "A"
  gdpr_compliant: true
  trains_on_user_data: false
  transparency_index: 82
  scoring_rationale: "General-purpose LLM assistant — Minimal Risk by design. Anthropic publishes Constitutional AI research and a model card. Does not train on user conversations by default. Strong GDPR DPA available at privacy.anthropic.com."

---
TOOL: ChatGPT (by OpenAI)
  eu_ai_act_risk_tier: "limited"
  compliance_score: 71
  data_governance_grade: "B"
  gdpr_compliant: true
  trains_on_user_data: true
  transparency_index: 68
  scoring_rationale: "Limited Risk: public-facing conversational agent requires EU AI Act Article 50 transparency obligations. Trains on conversations unless opted out via settings. GDPR DPA available. OpenAI has published system cards and safety evaluations."

---
TOOL: Cursor (by Anysphere)
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 74
  data_governance_grade: "B"
  gdpr_compliant: true
  trains_on_user_data: true
  transparency_index: 65
  scoring_rationale: "General-purpose coding assistant — Minimal Risk. Uses code context to improve models unless Privacy Mode is enabled. SOC2 Type II certified. No published model card for the underlying model."

---
TOOL: Midjourney
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 52
  data_governance_grade: "C"
  gdpr_compliant: false
  trains_on_user_data: true
  transparency_index: 38
  scoring_rationale: "General-purpose image generation — Minimal Risk. Trains on all user prompts and outputs with no opt-out mechanism. No formal GDPR DPA. No published model card. Ongoing IP and copyright litigation regarding training data."

---
TOOL: ElevenLabs
  eu_ai_act_risk_tier: "limited"
  compliance_score: 65
  data_governance_grade: "B"
  gdpr_compliant: true
  trains_on_user_data: false
  transparency_index: 61
  scoring_rationale: "Limited Risk: voice cloning creates synthetic audio requiring Article 50 disclosure obligations. Does not train on user audio by default. GDPR DPA available. Responsible AI policy published on website."

---
TOOL: Kling AI (by Kuaishou)
  eu_ai_act_risk_tier: "limited"
  compliance_score: 38
  data_governance_grade: "D"
  gdpr_compliant: false
  trains_on_user_data: true
  transparency_index: 22
  scoring_rationale: "Limited Risk: generates synthetic video requiring Article 50 disclosure. Chinese operator with minimal EU-facing compliance documentation. No published model card. Privacy policy vague on data retention. No GDPR DPA located."

---
TOOL: Perplexity
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 74
  data_governance_grade: "B"
  gdpr_compliant: true
  trains_on_user_data: false
  transparency_index: 70
  scoring_rationale: "General-purpose AI search — Minimal Risk. Privacy policy explicitly states search queries are not used to train models. GDPR policy documented. Limited model-level transparency — no model card published."

---
TOOL: Stable Diffusion (by Stability AI)
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 88
  data_governance_grade: "A"
  gdpr_compliant: true
  trains_on_user_data: false
  transparency_index: 92
  scoring_rationale: "Open-source image generation — Minimal Risk. Self-hosted deployments have zero centralised data collection, earning an automatic A grade. Model weights fully open. Training dataset (LAION) publicly documented."

---
TOOL: Ollama
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 94
  data_governance_grade: "N/A"
  gdpr_compliant: true
  trains_on_user_data: false
  transparency_index: 96
  scoring_rationale: "Fully local, self-hosted LLM runner — Minimal Risk. Zero centralised data collection; the user owns all data entirely. N/A data governance grade reflects complete data sovereignty. Open-source with active GitHub community."

---
TOOL: Suno
  eu_ai_act_risk_tier: "limited"
  compliance_score: 55
  data_governance_grade: "C"
  gdpr_compliant: false
  trains_on_user_data: true
  transparency_index: 42
  scoring_rationale: "Limited Risk: generates synthetic vocals that could be mistaken for real artists, triggering Article 50 obligations. Trains on user-generated songs. No GDPR DPA available. Active copyright litigation regarding training data sources."

---
TOOL: Runway
  eu_ai_act_risk_tier: "limited"
  compliance_score: 61
  data_governance_grade: "C"
  gdpr_compliant: false
  trains_on_user_data: true
  transparency_index: 52
  scoring_rationale: "Limited Risk: generates synthetic video media under Article 50. ToS grants Runway rights to use content for training. No GDPR DPA found. Published some model research but no formal model card."

---
TOOL: Replit
  eu_ai_act_risk_tier: "minimal"
  compliance_score: 72
  data_governance_grade: "B"
  gdpr_compliant: true
  trains_on_user_data: true
  transparency_index: 67
  scoring_rationale: "General-purpose cloud IDE — Minimal Risk. Uses code to improve AI models per ToS. SOC2 Type II certified. GDPR DPA available. No published model card for the Ghostwriter AI feature."

---

For ANY tool in the database NOT listed above, apply the following logic:
  1. Read the tool's category and description
  2. Apply the EU AI Act decision tree from the rubric (Unacceptable → High → Limited → Minimal)
  3. If insufficient information: set eu_ai_act_risk_tier = "unclassified"
  4. Set compliance_score, data_governance_grade, and transparency_index to best-effort 
     estimates based on available data, with a scoring_rationale explaining the basis
  5. Set compliance_last_reviewed to today's date

Do NOT leave any tool with null or empty compliance fields after this migration.

---

## SECTION 2 — ADD SCORING RATIONALE AND REVIEW DATE TO DATA MODEL

Add these fields to the tool schema if they do not already exist:
  scoring_rationale: string (nullable) — plain text explanation of the score
  compliance_last_reviewed: date — when compliance data was last verified

Default compliance_last_reviewed for all existing records: today's date.

On the individual tool profile page, display:
  - "Why this score:" followed by the scoring_rationale in small italic text
  - "Last reviewed: [Month Year]" (e.g. "Last reviewed: Feb 2026")
  - A muted "Request a review →" link to mailto:compliance@ainexus.io

---

## SECTION 3 — CREATE /docs/SCORING_RUBRIC.md IN THE REPO

Create the file /docs/SCORING_RUBRIC.md in the repository root.

Copy the entire scoring rubric from the top of this prompt into that file.

Add this header to the file:
  # AILexus Compliance Scoring Rubric
  ### Version 1.0 — February 2026
  ### This is the canonical source of truth for all compliance scoring in this codebase.
  ### Every AI agent, developer, or automated process adding or updating tool data
  ### MUST consult this file before assigning compliance scores.

This file must be committed to the repo so it persists and is available to any 
future AI coding session, developer, or automated pipeline working on this codebase.

---

## SECTION 4 — CREATE A SCORING CONTEXT FILE FOR AI AGENTS

Create the file /docs/AI_AGENT_CONTEXT.md in the repository root.

This file is specifically written to brief any AI coding agent (Claude, GPT, Cursor, 
Antigravity, etc.) that opens this codebase in a future session. Content:

---
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
- Schema definition: [point to wherever the Tool type/table is defined]

## Methodology Page
Public-facing explanation of scoring lives at /methodology route.
Keep it in sync with /docs/SCORING_RUBRIC.md whenever the rubric changes.
---

---

## SECTION 5 — BUILD THE /METHODOLOGY PAGE

Create a new page at the route /methodology. Style it consistently with the 
rest of the app (dark theme, same navigation).

The page must contain:

TITLE: "How We Score AI Tools"
SUBTITLE: "Every score on AILexus is derived from a documented, repeatable methodology. 
Here's exactly how it works."

SECTION: The Four Dimensions
List with brief descriptions:
1. EU AI Act Risk Tier — Minimal / Limited / High / Unacceptable / Unclassified
2. Compliance Score — 0 to 100, based on 5 weighted criteria
3. Data Governance Grade — A to F (or N/A for self-hosted tools)
4. Transparency Index — 0 to 100, based on 7 openness criteria

SECTION: EU AI Act Risk Tiers
Show each tier as a coloured card:
- MINIMAL (green): General-purpose tools. No Annex III use case.
- LIMITED (yellow): Public chatbots and synthetic media generators. 
  Article 50 transparency obligations apply.
- HIGH (orange): Annex III use cases — hiring, credit scoring, law enforcement, 
  education access, critical infrastructure. Requires conformity assessment.
- UNACCEPTABLE (red): Article 5 prohibited. Cannot be legally deployed in the EU.
- UNCLASSIFIED (grey): Insufficient public information to determine.

Important callout box (visually distinct): 
"Risk tier follows the tool's design and intended use — not how a customer deploys it.
A general-purpose LLM used for medical research is still Minimal Risk. The clinical 
application built on top of it is a separate High Risk system."

SECTION: Compliance Score (0–100)
Table with 5 rows:
| Component               | Max Score |
|-------------------------|-----------|
| Transparency & Documentation | 20 |
| Data Governance Disclosure   | 20 |
| GDPR / Regulatory Alignment  | 20 |
| Safety & Misuse Prevention   | 20 |
| Accountability & Contact     | 20 |

SECTION: Data Governance Grade
Table:
| Grade | Meaning |
|-------|---------|
| A | Does not train on your data by default. Explicit retention limits. Data deletion available. |
| B | Does not train by default OR has a clear opt-out. Retention policy stated. |
| C | May train on your data. Opt-out exists but not default or hard to find. |
| D | Trains on your data with no easy opt-out. Unclear retention. |
| F | Trains on your data, no opt-out, no deletion. Active violations or breaches. |
| N/A | Self-hosted or open-source. You control all data. The best possible outcome. |

SECTION: Transparency Index (0–100)
Table:
| Criterion                   | Points |
|-----------------------------|--------|
| Model card published        | 25 |
| Open weights / open source  | 20 |
| Training data disclosed     | 15 |
| Third-party evaluations     | 15 |
| Benchmarks published        | 10 |
| Audit history               | 10 |
| Known limitations stated    |  5 |

SECTION: Our Sources
Numbered list:
1. Tool's own official documentation (privacy policy, ToS, model cards, trust portals)
2. EU official sources (artificialintelligenceact.eu, national DPA decisions, EU AI Office)
3. Independent bodies (ToS;DR, IAPP enforcement tracker, Common Sense Privacy)
4. Credible investigative journalism
5. Academic and security research

SECTION: Review Policy
"Scores are reviewed every 90 days as standard. Reviews are triggered immediately 
by a material privacy policy change, data breach, DPA enforcement action, or 
significant product change. Tool makers can request a review at compliance@ainexus.io. 
All score changes are logged with a date and rationale."

SECTION: Disclaimer
"AILexus scores are based on publicly available information and independent analysis. 
They are for informational purposes only and do not constitute legal advice. 
For formal compliance assessments, consult a qualified legal or compliance professional."

Add a link to /methodology in:
- The site footer (label: "Methodology")
- Near the compliance scores on every tool profile page (label: "How we score this")

---

## SECTION 6 — MAKE HERO STATS FULLY DYNAMIC

Find where the hero stats are defined. Replace ALL hardcoded values with 
live counts derived from the actual data source.

Stat 1 — "Tools Catalogued": COUNT of all published tools in the database
Stat 2 — "Categories Covered": COUNT DISTINCT of all category values
Stat 3 — "GDPR Graded": COUNT of tools where gdpr_compliant IS NOT NULL
Stat 4 — Change label to "EU AI Act Scored", value = COUNT of tools where 
          eu_ai_act_risk_tier IS NOT NULL AND eu_ai_act_risk_tier != 'unclassified'

Show a loading skeleton while fetching. Animate numbers counting up on load.
Do not hardcode any of these numbers, ever.

---

## SECTION 7 — ADD "WHY THIS SCORE" TOOLTIP ON ALL TOOL CARDS

On every tool card, add a small ⓘ icon next to the EU AI Act risk badge.

On hover (desktop) / tap (mobile): show a tooltip with:
  - The scoring_rationale text for that tool
  - A small link: "Full methodology →" linking to /methodology

If scoring_rationale is null, show fallback:
  "Score based on publicly available documentation. See our full methodology."

Tooltip style: dark bg (rgba(0,0,0,0.92)), white text, 12px font, max-width 280px,
border-radius 8px, 10px 14px padding, positioned above the badge with a small caret.
Must not overflow on mobile — cap width at 90vw on small screens.

---

## SECTION 8 — ENSURE EVERY FUTURE NEW TOOL FOLLOWS THE RUBRIC

In the admin panel or tool submission flow (wherever new tools are added):

1. Add a code comment above the compliance fields pointing to /docs/SCORING_RUBRIC.md:
   // ⚠️ All compliance scores must follow /docs/SCORING_RUBRIC.md
   // Do not estimate — use the EU AI Act decision tree in that file.

2. Add validation: if eu_ai_act_risk_tier is null or empty when saving a tool, 
   show a warning: "Risk tier is required. See /docs/SCORING_RUBRIC.md for guidance."

3. Set compliance_last_reviewed automatically to today's date whenever 
   any compliance field (eu_ai_act_risk_tier, compliance_score, data_governance_grade, 
   transparency_index, gdpr_compliant, trains_on_user_data) is updated.

---

## FINAL CONSTRAINTS

- Do not change the dark theme, navigation structure, or card grid layout
- Do not remove any existing fields or functionality  
- All TypeScript must be properly typed — no `any` types on compliance-related code
- The /methodology page must be publicly accessible without authentication
- The /docs/ files must be committed to the repo root so they persist across sessions
- Tooltips must not break card layout on any screen size
- After completing all sections, run a final check: query the database and confirm 
  that zero tools have eu_ai_act_risk_tier = null or eu_ai_act_risk_tier = ''
- Commit message: "feat: compliance rubric v1.0 — corrected all risk tiers, 
  methodology page, AI agent context, dynamic stats, scoring tooltips, 
  future-proof workflow enforcement"
