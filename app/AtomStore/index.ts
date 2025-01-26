import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

const asyncStorage = createJSONStorage(() => AsyncStorage);

const UserAtom = atomWithStorage<any>("user", {}, asyncStorage);

const LanguageAtom = atomWithStorage<any>("language", "", asyncStorage);

const EarningAtom = atomWithStorage<any>("earnings", {}, asyncStorage);

const SpentAtom = atomWithStorage<any>("spents", {}, asyncStorage);

const NotificationConsentAtom = atomWithStorage<any>(
  "notificationConsent",
  true,
  asyncStorage
);

const LocationAtom = atomWithStorage<any>("location", {}, asyncStorage);

const AccountStatusAtom = atomWithStorage<any>(
  "accountStatus",
  false,
  asyncStorage
);

const AddServiceAtom = atom<any>({});

const hasNewNotificationAtom = atomWithStorage(
  "isNewNotification",
  false,
  asyncStorage
);

// Bundle all atoms into an object
const Atoms = {
  UserAtom,
  LanguageAtom,
  EarningAtom,
  SpentAtom,
  NotificationConsentAtom,
  LocationAtom,
  AccountStatusAtom,
  AddServiceAtom,
  hasNewNotificationAtom,
};

// Export the object as default
export default Atoms;