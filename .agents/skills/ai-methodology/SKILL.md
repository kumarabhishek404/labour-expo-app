---
name: ai-methodology
description: End-to-end AI-assisted feature development. Takes a raw feature idea through Requirements Analysis, Prototyping, Implementation, Testing, and Documentation — producing stored artifacts at each phase.
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
---

# AI Methodology — Feature Development Pipeline

You are a **senior engineering lead** executing the AI Methodology Handbook — a 5-phase pipeline that transforms a raw feature idea into implementation-ready artifacts. Each phase produces concrete, stored outputs that the next phase consumes.

## Overview

When a user provides a feature description, you orchestrate the complete development lifecycle:

| Phase | What Happens | Key Output |
|-------|-------------|------------|
| **1 — Requirements** | Structure, gap-analyse, convert to stories & tests | Requirement doc, user stories, test scenarios, architecture seed |
| **2 — Prototyping** | Build interaction blueprint with all 8 states | Screen inventory, 8-state spec, dev handoff package |
| **3 — Implementation** | Plan, scaffold, implement, review | CLAUDE.md, impl plan, feature code, review report |
| **4 — Testing** | Generate test suite from spec, analyse coverage | Test plan, test code, coverage analysis |
| **5 — Documentation** | Inline comments, API docs, ADRs, release notes | Complete documentation package |

## Prerequisites

- A feature description (raw notes, meeting transcript, product brief, or even a single sentence)
- Access to the project codebase (for Phases 3-5)
- CLAUDE.md in project root (generated in Phase 3 if missing)

## Artifact Storage

All artifacts are stored under `docs/features/{feature-slug}/`:

```
docs/features/{feature-slug}/
├── FEATURE.md                    # Master tracker — status of each phase
├── 1-requirements.md            # Complete requirements analysis document
├── 2-prototype.md                # Complete prototype specification document  
├── 3-implementation.md           # Complete implementation document
├── 4-testing.md                  # Complete testing document
└── 5-documentation.md            # Complete documentation package
```

## Traceability ID Chain

Every artifact must link back to its source. Use these ID prefixes consistently across all phases:

| Phase | ID Prefix | Example | Links To |
|-------|-----------|---------|----------|
| 1 — Requirements | FR-n, NFR-n | FR-1, NFR-3 | — (root) |
| 1 — User Stories | US-n, AC-n | US-2, AC-3 | Parent FR |
| 1 — Test Scenarios | TS-n | TS-7 | Source AC |
| 2 — Prototyping | S-n (screen) | S-4 | Implements FR |
| 3 — Implementation | DB-n, BE-n, API-n, FE-n | BE-2, API-1 | Implements US |
| 4 — Testing | TC-n | TC-12 | Covers AC |
| 5 — Documentation | ADR-nnn | ADR-001 | Resolves [DECISION REQUIRED] |

**Rules:**
- Every implementation task (Phase 3) must reference the user story it implements: `BE-1 → US-2`
- Every test case (Phase 4) must reference the AC it covers: `TC-5 → AC-3 (US-1)`
- Every ADR (Phase 5) must reference the `[DECISION REQUIRED]` item it resolves
- If Phase 3 adds an API endpoint not in the Phase 1 contract, flag it as `[API ADDED]` with justification
- The coverage matrix in Phase 4 must map every AC to at least one TC

---

## Execution Protocol

### ⚠️ MANDATORY: FEATURE.md Update Rule

**You MUST update `FEATURE.md` at every phase transition AND whenever a decision is made. This is non-negotiable.**

At the **start** of each phase:
1. Set that phase's status to `In Progress`
2. Set the `Started` date to today's date
3. Write the file immediately (do not batch with other work)

At the **end** of each phase (after quality gate passes):
1. Set that phase's status to `Complete`
2. Set the `Completed` date to today's date
3. Write the file immediately before presenting the checkpoint summary

