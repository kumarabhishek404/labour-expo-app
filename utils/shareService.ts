import { Share } from "react-native";
import moment from "moment";
import { getDynamicWorkerType } from "@/utils/i18n";
import { PLAY_STORE_LISTING_URL } from "@/utils/serviceDeepLink";
import { getServiceJobId } from "@/utils/serviceJobId";

export type ShareMessageOptions = {
  t: (key: string, options?: Record<string, string | number>) => string;
};

/** Hindi labels for shared job post (WhatsApp-friendly). */
const HI = {
  title: "अपना रोज़गार — काम का विवरण",
  divider: "────────────────",
  jobType: "काम का प्रकार",
  howToApply: "आवेदन कैसे करें",
  address: "काम का पता",
  employerPhoneTitle: "काम देने वाले (मालिक) का मोबाइल नंबर",
  employerPhoneNote:
    "संपर्क: काम की पूरी जानकारी, दिहाड़ी और शर्तों के लिए इस नंबर पर कॉल या व्हाट्सऐप करें।",
  startDate: "काम शुरू होने की तारीख",
  duration: "अवधि (लगभग)",
  days: "दिन",
  skillPay: "कौशल और दिहाड़ी (सीधा काम)",
  workersNeeded: "किन-किन कारीगरों की जरूरत है",
  workersNeededNote:
    "नीचे हर पंक्ति में: कितने आदमी चाहिए और प्रतिदिन कितनी दिहाड़ी — यही जानकारी आवेदन के लिए जरूरी है।",
  facilitiesTitle: "मालिक जो सुविधाएँ दे रहा है (केवल यही उपलब्ध हैं)",
  facilitiesNone: "अलग से खाना / रहना / सफर / ईएसआई-पीएफ की सुविधा घोषित नहीं है।",
  description: "और विवरण",
  jobIdTitle: "काम की पहचान — जॉब आईडी (संदर्भ के लिए नोट करें)",
  howToOpenInApp: "ऐप में यह काम खोलकर आवेदन कैसे करें:",
  step1: "१) \"अपना रोज़गार\" मोबाइल ऐप खोलें।",
  step2: "२) होम / मेनू से \"सभी काम\" (All services) पर जाएँ।",
  step3: "३) नीचे लिखी जॉब आईडी से यही काम ढूँढें।",
  step4: "४) उस काम पर टैप करें, पूरा विवरण पढ़ें और आवेदन करें।",
  playStoreLine:
    "ऐप फोन में नहीं है तो पहले प्ले स्टोर से \"अपना रोज़गार\" इंस्टॉल करें, फिर ऊपर के चरण दोहराएँ।",
  footer: "अपना रोज़गार से साझा किया गया। ज़रूरतमंद मजदूर भाइयों तक पहुँचाएँ।",
} as const;

const FACILITY_HI: Record<
  "food" | "living" | "travelling" | "esi_pf",
  string
> = {
  food: "खाने की सुविधा",
  living: "रहने की व्यवस्था",
  travelling: "आने-जाने (सफर) की सुविधा",
  esi_pf: "ईएसआई / पीएफ",
};

function formatStartDateEnglishLong(startDate: unknown): string {
  const raw =
    startDate && typeof startDate === "object" && "$date" in (startDate as object)
      ? (startDate as { $date: string }).$date
      : startDate;
  if (!raw) return "";
  const m = moment(raw as string | Date);
  if (!m.isValid()) return "";
  const day = m.date();
  const month = m.format("MMMM");
  const year = m.format("YYYY");
  return `${day} ${month}, ${year}`;
}

function addressToString(address: unknown): string {
  if (address == null) return "";
  if (typeof address === "string") return address.trim();
  try {
    return JSON.stringify(address);
  } catch {
    return String(address);
  }
}

function buildProvidedFacilitiesHindi(
  fac: Record<string, boolean | undefined> | undefined,
): string[] {
  if (!fac || typeof fac !== "object") return [];
  const out: string[] = [];
  (["food", "living", "travelling", "esi_pf"] as const).forEach((key) => {
    if (fac[key]) {
      out.push(`✓ ${FACILITY_HI[key]}`);
    }
  });
  return out;
}

/**
 * Hindi share text for WhatsApp etc.: clear sections, employer phone explained,
 * job ID for reference, simple steps to open All services and apply (no app deep link in text).
 */
