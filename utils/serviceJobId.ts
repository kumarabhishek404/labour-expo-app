/**
 * Human-readable job id from API (e.g. `JOB2026000195`). Falls back to `_id` when missing.
 */
export function getServiceJobId(
  service: { jobID?: unknown; jobId?: unknown; _id?: unknown } | null | undefined,
): string {
  if (!service || typeof service !== "object") return "";
  const raw = service.jobID ?? service.jobId;
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).trim();
  }
  if (service._id != null) return String(service._id).trim();
  return "";
}
