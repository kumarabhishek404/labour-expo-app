import AsyncStorage from "@react-native-async-storage/async-storage";
// import NetInfo from "@react-native-community/netinfo";
import USER from "@/app/api/user";

const STORAGE_KEY = "pending_profile_upload";

export const savePendingProfileUpload = async (payload: any) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const uploadPendingProfileImage = async () => {
  console.log("Start Uploading in background - ");
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const { uri, userId } = JSON.parse(data);

  try {
    const formData: any = new FormData();

    formData.append("profileImage", {
      uri,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    formData.append("_id", userId);

    await USER.updateUserById(formData);

    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("✅ Background image upload success");
  } catch (err) {
    console.log("❌ Background upload failed. Will retry later.");
  }
};

// export const initBackgroundUploadListener = () => {
//   NetInfo.addEventListener((state) => {
//     if (state.isConnected) {
//       uploadPendingProfileImage();
//     }
//   });
// };
