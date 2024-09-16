import Toast from "react-native-toast-message";

export const showToast = (
  type: string,
  message: string,
  description?: string
) => {
  console.log("Typs---", type, message);

  switch (type) {
    case "success":
      return Toast.show({
        type: "success",
        text1: message || "",
        text2: description,
      });

    case "error":
      return Toast.show({
        type: "error",
        text1: message || "",
        text2: description,
      });

    case "info":
      return Toast.show({
        type: "info",
        text1: message || "",
        text2: description,
      });

    default:
      break;
  }
};
