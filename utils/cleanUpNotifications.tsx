// utils/cleanupNotifications.ts
import Atoms from "@/app/AtomStore";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

export const cleanOldNotifications = () => {
  setInterval(() => {
    store.set(Atoms?.unreadNotificationIdsAtom, []);
    console.log("Old notifications cleared from storage");
  }, 7 * 24 * 60 * 60 * 1000); // Weekly interval
};
