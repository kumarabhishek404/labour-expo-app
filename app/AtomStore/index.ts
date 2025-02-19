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

const LocaleAtom = atomWithStorage<any>("locale", {}, asyncStorage);

const BottomDrawerAtom = atom({
  visible: false,
  title: "",
  content: () => null,
  primaryButton: null,
  secondaryButton: null,
});
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
  LocaleAtom,
  BottomDrawerAtom
};

// Export the object as default
export default Atoms;