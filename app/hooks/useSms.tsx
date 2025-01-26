import * as SMS from "expo-sms";
import TOAST from "./toast";
import { APPLINK } from "@/constants";

const useSMS = async () => {
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    // do your SMS stuff here
    const { result } = await SMS.sendSMSAsync(
      [],
      `Check out this amazing app: ${APPLINK}`,
      {
        attachments: {
          uri: "path/myfile.png",
          mimeType: "image/png",
          filename: "myfile.png",
        },
      }
    );

    if (result === "sent") {
      TOAST?.showToast?.success("Message sent successfully");
    } else {
      TOAST?.showToast?.error("Message failed to send");
    }
  } else {
    // misfortune... there's no SMS available on this device
  }
};

const SMS_HOOK = {
  useSMS,
};

export default SMS_HOOK;
