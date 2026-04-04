# Prototype specification — Service list (Search → Services)

**Feature slug:** `service-list-ui`  
**Approach:** Extend existing product (Expo Router + React Native)  
**Design theme:** Primary blue `#22409a`, soft surface `#EAF0FF` (`Colors.secondaryBackground`), white cards, high contrast text.

---

## Interactive prototype (HTML)

A **clickable, in-browser** mockup mirrors this spec (blue theme, list header, **familiar large photo + dense info**, separate Listen / Details). Copy uses **one language at a time** (same as the app: `t()` for the active locale).

| File | How to view |
|------|-------------|
| [`prototype/service-list.html`](./prototype/service-list.html) | Open in Chrome/Safari/Firefox (double-click the file, or “Open with Live Server” in VS Code). |

**States (toolbar buttons):** **Default** — two sample cards + count badge + pull hint; **Loading** — skeleton placeholders; **Empty** — empty state + refresh CTA.

> This is for **design / stakeholder review** only; the production UI remains in React Native (`allServices.tsx`, `ListingServices.tsx`).

---

## Screen inventory

| ID | Screen / surface | Route / host | Primary user |
|----|------------------|--------------|--------------|
| S-1 | Service list (in-tab) | `app/screens/bottomTabs/(user)/search/allServices.tsx` | Worker (primary); others when tab shows services |
| S-2 | Service row / card | `components/commons/ListingServices.tsx` | Same |
| S-3 | Vertical list shell | `components/commons/ListingsVerticalServices.tsx` | Same |

---

## S-1 — Service list container

### Layout (ASCII)

```
┌─────────────────────────────────────┐  ← gradient header (brand)
│  Title (HI / EN)                    │
│  Subtitle (HI / EN)                 │
├─────────────────────────────────────┤  ← soft blue rounded panel
│  [ N open ]  (count badge)          │
│  Pull hint (HI / EN)                │
│  ─────────────────────────────────  │
│  [ Card ]                           │
│       (12px gap)                    │
│  [ Card ]                           │
│  ...                                 │
│  [ spinner if loading more ]       │
└─────────────────────────────────────┘
```

### 8 interaction states

| State | UI behaviour |
|-------|----------------|
| **Default** | Gradient visible; white/soft-blue content panel; header + list; count badge shows total from API when available, else loaded count. |
| **Loading** | Full-screen / inline placeholder (`ListingsServicesPlaceholder`); no list rows. |
| **Empty** | `EmptyDataPlaceholder` for `service`; primary action refresh if wired. |
| **Success** | List populated; pull-to-refresh idle; footer hidden when not fetching next page. |
| **Error** | Inherited from parent query (retry/refetch via pull-to-refresh where configured). |
| **Validation** | N/A (read-only list). |
| **Permission** | Same list; row-level badges (employer proposals) unchanged. |
| **Offline** | Inherited app behaviour; refresh may no-op or show toast per app pattern. |

### Accessibility

- Count badge and pull hint readable at ~12–13sp; sufficient contrast on `#EAF0FF` / white.
- Pull-to-refresh: native `RefreshControl` with `tintColor` aligned to primary.

---

## S-2 — Service card

### Layout (ASCII)

```
┌─────────────────────────────────────┐
█ 6px primary accent bar               │
│ ┌─────────────────────────────────┐ │
│ │     Full-width photo (familiar)  │ │  [Direct] tag top-right on image
│ │     Employer/worker chips bottom │ │
│ └─────────────────────────────────┘ │
│ Title (work subtype)                 │
│ [By-service if needed] [time chip]  │
│ Requirements highlights (as today)   │
│ Address (2 lines), date, duration,   │
│   distance, facilities               │
├─────────────────────────────────────┤
│ [ Listen ] [ View details → ]      │  ← unchanged pattern
└─────────────────────────────────────┘
```

### 8 interaction states

