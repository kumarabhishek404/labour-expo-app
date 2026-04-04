import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

type IonName = ComponentProps<typeof Ionicons>["name"];
type Fa5Name = ComponentProps<typeof FontAwesome5>["name"];

export type ServiceHeroIconSpec =
  | { family: "ion"; name: IonName; size?: number }
  | { family: "fa5"; name: Fa5Name; size?: number };

/**
 * Picks a relatable icon when a service has no photo, using work `type` /
 * `subType` (API + WORKTYPES values).
 */
export function getServiceListHeroIcon(
  workType?: string,
  subType?: string,
): ServiceHeroIconSpec {
  const wt = (workType || "").trim();
  const st = (subType || "").toLowerCase();

  if (
    wt === "farmingWork" ||
    /field|crop|harvest|farm|sichai|khad|bueai|jutai|dairy|cropcare|milking/i.test(st)
  ) {
    return { family: "ion", name: "leaf", size: 72 };
  }
  if (wt === "driverJobs") {
    if (/tractor/i.test(st)) {
      return { family: "fa5", name: "tractor", size: 64 };
    }
    return { family: "ion", name: "car-sport-outline", size: 70 };
  }
  if (/tractor/i.test(st)) {
    return { family: "fa5", name: "tractor", size: 64 };
  }
  if (
    /truck|jcb|crane|forklift|vehicle|loader|combine|hydra|tempo|ambulance|bus|bike|driver/i.test(st)
  ) {
    return { family: "ion", name: "car-sport-outline", size: 70 };
  }
  if (
    wt === "constructionWork" ||
    /mistri|plaster|brick|shuttering|steel|welder|construction|site/i.test(st)
  ) {
    return { family: "ion", name: "construct-outline", size: 72 };
  }
  if (
    wt === "homeMaintenance" ||
    /plumber|electrician|painter|carpenter|home|house|repair|maid|gardener|security/i.test(st)
  ) {
    if (/electric|wiring|mechanic|ac|fridge|voltage|flash/i.test(st)) {
      return { family: "ion", name: "flash-outline", size: 72 };
    }
    return { family: "ion", name: "home-outline", size: 72 };
  }
  if (wt === "electricalRepair" || /appliance|wiring|inverter|motor|cooler|geyser|tv/i.test(st)) {
    return { family: "ion", name: "flash-outline", size: 72 };
  }
  if (wt === "shopWork" || /shop|delivery|packer|cashier|marketing|palledar/i.test(st)) {
    return { family: "ion", name: "storefront-outline", size: 68 };
  }
  if (wt === "animalWork" || /veterinary|animal/i.test(st)) {
    return { family: "ion", name: "paw-outline", size: 70 };
  }
  if (wt === "factoryJobs" || /factory|operator|janitor|supervisor|foreman/i.test(st)) {
    return { family: "ion", name: "cube-outline", size: 68 };
  }
  if (wt === "generalLabour" || /labour|labor|daily/i.test(st)) {
    return { family: "ion", name: "barbell-outline", size: 68 };
  }

  return { family: "ion", name: "briefcase-outline", size: 64 };
}
