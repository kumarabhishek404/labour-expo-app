/**
 * Resolves WORKER / MEDIATOR / EMPLOYER for UI tags.
 * 1) Use explicit `user.role` when it is one of the three.
 * 2) If missing/invalid: at least one skill → not employer; if any skill has pricePerDay > 0 → Labour (WORKER), else → Contractor (MEDIATOR).
 * 3) If no skills → EMPLOYER (hiring profile without listed trades).
 */
export type AppUserRole = "WORKER" | "MEDIATOR" | "EMPLOYER";

function normalizeExplicitRole(role: unknown): AppUserRole | null {
  const r = String(role ?? "")
    .toUpperCase()
    .trim();
  if (r === "WORKER" || r === "MEDIATOR" || r === "EMPLOYER") return r;
  return null;
}

function hasAtLeastOneSkill(skills: unknown): boolean {
  if (!Array.isArray(skills) || skills.length === 0) return false;
  return skills.some((entry) => {
    if (entry == null) return false;
    if (typeof entry === "string") return entry.trim().length > 0;
    if (typeof entry === "object" && entry !== null && "skill" in entry) {
      return String((entry as { skill?: string }).skill ?? "").trim().length > 0;
    }
    return false;
  });
}

function hasPositivePricePerDayOnAnySkill(skills: unknown): boolean {
  if (!Array.isArray(skills)) return false;
  return skills.some((entry) => {
    if (entry == null || typeof entry !== "object") return false;
    const p = (entry as { pricePerDay?: unknown }).pricePerDay;
    if (p == null || p === "") return false;
    const n = typeof p === "number" ? p : parseFloat(String(p));
    return !Number.isNaN(n) && n > 0;
  });
}

export function resolveDisplayUserRole(user: {
  role?: unknown;
  skills?: unknown;
}): AppUserRole {
  const explicit = normalizeExplicitRole(user?.role);
  if (explicit != null) return explicit;

  if (!hasAtLeastOneSkill(user?.skills)) {
    return "EMPLOYER";
  }
  if (hasPositivePricePerDayOnAnySkill(user?.skills)) {
    return "WORKER";
  }
  return "MEDIATOR";
}

export function roleToTranslationKey(role: AppUserRole): string {
  switch (role) {
    case "MEDIATOR":
      return "roleTagContractor";
    case "EMPLOYER":
      return "roleTagEmployer";
    case "WORKER":
    default:
      return "roleTagLabour";
  }
}