| State | UI behaviour |
|-------|----------------|
| **Default** | Card white, blue border/shadow; tap main body → details; tap Listen → TTS; tap Details → details. |
| **Loading** | N/A per card (list handles). |
| **Empty** | N/A. |
| **Success** | Image or placeholder; chips show direct/time. |
| **Error** | Image fails → placeholder still shows. |
| **Validation** | N/A. |
| **Permission** | Employer sees proposals row; worker sees “selected” / proposals badges. |
| **Offline** | Listen may fail; no navigation block unless app adds it. |

### Key interaction rule (prototype intent)

- **Listen** must not be nested inside the same press target as **open details**, to avoid accidental navigation for rural users with lower tap precision.

### Accessibility

- `accessibilityRole="button"` on main body, Listen, and Details.
- Labels use bilingual strings where `tBi` is used (`listenAboutService`, `speakingAndClose`, `viewDetails`).

---

## S-3 — List shell (`FlatList`)

- `ItemSeparatorComponent`: fixed **12px** vertical gap between cards (no double margin on cards).
- `ListHeaderComponent`: count badge + pull hint.
- `onEndReached` debounced; footer `ActivityIndicator` when `isFetchingNextPage`.

---

## Developer handoff package

### Files to touch

| Area | File |
|------|------|
| Screen | `app/screens/bottomTabs/(user)/search/allServices.tsx` |
| List | `components/commons/ListingsVerticalServices.tsx` |
| Card | `components/commons/ListingServices.tsx` |
| Copy | `app/locales/en.json`, `app/locales/hi.json` (`serviceListPullHint`, `serviceListCountBadge`) |
| i18n helper | `utils/translationHelper.tsx` (`tBi` + optional `count` in both locales) |

### API / data

- `totalData` from `response.pages[0].pagination.total` (parent search tab).
- Fallback count: length of deduped `memoizedData` when total missing or zero.

### Navigation (unchanged)

- Details: `/screens/service/[id]` with existing params.

---

## Stitch prompts (visual mockups)

Use these with Stitch / Figma AI / similar. **Color tokens:** primary `#22409a`, surface `#EAF0FF`, card `#FFFFFF`, text `#2C2C2C`, border `rgba(34,64,154,0.22)`.

### Prompt A — S-1 Service list (default state)

> Mobile screen, 390×844, rural India workforce app. Top area: vertical gradient from deep royal blue `#22409a` to slightly lighter blue. Large bold title “सभी सेवाएं / All Services” and subtitle in white. Below: large rounded panel (18px radius) filled with soft blue `#EAF0FF`, subtle shadow. Inside panel at top: a white pill badge with blue text “12 open” (Hindi + English dual line or single line with slash). Under it, small grey hint text bilingual: pull to refresh. Below: scrollable list of white service cards. Clean, minimal, high contrast, large touch targets.

### Prompt B — S-2 Service card (default)

> Single service card, full width, 16px corner radius, white background, thin blue border, soft blue shadow. Top edge: 6px solid blue bar. Row: left 86px rounded thumbnail, right: bold title, row of pills (primary blue “Direct booking”, light blue outline pill with clock icon and “2h ago”). Below: one-line address, date row, duration and distance on one row. Bottom: two buttons same row — primary blue “Listen” with speaker icon, secondary outlined “View details” with chevron. Hindi + English labels on buttons. Ample padding, 48px min touch height.

### Prompt C — S-1 Loading

> Same layout as Prompt A but content panel shows 3–4 grey skeleton cards (rounded rectangles) with shimmer; no list text.

### Prompt D — S-1 Empty

> Same gradient header; soft blue panel shows large friendly illustration placeholder, bilingual message “No services right now”, primary blue button “Refresh”.

---

## Traceability

| Prototype ID | Implements FR (see `1-requirements.md`) |
|--------------|----------------------------------------|
| S-1 | FR-1, FR-4, FR-5 |
| S-2 | FR-2, FR-3 |
| S-3 | FR-4, NFR-1 |