**When a decision is made** (user answers a question, resolves a `[DECISION REQUIRED]` item, or chooses between options):
1. Add a row to the **Key Decisions Log** table in FEATURE.md with: decision number, phase, question, options considered, chosen option, rationale, date
2. Write the file immediately — do not wait until the end of the phase

**Failure to update FEATURE.md is a pipeline violation.** If you realise you skipped an update, fix it immediately before continuing.

---

### Step 0: Initialise Feature

1. Derive a `{feature-slug}` from the feature name (lowercase, kebab-case)
2. Create the `docs/features/{feature-slug}/` directory
3. Create `FEATURE.md` from the template (see `templates/feature-tracker.md`)
4. Create empty phase documents: `1-requirements.md`, `2-prototype.md`, `3-implementation.md`, `4-testing.md`, `5-documentation.md`
5. Ask user to confirm the feature scope before proceeding

### Step 1: Requirements Analysis (5 stages)

**>>> UPDATE FEATURE.md NOW:** Set Phase 1 status to `In Progress`, set `Started` date. Write the file before continuing.

**Read CLAUDE.md now** (if it exists in the project root). Use it to inform Stage 5 (Architecture Inputs) — specifically the stack, existing API conventions, error handling patterns, naming conventions, and any constraints that affect architecture choices. If CLAUDE.md does not exist yet, it will be generated in Phase 3.

Read `references/ch1-requirements.md` for the full prompts and quality gates.

Execute these 5 stages **in order**:

**Stage 1 — Structure Raw Requirements**
- Input: User's raw feature description
- Run the structuring prompt to produce: Feature Summary, FRs, NFRs, User Stories, Acceptance Criteria, Edge Cases
- Flag inferred items with `[ASSUMED]`
- Add to `1-requirements.md` under "## Requirements Document" section

**Stage 2 — Gap Analysis**
- Input: Stage 1 output
- Find ALL missing scenarios across 6 dimensions: Edge Cases, Validation, Error Handling, Permissions, Scalability, Integration
- Produce categorised findings with Risk ratings and suggested additions
- Add to `1-requirements.md` under "## Gap Analysis" section
- **PRESENT gaps to user** — ask which to accept, defer, or reject
- Update "## Requirements Document" section with accepted additions

**Stage 3 — User Stories**
- Input: Updated requirement document
- Convert each FR to stories with: Story ID, Parent FR, As a/I want/So that, ACs (Given/When/Then), Edge Cases, Definition of Done
- Flag stories needing split with `[SPLIT RECOMMENDED]`
- Add to `1-requirements.md` under "## User Stories" section

**Stage 4 — Test Scenarios**
- Input: User stories from Stage 3
- Generate comprehensive test matrix: 5+ Positive, 5+ Negative, 4+ Edge Cases, 3+ Security, 2+ Performance
- Each scenario: ID, Category, Title, Preconditions, Steps, Expected Result, Priority
- Add to `1-requirements.md` under "## Test Scenarios" section

**Stage 5 — Architecture Inputs**
- Input: Complete requirements package
- Produce: System Components, Data Model (text ERD), API Contracts, Workflow/States, Integration Points, Open Design Questions
- Mark items needing team input with `[DECISION REQUIRED]`
- Add to `1-requirements.md` under "## Architecture Inputs" section

**Quality Gate — Phase 1:**
- [ ] Every `[ASSUMED]` flag reviewed with user
- [ ] All High-risk gaps resolved or deferred
- [ ] Every FR maps to at least one user story
- [ ] At least one Critical test scenario per AC
- [ ] Every API endpoint maps to a user story
- [ ] All sections in `1-requirements.md` are complete and coherent

**>>> UPDATE FEATURE.md NOW:** Set Phase 1 status to `Complete`, set `Completed` date. Write the file before continuing.

**CHECKPOINT:** Present Phase 1 summary using this format:

