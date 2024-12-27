import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

const asyncStorage = createJSONStorage(() => AsyncStorage);

export const UserAtom = atomWithStorage<any>("user", {}, asyncStorage);

export const LanguageAtom = atomWithStorage<any>("language", "", asyncStorage);

export const EarningAtom = atomWithStorage<any>("earnings", {}, asyncStorage);

export const SpentAtom = atomWithStorage<any>("spents", {}, asyncStorage);

export const NotificationConsentAtom = atomWithStorage<any>(
  "notificationConsent",
  true,
  asyncStorage
);

export const LocationAtom = atomWithStorage<any>("location", {}, asyncStorage);

export const AddServiceInProcess = atom<boolean>(false);

export const AccountStatusAtom = atomWithStorage<any>(
  "accountStatus",
  false,
  asyncStorage
);

export const AddServiceAtom = atom<any>({});

export const hasNewNotificationAtom = atomWithStorage(
  "isNewNotification",
  false,
  asyncStorage
);
