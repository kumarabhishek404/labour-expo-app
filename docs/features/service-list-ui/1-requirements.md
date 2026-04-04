## Requirements Document

### Feature Summary

Upgrade the **service list** screen UX to be simple, clean, mobile-first for rural users:

- **Large touch targets**: primary actions should be easy to tap (min ~44–48px height).
- **One language at a time**: headings and CTAs use the active app locale (`t()`), not mixed Hindi/English on the same line.
- **High contrast**: readable text on light surfaces; avoid low-contrast overlays.
- **Fast scanning**: compact cards, reduced visual noise, key info up front.
- **Production-ready**: keep navigation/data flow intact; no breaking changes.

### Functional Requirements

- **FR-1**: Screen header shows title and subtitle in the **current app language**.
- **FR-2**: Each service item is presented in a clean, compact card with clear hierarchy.
- **FR-3**: Primary CTA(s) are large and obvious; tap on card navigates to details.
- **FR-4**: Existing list behaviors remain: pull-to-refresh, pagination footer loader, empty state.
- **FR-5**: List shows a short **count badge** (total from API when available) and a **pull-to-refresh hint** (bilingual).
- **FR-6**: **Listen** (TTS) and **open details** are separate tap targets so users do not accidentally navigate when using audio.

### Non-Functional Requirements

- **NFR-1**: Perceived performance remains good (avoid expensive renders, preserve FlatList optimizations).
- **NFR-2**: Accessibility: proper touch target sizing and readable typography.
- **NFR-3**: Maintain compatibility with current translations (fallbacks when keys missing).

---

## Gap Analysis

- **High**: Some translation keys may not exist in all locales; require graceful fallback.
- **Medium**: Some UI components may assume dark gradient background; ensure contrast inside a white surface.
- **Low**: A full “design system” pass is out of scope; focus only on the service list and cards.

---

## User Stories

### US-1 (FR-1, FR-2)
As a rural user, I want a familiar list in **my chosen language** so that I can scan services quickly without relearning the screen.

**AC-1**: Title/subtitle use `t("allServices")` / `t("allServicesSubHeading")` for the active locale.
**AC-2**: Card layout matches the **familiar structure**: large image on top, title, requirements, address with time-ago on the right, date/duration/distance, facilities, then Listen + View details.

### US-2 (FR-3, FR-6)
As a rural user, I want big buttons and easy taps so that I can open service details without mistakes.

**AC-3**: Tapping the **main card body** or **View details** opens service detail; **Listen** does not navigate.
**AC-4**: CTA row has min-height ~48 and readable text.

### US-3 (FR-4)
As a user, I want the list to behave the same (refresh, pagination, empty state) so that the upgrade doesn’t break usage.

**AC-5**: Pull-to-refresh remains available.
**AC-6**: Pagination loader still appears.
**AC-7**: Empty placeholder still renders when no items exist.

### US-4 (FR-5)
As a user, I want to see how many services are available and how to refresh so that I trust the list is up to date.

**AC-8**: Count badge shows total from API when `totalData > 0`, otherwise the number of loaded items.
**AC-9**: Pull hint is visible above the list in the active language.

---

## Test Scenarios (high-level)

- **TS-1** (AC-1): Header strings use `t("allServices")` / `t("allServicesSubHeading")` for the active locale.
- **TS-2** (AC-3): Tapping the main body or View details navigates to `/screens/service/[id]` with correct params; Listen does not.
- **TS-3** (AC-5): Pull-to-refresh triggers `onRefresh`.
- **TS-4** (AC-6): Loader appears when `isFetchingNextPage` is true.
- **TS-5** (AC-7): Empty placeholder is shown when list is empty.
- **TS-6** (AC-8, AC-9): List header shows count + pull hint in the active locale.

---

## Architecture Inputs

- **Components involved**:
  - `app/screens/bottomTabs/(user)/search/allServices.tsx` (screen container)
  - `components/commons/ListingsVerticalServices.tsx` (FlatList wrapper)
  - `components/commons/ListingServices.tsx` (service card)
  - `utils/translationHelper.tsx` (translation helpers)

- **Open design questions**:
  - None for this enhancement (kept within existing patterns).

