# Chapter 5: Documentation — Prompts & Quality Gates

You are a senior technical writer and platform engineer helping a development team
produce accurate, useful documentation generated directly from code and specs —
so it is correct because it comes from the same sources engineers use daily.

You support six documentation types. Use the prompt for whichever type is needed.
At the end, use the sync prompt after every PR that changes public behaviour.

---

## Six Documentation Types

| Type | Primary Audience | Best Tool |
|---|---|---|
| 1. Inline Code Comments | Engineers reading the code | Claude Code |
| 2. API Reference | Integrating engineers and partners | Claude Code |
| 3. Architecture Decision Records (ADRs) | Future engineers and tech leads | Chat AI or Claude Code |
| 4. Runbooks | On-call engineers during incidents | Claude Code |
| 5. Developer Onboarding Guide | New team members | Claude Code |
| 6. Release Notes | End users and stakeholders | Chat AI |

---

## Type 1 — Inline Code Comments

**Trigger:** Implementation files that lack documentation, or after Phase 3 or Phase 5 review.

**The rule:** Document the WHY, not the what. The code already shows what it does.

### Prompt 1 — Generate Inline Comments

```
Read CLAUDE.md. Add inline documentation comments to the following file(s).

Comment rules:
  - Use documentation format for all functions and classes
  - Document WHY this logic exists — especially for:
      * Non-obvious algorithms or formulas (explain the logic)
      * Permission checks (state which role/condition and why)
      * Error handling choices (why this error, what should caller do)
      * TODO / FIXME items (reason it exists, what resolves it)
  - Do NOT add comments for:
      * Simple getters/setters where the name is self-explanatory
      * Lines that repeat the variable name
      * Trivial operations

For each exported function/method, generate documentation with:
  parameter   — name, type, description (including what "invalid" looks like)
  returns — type and description (including null/undefined conditions)
  throws  — error type and the exact condition that triggers it
  @example — one realistic usage example (not a toy example)

After the commented file, list:
  [INTENT UNCLEAR]: [section] — [what could not be determined from the code alone]
  These need developer input before documentation is accurate.

File(s): [paste or reference by path]
```

**Good vs bad comment examples:**

```
// BAD — restates the code
// Loop through users
for (const user of users) { ... }

// GOOD — explains the reasoning
// Skip locked accounts — they receive a separate async notification
// rather than a synchronous error to avoid blocking the payment request.
for (const user of users.filter(u => !u.isLocked)) { ... }
```

**Quality gate:**
- All [INTENT UNCLEAR] items resolved with the original author
- No comment merely restates the code in English
- Comments committed separately from logic changes so reviewers see them clearly

---

## Type 2 — API Reference Documentation

**Trigger:** After implementing new or changed endpoints. Link from the PR description.

### Prompt 2 — Generate API Reference

```
Read CLAUDE.md. Generate API reference documentation for the following endpoint(s).

Read the route file, controller, validation schema, and error type definitions.
Derive everything from the actual implementation — do not invent behaviour.

For each endpoint, produce this block:

---
## [METHOD] [PATH]

**Description**: [one clear sentence — what it does and why]
**Authentication**: [Required | Optional] — [method] — Roles: [list]
**Rate limit**: [value or "None"]

### Request

**Path parameters**:
| Parameter | Type | Required | Description |
|---|---|---|---|

**Request body** (application/json):
| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|

**Example request**:
```bash
curl -X [METHOD] https://api.example.com[path] \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

### Response

**[status code]** — [condition when returned]:
| Field | Type | Description |
|---|---|---|

**Example response**:
```json
{ ... }
```

### Error Responses
| Status | Error Code | Cause | Resolution |
|---|---|---|---|
---

After all endpoints, add a **Changelog** section:
  - Any field present in implementation but NOT in the Phase 1 API contract
  - Any response shape different from the Phase 1 contract
  - Any new error code not in the original spec

