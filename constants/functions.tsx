import moment from "moment";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import TOAST from "@/app/hooks/toast";
import EMPLOYER from "@/app/api/employer";
import { t } from "@/utils/translationHelper";
import { WORKTYPES } from ".";
import { Linking } from "react-native";
import { AppState } from "react-native";

export const dateDifference = (date1: Date, date2: Date): string => {
  const startDate = moment(date1);
  const endDate = moment(date2);
  const diffDays = endDate.diff(startDate, "days") + 1;

  // If the difference is less than 30 days, return in days
  if (diffDays < 30) {
    return `${diffDays} ${diffDays > 1 ? t("days") : t("day")}`;
  }

  // Calculate the difference in months (inclusive)
  const diffMonths = endDate.diff(startDate, "months", true);

  // If the difference is less than 12 months, return in months
  if (diffMonths < 12) {
    return `${Math.round(diffMonths)} ${
      Math.round(diffMonths) > 1 ? t("months") : t("month")
    }`;
  }

  // Otherwise, calculate the difference in years
  const diffYears = endDate.diff(startDate, "years", true);
  return `${Math.round(diffYears)} ${
    Math.round(diffYears) > 1 ? t("years") : t("year")
  }`;
};

export const getTimeAgo = (createdOn: Date) => {
  const createdAt = new Date(createdOn);
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} ${months > 1 ? t("months") : t("month")} ${t("ago")}`;
  } else if (weeks > 0) {
    return `${weeks} ${weeks > 1 ? t("weeks") : t("week")} ${t("ago")}`;
  } else if (days > 0) {
    return `${days} ${days > 1 ? t("days") : t("day")} ${t("ago")}`;
  } else if (hours > 0) {
    return `${hours} ${hours > 1 ? t("hours") : t("hour")} ${t("ago")}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes > 1 ? t("minutes") : t("minute")} ${t("ago")}`;
  } else {
    return `${seconds} ${seconds > 1 ? t("seconds") : t("second")} ${t("ago")}`;
  }
};

export const isEmptyObject = (obj: object) => {
  return Object?.entries(obj).length === 0 && obj.constructor === Object;
};

export const removeEmptyStrings = (arr: any) => {
  return arr?.filter((item: any) => item !== "");
};

export const getWorkLabel = (availableSkills: any, skill: string) => {
  let object = availableSkills?.filter((type: any) => type?.value === skill)[0];
  return object?.label && getDynamicWorkerType(object?.label, 1);
};

export const calculateDistance = (
  cordinates1: {
    latitude: number;
    longitude: number;
  },
  cordinates2: {
    latitude: number;
    longitude: number;
  }
) => {
  const R = 6371; // Radius of the Earth in kilometers

  // Helper function to convert degrees to radians
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  const lat1Rad = toRadians(cordinates1?.latitude);
  const lon1Rad = toRadians(cordinates1?.longitude);
  const lat2Rad = toRadians(cordinates2?.latitude);
  const lon2Rad = toRadians(cordinates2?.longitude);

  // Calculate differences
  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  // Apply Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.floor(R * c); // Distance in kilometers
};

export const fetchCurrentLocation = async () => {
  try {
    // Check if location services are enabled
    await Location.hasServicesEnabledAsync();
    // // Prompt user to enable GPS if it's off
    // if (!isLocationServicesEnabled) {
    //   TOAST?.error("Please enable GPS to get your location.");
    //   return { location: {}, address: "" }; // Return early with empty location if GPS is off
    // }

    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return { location: {} };
    }

    // Fetch the current location
    let currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
    });
    let tempLocation = {
      latitude: currentLocation?.coords?.latitude,
      longitude: currentLocation?.coords?.longitude,
      latitudeDelta: 2,
      longitudeDelta: 2,
    };

    // Reverse geocode to get the address
    let response = await Location.reverseGeocodeAsync({
      latitude: tempLocation?.latitude,
      longitude: tempLocation?.longitude,
    });

    console.log("response--", response);

    return {
      location: tempLocation,
      address: response[0]?.formattedAddress || "",
      addressObject: response[0],
    };
  } catch (err) {
    // Handle any errors during location fetching
    TOAST?.error(
      `Error while fetching current location ${JSON?.stringify(err)}`
    );
    console.log("Error while fetching location:", err);

    return { location: {} };
  }
};

export const handleQueryKey = (type: any) => {
  if (type === "saved") return "favouriteWorkers";
  else if (type === "booked") return "bookedWorkers";
  else return "workers";
};

export const handleQueryFunction = async (
  type: any,
  pageParam: number,
  category: any,
  searchCategory: any
) => {
  console.log("searchCategory--", searchCategory);

  try {
    let data = {};
    if (type === "saved")
      data = await USER?.fetchAllLikedUsers({
        pageParam,
        skill: category,
      });
    else if (type === "booked")
      data = await EMPLOYER?.fetchAllBookedWorkers({
        pageParam,
        skill: category,
      });
    else
      data = await USER?.fetchAllUsers({
        pageParam,
        name: searchCategory?.name,
        skill: searchCategory?.skill,
      });
    return data;
  } catch (err) {
    console.log("error while fetching users ", err);
  }
};

export const capitalizeWord = (word: string) => {
  if (!word || typeof word !== "string") {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const toLowerCase = (text: string) => {
  if (typeof text !== "string") {
    return text;
  }
  return text.toLowerCase();
};

export const filterSubCategories = (workTypeValue: string) => {
  // Find the object matching the provided value
  const selectedWorkType = WORKTYPES.find(
    (workType) => workType.value === workTypeValue
  );

  // Return the subTypes if the object is found, otherwise return an empty array
  return selectedWorkType ? selectedWorkType.subTypes : [];
};

export const filterWorkerTypes = (
  workTypeValue: string,
  subTypeValue: string
) => {
  // Find the work type matching the given workTypeValue
  const workType = WORKTYPES.find((type) => type.value === workTypeValue);

  // Find the subType matching the given subTypeValue
  const subType = workType?.subTypes.find(
    (type) => type.value === subTypeValue
  );

  const workers = subType?.workerTypes?.map((worker: any) => {
    return {
      label: getDynamicWorkerType(worker?.label, 1),
      value: worker?.value,
    };
  });

  // Return the workerTypes of the selected subType
  return workers ?? [];
};

export const convertToLabelValueArray = (stringArray: string[]) => {
  return stringArray?.map((str) => ({
    label: str,
    value: str,
  }));
};

export const handleCall = (mobile: string) => {
  Linking.openURL(`tel:${mobile}`);
};

export const handleMessage = (mobile: string) => {
  Linking.openURL(`sms:${mobile}`);
};

export const handleEmail = (email: string) => {
  Linking.openURL(`mailto:${email}`);
};

const FONT_SIZE_MULTIPLIER: any = {
  en: 0.8,
  hi: 0.8,
  mr: 0.8,
  rj: 0.8,
  ta: 0.7,
  gu: 0.8,
  bn: 0.8,
  pa: 0.8,
  te: 0.7,
  kn: 0.7,
  ml: 0.7,
  ks: 0.8,
  ur: 0.8,
};

const BASE_FONT_SIZE = 16; // Base font size in pixels

export const getFontSize = (locale: string, baseSize = BASE_FONT_SIZE) => {
  const multiplier = FONT_SIZE_MULTIPLIER[locale] || 1;
  return baseSize * multiplier;
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import USER from "@/app/api/user";
import { getDynamicWorkerType } from "@/utils/i18n";

export const logoutUser = async (setUserDetails: any, router: any) => {
  await AsyncStorage.removeItem("user"); // Remove from AsyncStorage
  setUserDetails(null); // Update the global user atom
  router.push("/screens/auth/login"); // Redirect to login
};

export const generateServiceSummary = (
  service: any,
  lang: string = "hi",
  userLocation: { latitude: number; longitude: number }
) => {
  const {
    type,
    subType,
    startDate,
    duration,
    facilities,
    requirements = [],
    appliedUsers,
    address,
    location, // Assuming service location has latitude & longitude
  } = service;

  // Convert the start date to a readable format
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const dateValue = startDate?.$date || startDate;
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString(
        lang === "hi" ? "hi-IN" : "en-IN",
        options
      )
    : lang === "hi"
    ? "अमान्य तिथि"
    : "Invalid Date";

  // Facilities translations
  const facilityMap: any = {
    food: lang === "hi" ? "खाने" : "Food",
    living: lang === "hi" ? "रहने" : "Living",
    travelling: lang === "hi" ? "यात्रा" : "Traveling",
    esi_pf: lang === "hi" ? "बीमा और पीएफ" : "ESI & PF",
  };

  const enabledFacilities = Object.keys(facilities || {})
    .filter((key) => facilities[key])
    .map((key) => facilityMap[key])
    .join(", ");

  console.log("enabledFacilities---0", enabledFacilities);
  // Count only applied users with status "PENDING"
  const appliedUsersCount = (appliedUsers || []).filter(
    (user: any) => user.status === "PENDING"
  ).length;

  // Calculate distance from user location to service location
  const distance =
    location && userLocation ? calculateDistance(location, userLocation) : null;

  // Generate requirement details
  let requirementDetails = "";
  if (requirements.length > 0) {
    requirementDetails = requirements
      .map((req: any) =>
        lang === "hi"
          ? `${req.count} ${getDynamicWorkerType(
              req.name,
              req?.count
            )} चाहिए, रोज़ की मजदूरी ₹${req.payPerDay} होगी`
          : `Need ${req.count} ${t(req.name)}, daily wage ₹${req.payPerDay}`
      )
      .join(". ");

    // Add "जरूरत है" at the end in Hindi
    if (lang === "hi") requirementDetails += "।";
  } else {
    requirementDetails =
      lang === "hi"
        ? "कोई खास जरूरत नहीं बताई गई है।"
        : "No specific requirements mentioned.";
  }

  // Generate summary based on language
  if (lang === "en") {
    return `Work for ${t(subType)} is available ${
      distance ? `at ${distance} km` : `at ${address}`
    }. It is under ${t(
      type
    )} category. Work starts on ${formattedDate} and will last for ${duration} days. ${
      enabledFacilities &&
      `Employer will provide ${enabledFacilities} facilities.`
    } ${requirementDetails}. ${appliedUsersCount} ${
      appliedUsersCount > 1 ? "people have" : "person has"
    } applied.`;
  } else {
    return `${t(subType)} की नौकरी उपलब्ध है ${
      distance ? `, दूरी ${distance} किमी` : ` ${address} में`
    }। यह ${t(
      type
    )} श्रेणी के अंतर्गत आता है। काम ${formattedDate} से शुरू होगा और ${duration} दिन तक चलेगा।${
      enabledFacilities ? ` मालिक ${enabledFacilities} की सुविधा देगा।` : ""
    } ${requirementDetails} ${
      appliedUsersCount === 0
        ? "अभी तक किसी ने आवेदन नहीं किया है।"
        : appliedUsersCount === 1
        ? "अभी तक 1 व्यक्ति ने आवेदन किया है।"
        : `अभी तक ${appliedUsersCount} लोगों ने आवेदन किया है।`
    }`;
  }
};

let currentUtteranceId: number | null = null;
let currentSetSpeakingState: ((state: boolean) => void) | null = null;

export const speakText = (
  text: string,
  language: string = "hi",
  setSpeakingState: (state: boolean) => void
) => {
  if (text.trim()) {
    Speech.stop(); // Stop any ongoing speech before starting new speech

    // Reset previous speaking state if a different service was speaking
    if (
      currentSetSpeakingState &&
      currentSetSpeakingState !== setSpeakingState
    ) {
      currentSetSpeakingState(false);
    }

    // Generate a unique ID for this speech request
    const utteranceId = Date.now();
    currentUtteranceId = utteranceId;
    currentSetSpeakingState = setSpeakingState; // Track current speaking state setter

    // Set speaking state to true for the new service
    setSpeakingState(true);

    Speech.speak(text, {
      language,
      pitch: 1,
      rate: 1,
      onDone: () => {
        if (currentUtteranceId === utteranceId) {
          setSpeakingState(false);
        }
      },
      onStopped: () => {
        if (currentUtteranceId === utteranceId) {
          setSpeakingState(false);
        }
      },
    });

    // Listen for app state changes and stop speech if app is backgrounded or closed
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState !== "active") {
          Speech.stop();
          setSpeakingState(false);
        }
      }
    );

    // Cleanup listener when function completes
    return () => {
      appStateListener.remove();
    };
  }
};

// if (lang === "en") {
//   return `A job for ${t(subType)} is available ${
//     distance ? `at a distance of ${distance} km` : ""
//   }. It falls under the ${t(
//     type
//   )} category. The work will start from ${formattedDate} and will last for ${duration} day(s). The employer will provide ${enabledFacilities} facilities. ${requirementDetails}. So far, ${appliedUsersCount} ${
//     appliedUsersCount > 1 ? "people" : "person"
//   } have applied.`;
// } else {
//   return `${t(subType)} की नौकरी उपलब्ध है ${
//     distance ? `दूरी ${distance} किमी पर` : ""
//   }। यह ${t(
//     type
//   )} श्रेणी के अंतर्गत आता है। काम ${formattedDate} से शुरू होगा और ${duration} दिन तक चलेगा। नियोक्ता ${enabledFacilities} सुविधा देगा। ${requirementDetails}। अभी तक ${appliedUsersCount} ${
//     appliedUsersCount > 1 ? "लोगों" : "लोग"
//   } ने आवेदन किया है।`;
// }