```
## Phase 1 Complete — Summary

**Feature:** {feature name}
**Artifacts:** 1-requirements.md updated

### What Was Produced
- {n} Functional Requirements, {n} Non-Functional Requirements
- {n} User Stories with {n} Acceptance Criteria
- {n} Test Scenarios (Critical: {n}, High: {n}, Medium: {n})
- Architecture seed: {n} API endpoints, {n} data entities

### Items Requiring Attention
- [ASSUMED] items: {count} — {list or "all reviewed"}
- [DECISION REQUIRED] items: {count} — {list}
- Deferred gaps: {count} — {list with ticket numbers}

### Ready for Phase 2?
Phase 2 will convert these requirements into an interaction blueprint
with screens, 8-state specs, and a developer handoff package.
```

---

### Step 2: Prototyping

Read `references/ch2-prototyping.md` for the full prompts and quality gates.

**>>> UPDATE FEATURE.md NOW:** Set Phase 2 status to `In Progress`, set `Started` date. Write the file before continuing.

**Read CLAUDE.md now.** Use it to identify existing UI components, styling conventions, routing structure, and role/permission model. This ensures prototype screens align with how the product actually looks and behaves — not a generic spec.

**Choose the right approach:**
- **Approach 1 (Flow from Requirements)** — No UX work exists yet (most common)
- **Approach 2 (Extend Existing Product)** — Feature must fit existing product
- **Approach 3 (Expand Wireframes)** — Designer provided wireframes
- **Approach 4 (Generate Variants)** — Team needs to choose direction

**For each screen, define ALL 8 Interaction States:**

| State | What to Define |
|-------|---------------|
| **Default** | Initial state, pre-filled values, placeholder text |
| **Loading** | Skeleton/spinner, which elements appear first |
| **Empty** | Before any data exists, onboarding prompt |
| **Success** | Confirmation method (toast, redirect, inline) |
| **Error** | Error types, display method (inline, banner, modal) |
| **Validation** | Per-field rules, blur vs submit, exact error messages |
| **Permission** | Insufficient-permission view (hidden, disabled, message) |
| **Offline** | Graceful degradation, offline banner |

#### Step 2a — Text Specification

1. Generate the full prototype specification using the chosen approach
2. Add to `2-prototype.md` under "## Prototype Specification" section
3. Produce the developer handoff package with spec cards per screen
4. Add to `2-prototype.md` under "## Developer Handoff Package" section

#### Step 2b — Visual Design via Stitch

**This step is MANDATORY unless the user explicitly opts out.** After completing Step 2a, ask the user: _"Ready to generate visual prototypes via Stitch? (yes / skip)"_. If the user says skip, record it in FEATURE.md decisions log and move on.

Use the **Stitch MCP tools** (`mcp__stitch__*`) to generate high-fidelity screen mockups from the text specification.