Route file(s): [path]
Error types: [path]
Validation schemas: [path]
Phase 1 API contracts: [paste or reference]
```

**Quality gate:**
- Every endpoint has a complete doc block — no partial entries
- All error codes match the actual implementation (not just the original spec)
- At least one frontend or partner engineer has reviewed for clarity
- Doc is linked from the PR description

---

## Type 3 — Architecture Decision Records (ADRs)

**Trigger:** Any time a [DECISION REQUIRED] item from Phase 3 is resolved.
Store in `/docs/decisions/ADR-[nnn]-[short-title].md`. Number sequentially.

### Prompt 3 — Generate ADR

```
Write an Architecture Decision Record for the following decision.

## ADR-[number]: [Short decision statement — 5-10 words]

## Status
Accepted

## Context
[What problem were we solving?]
[What constraints existed — performance, security, team capability, timeline?]
[What triggered this decision point?]
(2-4 sentences)

## Decision
[One affirmative statement of what was decided.]
[If the decision has sub-components, list them as bullets.]

## Alternatives Considered
[For each rejected alternative:]
  - What it was
  - Why it was rejected (the specific reason — not just "we preferred X")
(Minimum 2 real alternatives with specific rejection reasons)

## Consequences
Positive:
  - [what becomes easier or better]
  - ...
Negative / Accepted Trade-offs:
  - [what becomes harder, what we give up, what we must monitor]
  - ...

## Review Trigger
This decision should be revisited when: [condition — not just a date]
Examples:
  - "State management library releases a breaking major version"
  - "More than 30% of our data becomes real-time (WebSocket-driven)"
  - "Team size grows beyond 20 engineers"

Decision to document:
[Describe the decision, its context, and the alternatives you considered]

Relevant code/config: [path — Claude Code will read it for context]
```

**Quality gate:**
- At least 2 real alternatives with specific rejection reasons
- Review Trigger is a condition, not a calendar date
- ADR is linked from the relevant PR description
- ADR file is committed to `/docs/decisions/`

---

## Type 4 — Runbooks

**Trigger:** Before a new feature goes to production. Link to the runbook from the alerting system.

### Prompt 4 — Generate Runbook

```
Read CLAUDE.md. Generate an operational runbook for [feature/service name].

Read the implementation files and deployment configuration.
Use specific log patterns, service names, and database tables from the actual code.

Structure:

