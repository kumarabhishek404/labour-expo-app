# CLAUDE.md — Labour Expo App (Single Project)

Project rules and codebase patterns for AI coding sessions and new engineers.

This repository is a **single Expo/React Native project** (not a monorepo). Keep guidance, paths, and commands aligned to the repo root.

---

## 0. DEFAULT WORKFLOW — AI METHODOLOGY

For any **new feature, enhancement, or UI improvement**, follow the 5-phase pipeline in `.agents/skills/ai-methodology/SKILL.md`.

**How to apply:**

1. Read `.agents/skills/ai-methodology/SKILL.md` at the start of the task
2. Follow: Requirements → Prototyping → Implementation → Testing → Documentation
3. Store artifacts under `docs/features/{feature-slug}/`

---

## 1. PROJECT STRUCTURE (SINGLE APP)

Typical high-level layout in this repo:

```
labour-expo-app/
├── app/                        # Expo Router routes (screens, layouts, tabs)
│   ├── _layout.tsx
│   ├── (tabs)/_layout.tsx
│   ├── screens/                # Route-level UI (if used by this repo)
│   └── ...route segments...
├── components/                 # Reusable UI components
├── constants/                  # App constants + shared helper functions
├── utils/                      # Utilities + hooks (e.g. deep link handlers)
├── app/context/                # React context providers (e.g. notifications)
├── assets/                     # Images, fonts, icons
├── app.json                    # Expo config
├── package.json
└── tsconfig.json
```

**Rules:**

- Keep new route screens under `app/` following Expo Router conventions.
- Put reusable UI into `components/` (avoid duplicating UI across screens).
- Put shared, non-UI helpers into `utils/` (hooks belong here too).
- Keep constants and tiny pure helpers in `constants/` only when it stays cohesive.

---

## 2. NAMING CONVENTIONS

### Files and folders

- **Routes/screens**: match the conventions in `app/` (route segment naming matters).
- **Components**: `PascalCase.tsx` for React components (e.g. `Highlights.tsx`).
- **Hooks**: `useSomething.ts` / `useSomething.tsx` (e.g. `useDeepLinkHandler.tsx`).
- **Utilities**: `camelCase.ts` or `camelCase.tsx` (match existing folder patterns).

### Code style

- **Components**: PascalCase (`ServiceCard`, `Highlights`).
- **Hooks/helpers**: camelCase (`useDeepLinkHandler`, `formatPhoneNumber`).
- **Types**: PascalCase (`NotificationPayload`, `ServiceDetails`).

---

## 3. STATE & DATA FLOW

### Local UI state

- Prefer component-local `useState` / `useReducer` unless multiple screens need the state.

### Cross-screen state

- Use Context under `app/context/` when state must be shared across many routes (e.g. notification state).
- Keep contexts focused: one domain per context; avoid “GlobalContext” patterns.

### Server/network state

- Centralize API calls behind a small set of helper functions/services (location depends on current repo patterns).
- Avoid scattering raw `fetch` calls across screens unless that is the project’s established pattern.

---

## 4. ROUTING, LINKS, AND DEEP LINKING

- Use Expo Router primitives (`Link`, `router`, route segments) consistently within `app/`.
- Deep link handling logic should live in `utils/` as a hook and be wired once from the root layout (`app/_layout.tsx`) unless there is a strong reason otherwise.
- Keep route params typed and validated; avoid assuming param shapes without handling edge cases.

---

## 5. UI PATTERNS

- Prefer **small reusable components** in `components/` for repeated UI blocks (cards, highlights, headers).
- Keep screens responsible for orchestration; keep components responsible for presentation.
- Avoid inline-style sprawl; match the styling approach already used in the repo.

---

## 6. NOTIFICATIONS

- Keep notification state/handlers centralized in `app/context/NotificationContext.tsx` (or the current established context module).
- Avoid duplicated listeners across screens; register once at the app boundary when possible.

---

## 7. TESTING

- If a test framework is already configured, follow it.
- If not, keep changes testable by design: pure helpers in `utils/` should be deterministic and side-effect free where possible.
- Add tests when requested, or when the change is regression-prone.

---

## 8. ERROR HANDLING

- Surface user-visible errors consistently (toast/snackbar/alert), matching existing patterns.
- Log unexpected errors once at the boundary (screen/controller), not repeatedly deep inside helper functions.

---

## 9. CONFIGURATION & SECRETS

- **Never commit secrets**.
- Prefer Expo config (`app.json`) and environment variables for configuration.
- Do not hardcode API base URLs; use the project’s existing configuration pattern.

---

## 10. KEY RULES (KEEP THESE TRUE)

1. **Single project only** — no `apps/*` or `packages/*` assumptions.
2. **Follow existing folder conventions** in this repo (`app/`, `components/`, `constants/`, `utils/`, `app/context/`).
3. **Don’t hardcode secrets or base URLs** — use config/env.
4. **Centralize side effects** (notifications, deep links) to avoid duplicated listeners.
5. **Prefer small, focused changes** — keep diffs consistent with existing code style.
