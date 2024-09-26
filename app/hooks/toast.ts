import Toast from "react-native-toast-message";
import { ToastType } from "react-native-toast-message";

const toastConfig = {
  type: "info" as ToastType,
  text1: "",
  text2: "",
};

export const toast = {
  success: (message: string, description?: string) => {
    Toast.show({
      ...toastConfig,
      type: "success",
      text1: message,
      text2: description,
    });
  },
  error: (message: string, description?: string) => {
    Toast.show({
      ...toastConfig,
      type: "error",
      text1: message,
      text2: description,
    });
  },
  info: (message: string, description?: string) => {
    Toast.show({
      ...toastConfig,
      type: "info",
      text1: message,
      text2: description,
    });
  },
};
