# Feature: {FEATURE_NAME}

**Slug:** `{feature-slug}`
**Created:** {DATE}
**Status:** Phase 1 — In Progress

---

## Phase Tracker

| Phase | Status | Started | Completed | Artifacts |
|-------|--------|---------|-----------|-----------|
| 1 — Requirements | Not Started | — | — | 1-requirements.md |
| 2 — Prototyping | Not Started | — | — | 2-prototype.md |
| 3 — Implementation | Not Started | — | — | 3-implementation.md |
| 4 — Testing | Not Started | — | — | 4-testing.md |
| 5 — Documentation | Not Started | — | — | 5-documentation.md |

---

## Feature Summary

{Brief description of the feature — filled during Phase 1 Stage 1}

---

## Key Decisions Log

All decisions made during the pipeline — updated as they happen, not at the end.

| # | Phase | Decision | Options Considered | Chosen | Rationale | Date |
|---|-------|----------|-------------------|--------|-----------|------|
| D-1 | {phase} | {question asked} | {options} | {chosen option} | {why} | {date} |

---

## Phase 1: Requirements Analysis

### Input
{Raw feature description provided by user}

### Key Decisions
- {Decision 1}
- {Decision 2}

### Deferred Items
- {Gap or requirement deferred to a later sprint, with ticket number}

### Open Questions
- {Any unresolved questions}

---

## Phase 2: Prototyping

### Approach Used
{Flow from Requirements / Extend Existing / Expand Wireframes / Generate Variants}

### Screen Inventory
| Screen | States Defined | Handoff Ready |
|--------|---------------|---------------|
| {screen} | Yes/No | Yes/No |

### User Sign-off
- [ ] Prototype spec reviewed by product owner
- [ ] Edge case flows confirmed

---

## Phase 3: Implementation

### CLAUDE.md Status
- [ ] Generated / Updated for this feature

### Task Summary
| Layer | Tasks | Completed | Blocked |
|-------|-------|-----------|---------|
| Database | {count} | {count} | {count} |
| Backend | {count} | {count} | {count} |
| API | {count} | {count} | {count} |
| Frontend | {count} | {count} | {count} |

### Review Status
- [ ] AI code review completed — Critical: {n}, High: {n}, Medium: {n}
- [ ] Security review completed — findings: {n}
- [ ] All Critical and High issues resolved
- [ ] Human code review assigned

### Resolved Decisions
| Decision | ADR # | Resolution |
|----------|-------|-----------|
| {decision} | ADR-{n} | {what was decided} |

---

## Phase 4: Testing

### Coverage Summary
| Test Type | Count | Passing | Failing |
|-----------|-------|---------|---------|
| Unit | {n} | {n} | {n} |
| Component | {n} | {n} | {n} |
| API/Integration | {n} | {n} | {n} |
| E2E | {n} | {n} | {n} |

### Coverage Gaps
- [ ] All ACs have at least one test
- [ ] All 8 states tested per component
- [ ] Coverage above project threshold

---

## Phase 5: Documentation

### Documentation Status
| Doc Type | Generated | Reviewed | Published |
|----------|-----------|----------|-----------|
| Inline Comments | — | — | — |
| API Reference | — | — | — |
| ADRs | — | — | — |
| Runbook | — | — | — |
| Release Notes | — | — | — |

---

## Changelog

| Date | Phase | Change | Downstream Impact |
|------|-------|--------|-------------------|
| {DATE} | Init | Feature initialised | — |

**Revision tracking:** When a phase artifact is revised after completion, log it here with the `[DOWNSTREAM]` impacts identified. Example:

| Date | Phase | Change | Downstream Impact |
|------|-------|--------|-------------------|
| 2026-04-02 | 1 | Added FR-9 (bulk invite) per stakeholder request | [DOWNSTREAM] Phase 2 — add bulk invite screen; Phase 3 — add BE-5 bulk endpoint; Phase 4 — add TC for bulk validation |
