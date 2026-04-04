# Feature: Service list screen UI upgrade

**Slug:** `service-list-ui`  
**Created:** 2026-04-02  
**Status:** Phase 2 & 3 — Complete (iterations ongoing)

---

## Phase Tracker

| Phase | Status | Started | Completed | Artifacts |
|-------|--------|---------|-----------|-----------|
| 1 — Requirements | Complete | 2026-04-02 | 2026-04-02 | 1-requirements.md |
| 2 — Prototyping | Complete | 2026-04-03 | 2026-04-03 | 2-prototype.md |
| 3 — Implementation | Complete | 2026-04-02 | 2026-04-03 | 3-implementation.md |
| 4 — Testing | Deferred | — | — | 4-testing.md |
| 5 — Documentation | Deferred | — | — | 5-documentation.md |

---

## Feature Summary

Upgrade the services list to stay **recognisable** to existing users: **large service photo**, **full metadata** (address, time posted, date, duration, distance, facilities, requirements), **soft blue panel** header area, plus **Listen** and **View details** as separate actions. **One language at a time** via `t()`. Prototypes: `2-prototype.md` and `prototype/service-list.html`.

---

## Key Decisions Log

| # | Phase | Decision | Options Considered | Chosen | Rationale | Date |
|---|-------|----------|-------------------|--------|-----------|------|
| D-1 | 3 | Labels on list | (a) two languages on one line, (b) active locale only | **Active locale only** (`t()`) — see **D-5** | Superseded: avoids clutter and matches user language setting | 2026-04-02 |
| D-2 | 3 | Service card layout | (a) large hero image, (b) compact thumbnail + clear meta | Compact thumbnail + clear meta | Faster scanning, lower visual noise, better touch UX | 2026-04-02 |
| D-3 | 2 | Visual prototypes | (a) Stitch / design tool, (b) text-only | Text spec + **Stitch prompts** in `2-prototype.md` (no MCP run in-repo) | User asked for prototypes; prompts are ready for design generation | 2026-04-03 |
| D-4 | 3 | Separate Listen vs Details | (a) whole card tappable, (b) split targets | Split targets | Reduces mis-taps for rural users | 2026-04-03 |
| D-5 | 3 | Copy on screen | (a) HI/EN on same line, (b) one locale at a time | **One locale** via `t()` | Users stay oriented; matches language setting | 2026-04-03 |
| D-6 | 3 | Card density vs redesign | (a) minimal compact card, (b) familiar rich card | **Rich / familiar** layout + light polish | Avoid “new app” disconnect | 2026-04-03 |

---

## Phase 3: Implementation

### CLAUDE.md Status
- [x] Updated for this feature (repo is single-project)

### Task Summary
| Layer | Tasks | Completed | Blocked |
|-------|-------|-----------|---------|
| Database | 0 | 0 | 0 |
| Backend | 0 | 0 | 0 |
| API | 0 | 0 | 0 |
| Frontend | 6 | 6 | 0 |

### Review Status
- [x] AI code review completed — Critical: 0, High: 0, Medium: 0
- [x] Security review completed — findings: 0
- [x] All Critical and High issues resolved
- [ ] Human code review assigned

---

## Changelog

| Date | Phase | Change | Downstream Impact |
|------|-------|--------|-------------------|
| 2026-04-02 | Init | Feature initialised | — |
| 2026-04-02 | 3 | Updated list header + card UI for bilingual, touch targets, contrast | — |
| 2026-04-03 | 2 | Added full prototype spec + Stitch prompts (`2-prototype.md`) | Design can generate mocks from prompts |
| 2026-04-03 | 3 | List header (count + hint), separators, split Listen/Details, locale keys | Other locales may need `serviceList*` keys |
| 2026-04-03 | 2 | Added interactive HTML prototype `prototype/service-list.html` (Default / Loading / Empty) | Open in browser for reviews |
| 2026-04-03 | 3 | Single-language `t()`; richer card (180px image, address + time row); calmer card chrome; prototype EN-only sample | `tBi` unused on service list |
