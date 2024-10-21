import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useState } from "react";

export const useMobileOTP = () => {
//   const [phoneNumber, setPhoneNumber]: any = useState("");
  const [code, setCode] = useState("");
  const [confirm, setConfirm]: any = useState(null);

  const signInWithPhoneNumber = async () => {
    try {
      const confirmation: any = await auth().signInWithPhoneNumber("6397308499");
      setConfirm(confirmation);
    } catch (err) {
      console.log("Error while sending code", err);
    }
  };

  const confirmCode = async () => {
    try {
      const userCreds: any = await confirm?.confirm(code);
      const user = userCreds?.user;

      const userDocument = await firestore()
        .collection("user")
        .doc(user?.uid)
        .get();

      if (userDocument?.exists) {
        // Redirect dashboar
      } else {
        // form
      }
    } catch (err) {
      console.log("Invalid code", err);
    }
  };
};
