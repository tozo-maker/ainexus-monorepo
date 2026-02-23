# AILexus Compliance Scoring Rubric
### Version 1.0 — February 2026
### *The methodology behind every score on the platform*

---

## Why This Document Exists

Every score on AILexus is derived from a documented, repeatable methodology. This page exists so that:
- Developers can understand exactly what a score means before relying on it
- Tool makers can know what to improve to raise their grade
- Journalists and compliance teams can cite our methodology
- We can defend every score if challenged

**Important disclaimer:** AILexus scores are based on publicly available information and our own analysis. They are for informational purposes only and do not constitute legal advice. For formal compliance assessments, consult a qualified legal or compliance professional.

---

## The Four Dimensions We Score

Every tool is scored across four independent dimensions. Each has its own methodology.

---

## Dimension 1 — EU AI Act Risk Tier

**What it is:** A classification of the tool into one of four risk tiers defined by the EU Artificial Intelligence Act (Regulation 2024/1689).

**What it is NOT:** An assessment of whether the tool maker is currently compliant. It is a classification of the tool's inherent risk category based on its design and intended use.

### The Four Tiers

---

### 🟢 MINIMAL RISK

**Definition:** Tools that present little to no risk to fundamental rights or safety. The vast majority of AI tools fall here.

**Apply this tier when ALL of the following are true:**
- The tool is a general-purpose AI assistant, generator, or productivity tool
- It is not specifically designed or marketed for any of the Annex III high-risk use cases
- It does not make consequential autonomous decisions about people's lives
- It is not used in safety-critical infrastructure

**Examples:** ChatGPT (general tier), Claude, Cursor, Midjourney, Stable Diffusion, Ollama, Perplexity, ElevenLabs, Suno, GitHub Copilot, Notion AI, Grammarly

**Important nuance:** A general-purpose LLM used *by a customer* for medical diagnosis is still Minimal Risk at the tool level — the risk classification follows the tool's design, not a downstream use case.

---

### 🟡 LIMITED RISK

**Definition:** Tools subject to specific transparency obligations. Primarily tools that interact directly with end users in ways that could cause confusion about whether they are talking to a human.

**Apply this tier when ANY of the following are true:**
- The tool is a chatbot or conversational agent deployed to interact with the public (Article 50 obligations)
- The tool generates synthetic media (deepfakes, synthetic voices, AI images) intended to be mistaken for real content
- The tool is used in emotion recognition or biometric categorisation in non-prohibited contexts

**The key obligation:** Users must be informed they are interacting with AI. The tool must have watermarking or disclosure mechanisms.

**Examples:** Customer-facing chatbot platforms, AI avatar tools, voice cloning tools used in customer service, deepfake detection tools (ironic — the detection requirement creates transparency obligations), AI-generated news tools

**How to decide between Minimal and Limited:** Ask "Could a reasonable person be deceived about whether this is AI-generated or AI-operated?" If yes → Limited Risk.

---

### 🔴 HIGH RISK

**Definition:** AI systems listed in Annex III of the EU AI Act. These require conformity assessments, technical documentation, human oversight mechanisms, and registration in the EU database before deployment.

**Apply this tier when the tool is specifically designed for ANY of these Annex III use cases:**

| Annex III Category | Examples |
|---|---|
| Biometric identification and categorisation | Facial recognition, gait analysis, emotion detection at scale |
| Critical infrastructure management | AI managing power grids, water systems, traffic |
| Educational or vocational training | AI that determines access to education, assessment scoring |
| Employment and worker management | CV screening, automated hiring decisions, performance monitoring |
| Access to essential private/public services | Credit scoring, insurance risk, social benefits assessment |
| Law enforcement | Polygraph tools, crime prediction, evidence evaluation |
| Migration, asylum, border management | Risk assessment of individuals at borders |
| Administration of justice | AI assisting courts in legal decisions |

**High risk does NOT mean the tool is dangerous or illegal.** It means it requires more rigorous oversight and documentation to deploy legally.

**Examples:** HireVue (hiring AI), Schufa (credit scoring AI), predictive policing tools, AI proctoring tools for exams, AI welfare benefit assessment systems

---

### 🚫 UNACCEPTABLE RISK (PROHIBITED)

**Definition:** AI practices explicitly prohibited under Article 5 of the EU AI Act. These cannot be legally deployed in the EU.

**Apply this tier ONLY if the tool is designed for:**
- Social scoring of individuals by public authorities
- Real-time remote biometric identification in public spaces for law enforcement (with narrow exceptions)
- Subliminal manipulation techniques that exploit vulnerabilities
- Exploitation of specific vulnerable groups
- Untargeted scraping of facial images from the internet to build recognition databases

**These tools should not be listed without clear context and warnings.**

---

### 🔘 UNCLASSIFIED

