import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "jotai";

const asyncStorage = createJSONStorage(() => AsyncStorage);

const UserAtom = atomWithStorage<any>("user", {}, asyncStorage);

const IsLoggedInAtom = atomWithStorage<any>("loggedIn", {}, asyncStorage);

const LanguageAtom = atomWithStorage<any>("language", "hi", asyncStorage);

const EarningAtom = atomWithStorage<any>("earnings", {}, asyncStorage);

const SpentAtom = atomWithStorage<any>("spents", {}, asyncStorage);

const NotificationConsentAtom = atomWithStorage<any>(
  "notificationConsent",
  true,
  asyncStorage
);

// Atom to store unread notification IDs
const unreadNotificationIdsAtom = atom<string[]>([]);

const LocationAtom = atomWithStorage<any>("location", {}, asyncStorage);

const AccountStatusAtom = atomWithStorage<any>(
  "accountStatus",
  false,
  asyncStorage
);

const AddServiceAtom = atom<any>({});

const AddServiceStepAtom = atom<any>(1);

const hasNewNotificationAtom = atomWithStorage(
  "isNewNotification",
  false,
  asyncStorage
);
const notificationCount = atomWithStorage("notficationCount", 0, asyncStorage);

const APPEARED_NOTIFICATIONS_KEY = "appearedNotifications";

const appearedNotificationsAtom = atom<string[]>([]);

const getAppearedNotifications = async (): Promise<string[]> => {
  const stored = await AsyncStorage.getItem(APPEARED_NOTIFICATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveAppearedNotifications = async (notifications: string[]) => {
  await AsyncStorage.setItem(
    APPEARED_NOTIFICATIONS_KEY,
    JSON.stringify(notifications)
  );
};

const LocaleAtom = atomWithStorage<any>("locale", {}, asyncStorage);

const BottomDrawerAtom = atom({
  visible: false,
  title: "",
  content: () => null,
  primaryButton: null,
  secondaryButton: null,
});

const SideDrawerAtom = atom({
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
  AddServiceStepAtom,
  hasNewNotificationAtom,
  appearedNotificationsAtom,
  getAppearedNotifications,
  saveAppearedNotifications,
  unreadNotificationIdsAtom,
  notificationCount,
  LocaleAtom,
  BottomDrawerAtom,
  SideDrawerAtom,
  IsLoggedInAtom
};

// Export the object as default
export default Atoms;
