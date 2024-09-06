import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

// export const setItem = async (key:any, value:any) => {
//   try {
//     await AsyncStorage.setItem(key, JSON.stringify(value));
//   } catch (error) {
//     console.error("Error setting item:", error);
//   }
// };

// export const getItem = async (key:any) => {
//   try {
//     const value = await AsyncStorage.getItem(key);
//     console.log("Value - ", value);
//     return value;
//     // return value != null ? JSON.parse(value) : null;
//   } catch (error) {
//     console.error("Error getting item:", error);
//     return null;
//   }
// };

export const setItem = async (key:string, value: any) => {
  await SecureStore.setItemAsync(key, value);
}

export const getItem = async (key:string) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    alert("🔐 Here's your value 🔐 \n" + result);
  } else {
    alert('No values stored under that key.');
  }
  return result;
}

export const removeItem = async (key:any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const mergeItem = async (key:any, value:any) => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error merging item:", error);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all keys:", error);
    return [];
  }
};

export const getAllItems = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    return items.reduce((accumulator:any, [key, value]:any) => {
      accumulator[key] = JSON.parse(value);
      return accumulator;
    }, {});
  } catch (error) {
    console.error("Error getting all items:", error);
    return {};
  }
};