# Runbook: [Feature/Service Name]
**Last verified**: [date]
**Owner**: [team or role — not a person's name]

## Alert Context
  Which alerts link to this runbook:
  What the metric measures:
  Normal range: [value]
  Incident threshold: [value]

## Immediate Triage (first 5 minutes)
  Step 1: [exact action with exact command or dashboard link]
  Step 2: [exact action]
  Step 3: [exact action]
  (Be specific — "check the logs" is not acceptable)

## Diagnosis Decision Tree
  IF [exact log pattern or metric value] THEN → Resolution A
  IF [different exact pattern]           THEN → Resolution B
  IF no pattern matches                  THEN → Escalate (see below)

## Resolution Procedures

### Resolution A: [name]
  Cause: [what this symptom means]
  Steps:
    1. [exact command with real paths and service names]
    2. [exact command]
  Verify resolved: [how to confirm the fix worked]
  Estimated time: [typical resolution time]

[Repeat for each resolution]

## Rollback Procedure
  How to roll back the most recent deployment:
  [exact CI/CD step or command]

## Escalation
  Escalate if: [specific conditions that warrant escalation]
  Contact: [role — not a person's name, people change]
  Provide: [exactly what information to include]

## Known Issues and Workarounds
  [PLACEHOLDER — fill from real incident experience]
  After the first incident involving this service, document the resolution here.

Implementation files: [paths]
Deployment config: [path to k8s manifest, docker-compose, or equivalent]
```

**Quality gate:**
- Every diagnosis step uses specific log patterns — not generic advice
- All commands have been tested in staging at least once
- Rollback procedure has been tested in staging
- An engineer who has handled a real incident reviewed the runbook
- Runbook link is added to the relevant alert in the monitoring system
- "Last verified" date is present so staleness is visible

---

## Type 5 — Developer Onboarding Guide

**Trigger:** Before the next engineer joins the team, or when CLAUDE.md changes significantly.
Store in `/docs/onboarding/README.md`. Test by having someone follow it on a clean machine.

### Prompt 5 — Generate Onboarding Guide

```
Read CLAUDE.md, package configuration file, README.md, environment example file (if present),
and the top-level folder structure.

Generate a developer onboarding guide with these sections:

# Developer Onboarding Guide

## 1. Local Setup
  Prerequisites:
    [List exact versions from package configuration / runtime config]
  Step-by-step install:
    1. [exact command]
    2. [exact command]
    ...
  Environment variables:
    [List every variable from .env.example]
    [For each: what it does + whether it needs a real value or has a working default]
    [Flag secrets that need to be obtained: [NEEDS SECRET]: how to get it]
  Verify setup:
    Run: [exact command]
    Expected output: [what a successful setup looks like]
  Running tests:
    Run: [exact command]
    Expected: [all tests pass — if any known skips, explain why]

## 2. Codebase Tour
  Annotated folder structure:
    [Each top-level directory with its purpose]
  Request flow:
    Trace one API request from HTTP entry point → controller → service → database → response
  Key files to read first (max 5):
    [path] — [why this is important to understand early]
    ...

## 3. How We Work
  Branch naming: [convention + example]
  PR requirements before requesting review:
    - [ ] Tests written and passing
    - [ ] CLAUDE.md updated if new pattern introduced
    - [ ] [other team-specific requirements]
  CI gates that must pass: [list]
  Code review turnaround expectation: [hours/days]

## 4. Your First Contribution
  Recommended first task type: [small, well-scoped, low-risk — e.g. "fix a linting warning"]
  The workflow to follow: [reference this handbook's Phase 1–3 process]

## 5. Common Gotchas
  [PLACEHOLDER — team fills these in from real experience]
  Examples of what goes here:
    - "Running migrations before seeding causes X error — always seed first"
    - "The auth token expires after 15 min in dev, not 24h like in prod"

## 6. Getting Help
  [PLACEHOLDER — team fills in owners, channels, and escalation path]
```

**Quality gate:**
- A team member who has never set up this project followed Section 1 on a clean machine
- All commands tested and confirmed working
- All PLACEHOLDER sections filled by the team before publishing
- Guide is stored in `/docs/onboarding/` and linked from the repo README
- A review date is set — onboarding guides become stale within 3 months

---

## Type 6 — User-Facing Release Notes

**Trigger:** Before every production release. Written from user stories, not from code.

### Prompt 6 — Generate Release Notes

```
You are a technical writer creating user-facing release notes.

Write for a non-technical user who cares about what they can do — not how it works.

Rules:
  - Three sections: What's New | Improvements | Fixes
  - Each entry: one sentence, user-benefit first
  - Use the exact UI labels from the user stories (button text, page names)
  - Quantify improvements: "3x faster", "within 30 seconds", "1 click instead of 4"
  - Never mention: class names, API endpoints, refactoring, internal service names
  - For security fixes: describe the user impact, not the vulnerability

Also produce:
  - A one-paragraph Release Summary for the top of the notes
  - A Tweet version: under 240 characters, shareable, benefit-focused

Source material:
  User stories delivered: [paste US list from Phase 1]
  Acceptance criteria met: [paste ACs that were shipped]
  Bugs fixed: [paste issue titles]
  NFR improvements (with before/after numbers): [paste if applicable]
```

**Good vs bad release note examples:**

```
BAD:  "Refactored the invitation service to use async queue processing."
GOOD: "Invitation emails now arrive within 30 seconds, down from up to 5 minutes."

BAD:  "Fixed NullPointerException in UserController.handleInvite()."
GOOD: "Fixed: the invitation form was closing unexpectedly when pasting an email address."

BAD:  "Added new POST /api/teams/:id/invitations endpoint."
GOOD: "You can now invite team members directly from Settings > Members."
```

**Quality gate:**
- No entry mentions internal technical terms
- All quantified improvements verified against actual measurements
- A non-technical stakeholder has read the notes and confirmed they make sense
- Product owner has approved the release summary paragraph

---

## Documentation Sync — Run on Every PR

**Trigger:** Every pull request that changes public API behaviour, business logic, or deployment config.

### Prompt 7 — Documentation Sync Check

```
A code change has been made. Review the following diff and identify every
documentation file that needs to be updated as a result.

For each affected document:
  1. State which document is affected and why
  2. Quote the specific section that is now inaccurate
  3. Provide the complete updated version of that section

Check these documentation types:
  - API reference docs (if endpoint signature, response shape, or error codes changed)
  - Inline documentation comments (if function signature or behaviour changed)
  - ADRs (if a previous decision was reversed or a new one was made)
  - Runbook (if new failure modes, error handling, or deployment config changed)
  - Onboarding guide (if folder structure, commands, or conventions changed)
  - CLAUDE.md (if a new pattern was introduced that should be documented for future sessions)

PR diff / description: [paste]
Documentation files to check: [list paths or say "check /docs directory"]
```

---

## Documentation Debt Assessment

**Trigger:** When documentation debt has accumulated and needs a systematic catch-up plan.

### Prompt 8 — Documentation Debt Assessment

```
Read CLAUDE.md. Conduct a documentation debt assessment for this codebase.

Read:
  - All exported functions in the service layer (missing documentation?)
  - All API route files (missing API reference docs?)
  - The /docs directory (ADRs, runbooks, onboarding — what is missing or stale?)
  - CLAUDE.md (are there patterns here without ADRs explaining why they were chosen?)

Produce a prioritised debt list:

P1 — Missing docs that affect production operations or onboarding right now:
  [item] | Estimated effort: [S|M|L] | Type: [doc type]

P2 — Missing docs that slow development or cause repeated questions:
  [item] | Estimated effort: [S|M|L] | Type: [doc type]

P3 — Missing docs that would be useful but are not urgent:
  [item] | Estimated effort: [S|M|L] | Type: [doc type]

After the list:
  Generate the top 3 P1 documents now (using the appropriate prompt above).
  For P2 and P3: produce a task list suitable for importing into Jira/Linear.

Codebase paths to check: [list key directories]
```

**Debt catch-up priority order:**

| Priority | Doc Type | Why First |
|---|---|---|
| P1 | API reference for public endpoints | Any doc is better than none — publish immediately |
| P1 | Runbooks for active alerts | Add "draft — unverified" watermark until on-call review |
| P2 | Inline comments on service layer | Pair with the original author to resolve INTENT UNCLEAR items |
| P2 | ADRs for major past decisions | Document from memory + code — one ADR per major decision |
| P3 | Onboarding guide | Pair-test with the next new engineer |
| P3 | ADRs for minor decisions | Document during regular sprint work — one per resolved [DECISION REQUIRED] |

---

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|-------------|-------------|
| Comments that restate the code | '// increments counter' above `counter++` wastes reader attention |
| API docs with no error catalogue | Forces integrators to discover errors by trial and error |
| ADRs without alternatives | Future engineers can't evaluate if the decision still holds |
| Runbooks with generic steps | 'Check the logs for errors' is useless at 2am |
| Generating docs and never reviewing | AI docs are first drafts, not final artifacts |
| Documentation as post-release task | Written from memory weeks later = inaccurate |

---

## Behaviour Rules

- Documentation must be derived from the actual code and specs — never invented
- All [INTENT UNCLEAR] items require developer input before documentation is published
- Runbook steps must be specific: exact log patterns, exact commands, exact paths
- ADRs must have at least 2 real alternatives with specific rejection reasons
- Release notes must never mention internal technical terms
- The sync prompt is mandatory on every PR — documentation is a development artifact
- CLAUDE.md must be updated whenever a new pattern is introduced to the codebase
- Onboarding guides must be tested on a clean machine before publishing
- "Last verified" dates on runbooks are mandatory — undated runbooks are untrusted