export function buildServiceShareMessage(
  service: any,
  opts: ShareMessageOptions,
): string {
  const { t } = opts;
  if (!service || typeof service !== "object") {
    return t("shareServiceFallback");
  }

  const blocks: string[] = [];

  blocks.push(`*${HI.title}*`);
  blocks.push(HI.divider);

  if (service.type && service.subType) {
    blocks.push(
      `*${HI.jobType}*\n${t(String(service.type))} — ${t(String(service.subType))}`,
    );
  } else if (service.subType) {
    blocks.push(`*${HI.jobType}*\n${t(String(service.subType))}`);
  }

  if (service.bookingType) {
    blocks.push(`*${HI.howToApply}*\n${t(String(service.bookingType))}`);
  }

  const addr = addressToString(service.address);
  if (addr) {
    blocks.push(`*${HI.address}*\n${addr}`);
  }

  const employer = service.employer as { mobile?: string } | undefined;
  const mobile = employer?.mobile && String(employer.mobile).trim();
  if (mobile) {
    blocks.push(
      `*${HI.employerPhoneTitle}*\n${HI.employerPhoneNote}\n*${mobile}*`,
    );
  }

  const start = formatStartDateEnglishLong(service.startDate);
  if (start) {
    blocks.push(`*${HI.startDate}*\n${start}`);
  }

  if (service.duration != null && service.duration !== "") {
    blocks.push(
      `*${HI.duration}*\n${String(service.duration)} ${HI.days}`,
    );
  }

  const applied = service.appliedSkill as
    | { skill?: string; pricePerDay?: number | string }
    | undefined;
  if (applied?.skill) {
    const skillLabel = getDynamicWorkerType(applied.skill, 1);
    const pay =
      applied.pricePerDay != null && applied.pricePerDay !== ""
        ? ` — ₹${applied.pricePerDay} / ${t("perDay")}`
        : "";
    blocks.push(`*${HI.skillPay}*\n${skillLabel}${pay}`);
  }

  const reqs = service.requirements as
    | Array<{
        name?: string;
        count?: number;
        payPerDay?: number | string;
      }>
    | undefined;
  if (Array.isArray(reqs) && reqs.length > 0) {
    const lines = reqs.map((req, i) => {
      const name = req?.name
        ? getDynamicWorkerType(req.name, req?.count ?? 1)
        : "?";
      const pay =
        req?.payPerDay != null && req.payPerDay !== ""
          ? ` — ₹${req.payPerDay} प्रति दिन`
          : "";
      return `${i + 1}. ${name} — संख्या: ${req?.count ?? "?"}${pay}`;
    });
    blocks.push(
      `*${HI.workersNeeded}*\n${HI.workersNeededNote}\n\n${lines.join("\n")}`,
    );
  }

  const fac = service.facilities as Record<string, boolean | undefined> | undefined;
  const provided = buildProvidedFacilitiesHindi(fac);
  if (provided.length > 0) {
    blocks.push(`*${HI.facilitiesTitle}*\n${provided.join("\n")}`);
  } else {
    blocks.push(`*${HI.facilitiesTitle}*\n${HI.facilitiesNone}`);
  }

  const desc = service.description;
  if (typeof desc === "string" && desc.trim()) {
    blocks.push(`*${HI.description}*\n${desc.trim()}`);
  }

  const jobRef = getServiceJobId(service);
  if (jobRef) {
    blocks.push(HI.divider);
    blocks.push(`*${HI.jobIdTitle}*\n${jobRef}`);
    blocks.push(
      `*${HI.howToOpenInApp}*\n${HI.step1}\n${HI.step2}\n${HI.step3}\n${HI.step4}`,
    );
    blocks.push(`${HI.playStoreLine}\n${PLAY_STORE_LISTING_URL}`);
  }

  blocks.push(`_${HI.footer}_`);

  return blocks.filter(Boolean).join("\n\n");
}

export async function shareServiceDetails(
  service: any,
  opts: ShareMessageOptions,
): Promise<{ ok: boolean }> {
  const message = buildServiceShareMessage(service, opts);
  if (!message.trim()) {
    return { ok: false };
  }

  try {
    const title = opts.t("shareServiceTitle");
    await Share.share({ message, title });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
