import moment from "moment";
import * as Location from "expo-location";
import { toast } from "@/app/hooks/toast";
import {
  fetchAllLikedWorkers,
  fetchAllWorkers,
} from "@/app/api/workers";
import {
  fetchAllBookedMediators,
  fetchAllLikedMediators,
  fetchAllMediators,
} from "@/app/api/mediator";
import { fetchAllEmployers, fetchAllLikedEmployer } from "@/app/api/employer";
import { t } from "@/utils/translationHelper";
import { fetchAllBookedWorkers } from "@/app/api/booking";

export const dateDifference = (date1: Date, date2: Date): string => {
  // Convert both dates to moments and calculate inclusive difference in days
  const startDate = moment(date1);
  const endDate = moment(date2);
  const diffDays = endDate.diff(startDate, "days") + 1; // Adding 1 for inclusive difference

  // If the difference is less than 30 days, return in days
  if (diffDays < 30) {
    return `${diffDays} ${diffDays > 1 ? "Days" : "Day"}`;
  }

  // Calculate the difference in months (inclusive)
  const diffMonths = endDate.diff(startDate, "months", true);

  // If the difference is less than 12 months, return in months
  if (diffMonths < 12) {
    return `${Math.round(diffMonths)} ${
      Math.round(diffMonths) > 1 ? "Months" : "Month"
    }`;
  }

  // Otherwise, calculate the difference in years
  const diffYears = endDate.diff(startDate, "years", true);
  return `${Math.round(diffYears)} ${
    Math.round(diffYears) > 1 ? "Years" : "Year"
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
    return `${months} ${months > 1 ? "months" : "month"} ago`;
  } else if (weeks > 0) {
    return `${weeks} ${weeks > 1 ? "weeks" : "week"} ago`;
  } else if (days > 0) {
    return `${days} ${days > 1 ? "days" : "day"} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
  } else {
    return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
  }
};

export const isEmptyObject = (obj: object) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};

export const removeEmptyStrings = (arr: any) => {
  return arr?.filter((item: any) => item !== "");
};

export const getWorkLabel = (availableSkills: any, skill: string) => {
  let object = availableSkills?.filter((type: any) => type?.value === skill)[0];
  return object?.label && t(object?.label);
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
    const isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
    console.log("isLocationServicesEnabled--", isLocationServicesEnabled);

    // // Prompt user to enable GPS if it's off
    // if (!isLocationServicesEnabled) {
    //   toast?.error("Please enable GPS to get your location.");
    //   return { location: {}, address: "" }; // Return early with empty location if GPS is off
    // }

    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    console.log("status--", status);
    if (status !== "granted") {
      console.log("Location permission not granted");
      return { location: {} };
    }

    // Fetch the current location
    let currentLocation = await Location.getCurrentPositionAsync({});
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

    return {
      location: tempLocation,
      address: response[0]?.formattedAddress,
    };
  } catch (err) {
    // Handle any errors during location fetching
    toast?.error("Error while fetching current location");
    console.log("Error while fetching location:", err);
    return { location: {} };
  }
};

export const handleQueryKey = (role: any, type: any) => {
  if (role === "workers") {
    if (type === "favourite") return "favouriteWorkers";
    else if (type === "booked") return "bookedWorkers";
    else return "workers";
  } else if (role === "mediators") {
    if (type === "favourite") return "favouriteMediators";
    else if (type === "booked") return "bookedMediators";
    else return "mediators";
  } else {
    if (type === "favourite") return "favouriteEmployers";
    else return "employers";
  }
};

export const handleQueryFunction = async (
  role: any,
  type: any,
  pageParam: number,
  category: any
) => {
  try {
    let data = {};
    if (role === "workers") {
      if (type === "favourite")
        data = await fetchAllLikedWorkers({ pageParam, skill: category });
      else if (type === "booked")
        data = await fetchAllBookedWorkers({ pageParam, skill: category });
      else data = await fetchAllWorkers({ pageParam, skill: category });
      return data;
    } else if (role === "mediators") {
      if (type === "favourite")
        data = await fetchAllLikedMediators({ pageParam, skill: category });
      else if (type === "booked")
        data = await fetchAllBookedMediators({ pageParam, skill: category });
      else data = await fetchAllMediators({ pageParam, skill: category });
      return data;
    } else {
      if (type === "favourite")
        data = await fetchAllLikedEmployer({ pageParam, skill: category });
      else data = await fetchAllEmployers({ pageParam, skill: category });
      return data;
    }
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