**Apply when:**
- Insufficient public information to make a determination
- The tool operates in multiple tiers depending on configuration
- The tool is new and the use case is genuinely ambiguous

**Always include a note explaining why it is unclassified.**

---

### EU AI Act Tier — Decision Flowchart

```
START: What does this tool primarily do?
│
├─ Is it on the Article 5 prohibited list?
│   YES → UNACCEPTABLE RISK
│   NO  ↓
│
├─ Is it designed for an Annex III use case?
│   YES → HIGH RISK
│   NO  ↓
│
├─ Is it a public-facing chatbot OR generates synthetic
│  media that could be mistaken for real?
│   YES → LIMITED RISK
│   NO  ↓
│
└─ MINIMAL RISK
```

---

## Dimension 2 — Compliance Score (0–100)

**What it measures:** How well the tool maker has documented, disclosed, and implemented responsible AI practices. This is about the *quality of their compliance posture*, not just the risk tier.

A Minimal Risk tool can score low (poor documentation) and a High Risk tool can score high (excellent documentation and oversight).

### Scoring Criteria (5 components, 20 points each)

---

### Component A — Transparency & Documentation (0–20)

| Points | Evidence |
|---|---|
| 18–20 | Model card or equivalent published. Training data disclosed. Architecture documented. Third-party evaluations published. |
| 13–17 | Partial model documentation. Some training data disclosure. Limited but meaningful transparency. |
| 8–12 | Basic product documentation only. No model-level transparency. |
| 3–7 | Minimal documentation. Marketing copy only. |
| 0–2 | No meaningful documentation. Black box. |

**Sources to check:** Official docs site, HuggingFace model card, research papers, system card (Anthropic/OpenAI style), GitHub README for open-source tools.

---

### Component B — Data Governance Disclosure (0–20)

| Points | Evidence |
|---|---|
| 18–20 | Privacy policy explicitly states: data retention period, whether prompts/outputs are used for training, opt-out mechanism exists, third-party data sharing disclosed, DPA contact listed. |
| 13–17 | Most of the above present. One or two gaps. Opt-out available but not prominent. |
| 8–12 | Basic privacy policy. States data is collected. Little detail on retention or training use. |
| 3–7 | Vague privacy policy. Cannot determine training data practices. |
| 0–2 | No privacy policy, inaccessible, or clearly deceptive. |

**Sources to check:** Privacy policy URL (must be accessible without login), ToS;DR grade if available, help centre documentation on data practices.

---

### Component C — GDPR / Regulatory Alignment (0–20)

| Points | Evidence |
|---|---|
| 18–20 | GDPR DPA available. EU data residency option or commitment. Formal compliance documentation (SOC2, ISO 27001, or equivalent). EU AI Act compliance statement published. |
| 13–17 | DPA available. Some EU-specific compliance features. No formal certifications but strong signals. |
| 8–12 | Claims GDPR compliance without substantial evidence. Basic DPA template only. |
| 3–7 | Minimal GDPR acknowledgement. No DPA. No EU-specific documentation. |
| 0–2 | Active violations, DPA enforcement actions, or no acknowledgement of GDPR applicability. |

**Sources to check:** Trust portal (e.g. trust.openai.com), compliance certifications page, DPA/data processing agreement availability, IAPP enforcement tracker.

---

### Component D — Safety & Misuse Prevention (0–20)

| Points | Evidence |
|---|---|
| 18–20 | Published safety/usage policy. Red-teaming results disclosed. Abuse reporting mechanism. Content policies publicly documented. Regular safety updates published. |
| 13–17 | Clear usage policies. Basic abuse reporting. Some safety documentation. |
| 8–12 | Generic terms of service prohibitions. No dedicated safety page. |
| 3–7 | Minimal restrictions. No visible misuse prevention. |
| 0–2 | No restrictions. Tool is explicitly designed to circumvent safety norms. |

**Sources to check:** Usage policies page, safety research publications, bug bounty / responsible disclosure policy.

---

### Component E — Accountability & Contact (0–20)

| Points | Evidence |
|---|---|
| 18–20 | Named AI ethics/compliance contact or team. Public incident response history. Responds to researcher/user concerns publicly. EU representative named (required for non-EU companies under GDPR). |
| 13–17 | Clear contact for data/compliance issues. Some accountability mechanisms. |
| 8–12 | General support contact only. Privacy contact exists but not prominent. |
| 3–7 | No clear contact for compliance issues. Hard to report concerns. |
| 0–2 | Unreachable. No contact for compliance issues. Anonymised operator. |

---

## Dimension 3 — Data Governance Grade (A–F)

**What it measures:** How the tool handles your data specifically — what it collects, how long it keeps it, and whether it uses it to train its own models.

This is the most developer-relevant score because it directly impacts internal data policies and client data handling.

### Grading Criteria

