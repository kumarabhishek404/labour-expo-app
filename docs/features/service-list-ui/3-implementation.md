## Implementation Plan

### FE-1 → US-1
Update the service list header to show bilingual (Hindi + English) labels and improve contrast.

- Files:
  - `app/screens/bottomTabs/(user)/search/allServices.tsx`

### FE-2 → US-1, US-2
Refactor the service card to a compact, high-contrast layout with large touch targets.

- Files:
  - `components/commons/ListingServices.tsx`

### FE-3 → US-1
Add a bilingual translation helper for combined labels.

- Files:
  - `utils/translationHelper.tsx`

---

## What Changed

- Service list (`allServices.tsx`): title/subtitle use **`t()`** (single active locale); **`AnimatedGradientWrapper`**; **light content panel** (`#FAFBFF` `contentCard`); **`ListHeaderComponent`** with **`serviceListCountBadge`** (API `totalData` when available and positive, else loaded count) + **`serviceListPullHint`**; **`totalData`** prop wired from search parents; refresh **`tintColor`** primary on the light panel.
- `ListingsVerticalServices.tsx`: optional `ListHeaderComponent`; **12px** separators; **`LIST_BOTTOM_INSET` 120** for pagination/footer space.
- `ListingServices.tsx`: **large hero image (180)** and **address + `getTimeAgo` on one row** (like the classic layout); requirements, date, duration, distance, facilities; **Listen** and **View details** remain separate from the main body tap target. Card styling closer to the original (lighter border/shadow, 12px radius). `tBi` is not used on this screen.
- Locales: `serviceListPullHint`, `serviceListCountBadge` in `en.json` and `hi.json`.

---

## Code Review Findings

- **Critical**: 0
- **High**: 0
- **Medium**: 0
- **Low**: 0

---

## Security Review Findings

No auth/token/data handling changes were introduced.