**Sub-step 1 — Prepare Stitch Project & Design System:**
- Call `mcp__stitch__list_projects` to check for an existing project for this feature
- If no matching project exists: call `mcp__stitch__create_project` with the feature name as title
- Read the CSS config if available or analyse the codebase to extract: primary color hex, font family, border radius, color mode 
- Call `mcp__stitch__create_design_system` with extracted tokens (map to closest Stitch font enum, set `customColor`, `colorMode`, `roundness`, and write a `designMd` summarizing the app's visual style — card borders, button styles, toast patterns, etc.)
- Call `mcp__stitch__apply_design_system` to apply it to the project

**Sub-step 2 — Build Prompts from Spec:**
- For each screen in the prototype spec, compose a detailed Stitch prompt that includes:
  - The layout structure (ASCII art from Step 2a converted to natural language)
  - Key UI elements: buttons, inputs, cards, grids, modals, toolbars
  - The **Default** interaction state details (pre-filled values, visible elements, responsive columns)
  - Design system references (primary color, card style, font, spacing)
- Save prompts to `2-prototype.md` under "## Stitch Prompts" section

**Sub-step 3 — Generate Screens:**
- Call `mcp__stitch__generate_screen_from_text` for each prompt (this can take a few minutes — do NOT retry on timeout)
- If the tool fails due to connection error, call `mcp__stitch__get_screen` later to check if generation succeeded
- For critical screens, also generate **Error**, **Empty**, and **Loading** state variants

**Sub-step 4 — Download Screenshots & HTML Source Code:**
- Call `mcp__stitch__get_screen` for each generated screen to retrieve both `screenshot.downloadUrl` and `htmlCode.downloadUrl`
- Download each screenshot using `curl` and save to `docs/features/{feature-slug}/screenshots/`
- Screenshot naming convention: `S{n}-{ScreenName}-{State}.png` (e.g., `S1-MediaPage-Admin-Default.png`)
- Download each HTML source file using `curl` and save to `docs/features/{feature-slug}/stitch-html/`
- HTML naming convention: `S{n}-{ScreenName}-{State}.html` (e.g., `S1-MediaPage-Admin-Default.html`)
- Verify downloads are valid PNG and HTML files
- **The HTML files are critical** — they contain the exact markup, CSS classes, layout structure, and styling that Stitch generated. These will be used as the foundation for component implementation in Phase 3.

**Sub-step 5 — Update Prototype Doc:**
- Add a "## Visual Designs" section to `2-prototype.md` with:
  - A table linking each screen to its screenshot (using relative markdown image syntax `![label](screenshots/filename.png)`)
  - The Stitch project ID and screen IDs for future reference
  - Design notes: how each generated screen maps to the text spec
- Update FEATURE.md changelog with the visual design generation

**Sub-step 6 — Iterate & Refine:**
- Present generated screenshots to the user for review (read the PNG files so they display inline)
- If changes are needed: use `mcp__stitch__edit_screens` for targeted adjustments, then re-download updated screenshots
- Repeat until the user approves the visual direction

**Quality Gate — Phase 2:**
- [ ] Every FR maps to at least one screen
- [ ] All 8 states defined for every screen
- [ ] Engineering handoff references API contracts from Phase 1
- [ ] At least 3 edge case flows documented
- [ ] Exact validation messages written (not described)
- [ ] Accessibility section defined for every screen (focus order, keyboard, screen reader)
- [ ] Visual designs generated via Stitch for key screens (or user explicitly opted out — recorded in FEATURE.md decisions log)
- [ ] Screenshots downloaded to `docs/features/{feature-slug}/screenshots/` and referenced in "## Visual Designs" section
- [ ] All sections in `2-prototype.md` are complete and coherent

**>>> UPDATE FEATURE.md NOW:** Set Phase 2 status to `Complete`, set `Completed` date. Write the file before continuing.

**CHECKPOINT:** Present Phase 2 summary using this format:

```
## Phase 2 Complete — Summary

**Feature:** {feature name}
**Approach used:** {1-4}
**Artifacts:** 2-prototype.md updated

### What Was Produced
- {n} screens with all 8 states defined
- Developer handoff package with navigation flow
- {n} exact validation messages specified
- Accessibility sections for all screens

### Items Requiring Attention
- Screens with complex state logic: {list}
- [OPEN QUESTION] items: {count}
- Visual designs: {generated via Stitch — {n} screenshots saved to screenshots/ / user opted out (D-{n})}

### Ready for Phase 3?
Phase 3 will create CLAUDE.md, plan implementation tasks,
scaffold files, implement business logic, and run code review.
```

---

### Step 3: Implementation

Read `references/ch3-implementation.md` for the full prompts and quality gates.

**Phase 3.1 — Codebase Orientation**
- Check if `CLAUDE.md` exists in project root
- If missing: explore the codebase and generate it (folder structure, naming conventions, state management, API client, component patterns, auth, testing)
- If exists: read it for context

**Phase 3.2 — Implementation Planning**
- Input: Prototype spec + Architecture inputs + CLAUDE.md
- Produce ordered task list: Database Changes → Backend Tasks (BE-n) → API Tasks (API-n) → Frontend Tasks (FE-n) → Test Tasks
- Each task: ID, file to create/modify, what it implements, dependencies
- Add to `3-implementation.md` under "## Implementation Plan" section

**>>> UPDATE FEATURE.md NOW:** Set Phase 3 status to `In Progress`, set `Started` date. Write the file before continuing.

**Phase 3.3 — Scaffold Generation**
- For each task, create compilable stubs with correct imports, types, function signatures
- No business logic — only TODOs marking where logic goes
- Verify: correct directories, naming matches conventions, code compiles

**Phase 3.4 — Feature Implementation**

**⚠️ MANDATORY: Use Stitch HTML as the design foundation.**
If visual designs were generated via Stitch in Phase 2 (i.e., HTML source files exist in `docs/features/{feature-slug}/stitch-html/`), you **MUST** use them as the primary reference for building frontend components:

1. **Read the Stitch HTML files first** — before writing any component, read the corresponding Stitch HTML file to extract:
   - The exact HTML structure and element hierarchy
   - CSS classes, styling, and inline styles used
   - Layout patterns (grid columns, flexbox, spacing, padding)
   - Color values, font sizes, border radii, shadows
   - Component composition (how cards, toolbars, modals are structured)

2. **Convert Stitch HTML → UI components** — translate the static HTML into UI components by:
   - Preserving the exact class names and styling from the Stitch output
   - Replacing static content with dynamic props and state
   - Adding event handlers, hooks, and business logic
   - Splitting large HTML sections into the component boundaries defined in the implementation plan
   - Adapting any Stitch-specific CSS (e.g., `<style>` blocks) into the project's styling approach

3. **Do NOT invent your own styles** — the Stitch HTML is the source of truth for visual design. Do not write CSS classes, colors, spacing, or layout from scratch when the Stitch HTML already defines them. Only deviate from Stitch styles when:
   - The project's existing conventions require it (e.g., theme-specific classes not in Stitch output)
   - The Stitch HTML uses patterns incompatible with the framework (e.g., vanilla JS that needs framework state)
   - Responsive breakpoints need adjustment for the project's breakpoint system

4. **Reference in code** — add a comment at the top of each component noting its Stitch source:
   `// Design source: docs/features/{feature-slug}/stitch-html/S{n}-{ScreenName}.html`

If Stitch HTML files do NOT exist (user opted out of visual designs in Phase 2), fall back to implementing from the text-based prototype spec in `2-prototype.md`.

- Fill scaffolds with real business logic, layer by layer
- Follow the 3-step session pattern: Context → Spec Slice → Review
- Implement all 8 interaction states from prototype spec
- Match exact validation messages from spec

**Phase 3.5 — Code Review & Hardening**
- Run AI code review: categorise issues as Critical / High / Medium / Low
- Run security review on auth and data-handling code
- Add findings to `3-implementation.md` under "## Code Review Findings" and "## Security Review Findings" sections
- Fix all Critical and High issues

**Quality Gate — Phase 3:**
- [ ] CLAUDE.md exists and is accurate
- [ ] All [DECISION REQUIRED] items resolved
- [ ] Code compiles with no errors
- [ ] All 8 states implemented per screen
- [ ] No sensitive data in API responses or logs
- [ ] All Critical/High review issues fixed
- [ ] All sections in `3-implementation.md` are complete and coherent
- [ ] Frontend components derived from Stitch HTML source code (if visual designs were generated in Phase 2)
- [ ] FEATURE.md `CLAUDE.md Status` checkbox filled
- [ ] FEATURE.md `Task Summary` table filled with real counts
- [ ] FEATURE.md `Review Status` checkboxes all checked/unchecked with notes
- [ ] FEATURE.md `Resolved Decisions` table has one row per ADR written

**>>> UPDATE FEATURE.md NOW — FILL ALL PHASE 3 FIELDS:**
1. Set Phase 3 status to `Complete`, set `Completed` date
2. Check the `CLAUDE.md Status` checkbox (generated or already existed)
3. Fill the `Task Summary` table with actual counts (Tasks, Completed, Blocked per layer)
4. Check or uncheck every `Review Status` checkbox with a brief note if unchecked
5. Fill the `Resolved Decisions` table — one row per ADR written, linking decision to ADR number and resolution summary
6. Write the file — then verify by reading it back before continuing

**CHECKPOINT:** Present Phase 3 summary using this format — **you must fill every `{placeholder}` with real values, not leave them as templates**:

```
## Phase 3 Complete — Summary

**Feature:** {feature name}
**Artifacts:** 3-implementation.md updated, feature code on branch

### FEATURE.md Updated ✓
- CLAUDE.md Status: {generated / already existed — checkbox checked}
- Task Summary: DB: {n}, BE: {n}, API: {n}, FE: {n tasks / n completed / n blocked}
- Review Status: AI review {done/pending}, Security review {done/pending}, Human review {assigned to / pending}
- Resolved Decisions: {n rows added — list ADR numbers}

### What Was Produced
- Implementation tasks: DB: {n}, BE: {n}, API: {n}, FE: {n}
- Code review: Critical: {n}, High: {n}, Medium: {n} — all Critical/High fixed
- Security review: {n} findings — all resolved

### Items Requiring Attention
- [DECISION REQUIRED] resolved: {list with ADR numbers}
- [API ADDED] endpoints: {list or "none"}
- Medium review issues deferred: {count}

### Ready for Phase 4?
Phase 4 will derive test scenarios from acceptance criteria,
generate test code, and analyse coverage gaps.
```

---

### Step 4: Testing

Read `references/ch4-testing.md` for the full prompts and quality gates.

**Read CLAUDE.md now.** Use it to determine the correct test framework, mock approach, test file naming conventions, and where test factories should live before generating any test scenarios or code.

**Step 4.1 — Derive Test Plan from Acceptance Criteria**
- For each AC: derive Positive, Negative, Edge Case, Security, Performance scenarios
- Produce coverage matrix: AC → test count → test types
- Flag any AC with fewer than 2 tests as `[UNDER-COVERED]`
- Add to `4-testing.md` under "## Test Plan" section

**>>> UPDATE FEATURE.md NOW:** Set Phase 4 status to `In Progress`, set `Started` date. Write the file before continuing.

**Step 4.2 — Generate Test Scenarios**
- Unit test scenarios: happy path + each error + boundary values
- Component test scenarios: all 8 states + interaction flows  
- API test scenarios: success + auth/permission + validation + business rules
- E2E test scenarios (critical paths only): user journey flows
- **Focus on scenario definitions, not code implementation**

**Step 4.3 — Test Coverage Gap Analysis**
- Analyse scenario coverage vs acceptance criteria
- Compare ACs against test scenarios — flag `[AC-GAP]` items
- Rank top 10 missing test scenarios by risk
- Produce remediation plan for scenario gaps
- Add to `4-testing.md` under "## Coverage Analysis" section

**Quality Gate — Phase 4:**
- [ ] Every AC has at least one test scenario
- [ ] All 8 states have component test scenarios
- [ ] All API endpoints have test scenarios for 401, 403, 404, 409
- [ ] No test scenario expects behaviour contradicting the ACs
- [ ] Test scenarios use realistic data (no `foo`, `test@test.com`)
- [ ] Every NFR with a performance threshold has a corresponding k6 test scenario
- [ ] All sections in `4-testing.md` are complete and coherent
- [ ] FEATURE.md `Coverage Summary` table filled with real counts (not `—`)
- [ ] FEATURE.md `Coverage Gaps` checkboxes all checked with status notes

**>>> UPDATE FEATURE.md NOW — FILL ALL PHASE 4 FIELDS:**
1. Set Phase 4 status to `Complete`, set `Completed` date
2. Fill the `Coverage Summary` table with actual scenario counts per test type (Unit, Component, API/Integration, E2E)
3. Check each `Coverage Gaps` checkbox — if runner not installed, note "Planned — pending runner setup" rather than leaving blank
4. Write the file — then verify by reading it back before continuing

**CHECKPOINT:** Present Phase 4 summary using this format — **you must fill every `{placeholder}` with real values**:

```
## Phase 4 Complete — Summary

**Feature:** {feature name}
**Artifacts:** 4-testing.md updated

### FEATURE.md Updated ✓
- Coverage Summary: Unit: {n}, Component: {n}, API/Integration: {n}, E2E: {n}
- Coverage Gaps: {all checked / {n} pending — reason}

### What Was Produced
- {n} total test scenarios: Unit: {n}, Component: {n}, API: {n}, E2E: {n}
- Coverage matrix: {n} ACs covered, {n} [UNDER-COVERED]
- All 8 states tested for {n} components

### Items Requiring Attention
- [UNDER-COVERED] ACs: {list or "none"}
- Coverage gaps: top {n} by risk
- Performance tests: {generated for NFR thresholds / not applicable}

### Ready for Phase 5?
Phase 5 will generate API docs, ADRs, inline comments,
and user-facing release notes.
```

---

### Step 5: Documentation

Read `references/ch5-documentation.md` for the full prompts and quality gates.

**Read CLAUDE.md now.** Use it to identify the correct documentation style, API patterns, error classes, and any existing ADR conventions before generating documentation.

**Generate these documentation types:**

1. **Inline Code Comments** — Document all exported functions. Document the WHY, not the what. Include parameter documentation, return types, exceptions, and examples.

2. **API Reference Documentation** — For each endpoint: description, auth, rate limit, request spec, response spec, error catalogue, cURL example.

3. **Architecture Decision Records** — For each `[DECISION REQUIRED]` resolved in Phase 3: Context, Decision, Alternatives Considered, Consequences, Review Trigger.

4. **Release Notes** — User-facing: What's New / Improvements / Fixes. User-benefit-first language. Include Release Summary + Tweet version.

Add all content to `5-documentation.md` under appropriate sections:
- "## API Reference Documentation"
- "## Architecture Decision Records" 
- "## Release Notes"

**>>> UPDATE FEATURE.md NOW:** Set Phase 5 status to `In Progress`, set `Started` date. Write the file before continuing.

**Quality Gate — Phase 5:**
- [ ] All exported functions have documentation
- [ ] Every endpoint has a complete API doc block
- [ ] Every resolved decision has an ADR
- [ ] Release notes reviewed — no internal technical terms
- [ ] A non-technical stakeholder could understand the release notes
- [ ] All sections in `5-documentation.md` are complete and coherent
- [ ] FEATURE.md `Documentation Status` table has `Generated` filled for every row (no `—` blanks)
- [ ] FEATURE.md top-level `**Status:**` updated to `Complete — All 5 phases done`

**>>> UPDATE FEATURE.md NOW — FILL ALL PHASE 5 FIELDS:**
1. Set Phase 5 status to `Complete`, set `Completed` date
2. Fill every row of the `Documentation Status` table — set `Generated` to `Yes` (or `N/A` with reason), leave `Reviewed` and `Published` for human sign-off
3. Update the top-level `**Status:**` field to `Complete — All 5 phases done`
4. Write the file — then verify by reading it back before continuing

**CHECKPOINT:** Present Phase 5 summary using this format — **you must fill every `{placeholder}` with real values**:

```
## Phase 5 Complete — Summary

**Feature:** {feature name}
**Artifacts:** 5-documentation.md updated

### FEATURE.md Updated ✓
- Status field: "Complete — All 5 phases done"
- Documentation Status table:
  - Inline Comments: {Generated: Yes/N/A — reason}
  - API Reference: {Generated: Yes/N/A — reason}
  - ADRs: {Generated: Yes — n ADRs / N/A — reason}
  - Runbook: {Generated: Yes/N/A — reason}
  - Release Notes: {Generated: Yes/N/A — reason}

### What Was Produced
- API reference: {n endpoints / hooks / components documented}
- ADRs: {n records — list titles}
- Release notes: {version, target date}

### Pipeline Complete
All 5 phases done. Remaining human actions:
- [ ] Human code review
- [ ] Documentation reviewed and published
- [ ] Staging test run
```

---

## Phase Selection

Not every feature needs all 5 phases. Ask the user which phases to run:

| Feature Type | Recommended Phases |
|-------------|-------------------|
| **New feature (greenfield)** | All 5 phases |
| **Enhancement to existing feature** | 1, 3, 4, 5 |
| **Bug fix** | 3 (debug), 4, 5 |
| **Requirements only (pre-sprint)** | 1, 2 |
| **Documentation catch-up** | 5 only |

## Handling User Feedback & Revisions

When the user requests changes to any phase output:

1. **Identify the scope** — Which phase and which section needs revision
2. **Re-run only the affected section** — Do not regenerate the entire phase document
3. **Preserve all other content** — Only modify the sections the user flagged
4. **Cascade downstream** — If a Phase 1 change affects later phases, flag which downstream artifacts need updating:
   - Requirements change → check prototype spec, impl plan, test scenarios
   - Prototype change → check impl tasks, component test scenarios
   - Implementation change → check test scenarios, API docs
5. **Update the changelog** in FEATURE.md with: date, phase, what changed

**Revision prompt pattern:**
```
The user has requested changes to Phase [n]: [describe the change].

Re-read the current [n]-[artifact].md.
Apply ONLY the requested change to the affected section(s).
Preserve all other sections unchanged.

After applying the change, list any downstream artifacts that may now be inconsistent:
  [DOWNSTREAM]: [phase] — [section] — [what might need updating]
```

---

## Error Recovery

When a phase produces low-quality output or the pipeline gets stuck:

| Symptom | Recovery Action |
|---------|----------------|
| Phase 1 output too vague to build a prototype | Go back to Stage 2 (Gap Analysis). Ask 3 targeted questions about the vaguest requirements before re-running Stage 1. |
| Phase 2 screens missing states or lacking specificity | Re-run the approach prompt with the specific screen. Paste the weak output and say "this is too vague — add exact messages, conditions, and recovery paths." |
| Phase 3 scaffolds don't compile | Run the ch3 recovery prompt: paste the type errors + CLAUDE.md. Fix all errors before continuing to Phase 3.4. |
| Phase 3 code drifts from conventions | Run the ch3 convention recovery prompt immediately. Do not continue building on drifted code. |
| Phase 4 coverage gap analysis shows >30% of ACs uncovered | Re-examine Phase 1 test scenarios (Stage 4). The ACs may be too broad — split them, then re-derive test cases. |
| Phase 5 produces `[INTENT UNCLEAR]` for >20% of functions | The code lacks context. Go back to Phase 3 and add inline comments to the ambiguous sections before re-running Phase 5. |
| Any phase output contradicts a previous phase | Stop. Identify which phase has the correct information. Update the incorrect artifact. Run the `[DOWNSTREAM]` cascade check. |

**General rule:** Never proceed to the next phase if the current phase's quality gate has unresolved items. Fix or explicitly defer (with a ticket number) before moving on.

---

## Anti-Patterns to Avoid

- **Treating AI output as final** — Every phase output needs user review
- **Skipping phases** — Each phase builds on the previous. Running Phase 3 on raw notes produces poor code
- **One giant session** — Work through one phase at a time with checkpoints
- **Generating tests from code** — Always derive from acceptance criteria (spec), not implementation
- **No second pass** — After gap analysis, always re-run on the updated document
- **Accepting scaffolds without compiling** — Verify code compiles after each scaffold

## The 5 Core Principles

1. **Force Clarity Early** — AI forces specificity. "Manage account" becomes 8 distinct stories.
2. **Fill the States Gap** — The 8-state checklist makes completeness non-negotiable.
3. **Context Is Everything** — CLAUDE.md + reference files + spec slices = quality output.
4. **Test the Spec, Not the Code** — Tests from ACs catch bugs. Tests from code hide them.
5. **Documentation Is a Development Artifact** — Generate alongside code, not after.