| Grade | Criteria |
|---|---|
| **A** | Does NOT train on user data by default. Clear opt-out exists even if training is offered. Data retention is limited and stated explicitly. Offers data deletion on request. Enterprise tier with data isolation available. |
| **B** | Does not train on user data by default, OR has a clear opt-out. Data retention policy stated. Some limitations on what data is processed. |
| **C** | May train on user data. Opt-out exists but is not default or is hard to find. Retention policy is vague. |
| **D** | Trains on user data with no easy opt-out. Retention policy unclear or very long. Data shared with third parties for unclear purposes. |
| **F** | Trains on user data with no opt-out. No data deletion mechanism. Inaccessible privacy policy. Active enforcement actions or data breaches with poor response. |
| **N/A** | Open-source or self-hosted tool where the user controls all data. No centralised data collection applicable. |

**Important:** Open-source tools like Ollama or Stable Diffusion (self-hosted) automatically qualify for N/A, which reflects the highest possible data governance — because you control everything.

---

## Dimension 4 — Transparency Index (0–100)

**What it measures:** How much the tool maker reveals about how the AI actually works — the model, its training, its limitations, and its evaluations.

This is the "show your work" score.

### Scoring Criteria

| Criterion | Max Points | Description |
|---|---|---|
| Model card or equivalent published | 25 | Formal documentation of model architecture, training data, known limitations, intended use. |
| Open weights / open source | 20 | Model weights available for inspection. Highest possible transparency. |
| Training data disclosed | 15 | What datasets were used, from where, under what license. |
| Third-party evaluations | 15 | External red-teaming, safety evaluations, or benchmark results published by parties other than the developer. |
| Benchmark performance published | 10 | Standard benchmark results (MMLU, HumanEval, etc.) reported honestly including failure modes. |
| Audit history | 10 | Past audits, incident reports, or post-mortems made public. |
| Known limitations documented | 5 | Explicit documentation of what the model cannot do or does poorly. |

**Total: 100 points**

**Rating labels:**
- 80–100: Excellent
- 60–79: Good
- 40–59: Fair
- 20–39: Poor
- 0–19: Opaque

---

## Source Priority Hierarchy

When gathering data to score a tool, use sources in this order:

1. **Tool's own official documentation** — Privacy policy, ToS, model card, trust portal, compliance page
2. **EU/government official sources** — artificialintelligenceact.eu, national DPA decisions, EU AI Office register
3. **Independent verification bodies** — ToS;DR, Common Sense Privacy, IAPP enforcement tracker
4. **Credible investigative journalism** — Documented data practices covered by reputable outlets
5. **Academic / security research** — Peer-reviewed papers or credible researcher findings
6. **Community reports** — Only when corroborated by multiple sources

**Never use:**
- Marketing copy or press releases as evidence for a high score
- Unverified forum posts or social media
- The company's own claims about EU AI Act compliance without corroborating evidence

---

## Scoring Worked Examples

### Example 1: Ollama

| Dimension | Score | Rationale |
|---|---|---|
| EU AI Act Tier | Minimal Risk | General-purpose local LLM runner. No Annex III use case. User controls all execution. |
| Compliance Score | 94/100 | A: 18 (full GitHub docs), B: 20 (no data collection possible — local), C: 18 (N/A for GDPR as self-hosted, but open-source governance is excellent), D: 20 (no misuse vector at platform level), E: 18 (active GitHub community, responsive maintainers) |
| Data Governance Grade | N/A | Fully self-hosted. Zero centralised data collection. User owns all data. |
| Transparency Index | 98/100 | Open weights (20), open source (20), active model card ecosystem, third-party evaluations available through Hugging Face, known limitations documented in GitHub issues |

### Example 2: A Hiring AI Tool (Hypothetical)

| Dimension | Score | Rationale |
|---|---|---|
| EU AI Act Tier | High Risk | Annex III Category 4: Employment and worker management. Specifically designed to screen CVs and rank candidates. |
| Compliance Score | 35/100 | A: 5 (no model documentation), B: 8 (basic privacy policy), C: 6 (GDPR compliance claimed, no DPA available), D: 10 (usage policy exists), E: 6 (support email only) |
| Data Governance Grade | D | Trains on aggregated hiring data. Opt-out not clearly available. Candidate data retained for 3 years (vague policy). |
| Transparency Index | 28/100 | No model card, no open weights, no published evaluations, basic benchmark claims only |

---

## Review & Update Policy

- **Standard review cycle:** Every 90 days per tool
- **Triggered review:** Immediately upon a material privacy policy change, DPA enforcement action, data breach, or significant product change
- **Tool maker appeals:** Tool makers can request a review by emailing [compliance@yourdomain.com] with supporting documentation. All appeals are reviewed within 14 business days.
- **Score versioning:** All score changes are logged with a date and rationale. Historical scores are preserved.

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | Feb 2026 | Initial rubric published |
