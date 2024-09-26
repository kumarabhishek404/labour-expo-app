import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStorage = createJSONStorage(() => AsyncStorage);

export const UserAtom = atomWithStorage<any>('user', {}, asyncStorage);

export const LanguageAtom = atomWithStorage<any>('language', '', asyncStorage);

export const WorkAtom = atomWithStorage<any>('works', {}, asyncStorage);

export const EarningAtom = atomWithStorage<any>('earnings', {}, asyncStorage);

export const LocationAtom = atomWithStorage<any>('location', {}, asyncStorage);
