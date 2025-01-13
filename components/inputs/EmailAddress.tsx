import { toast } from "@/app/hooks/toast";
import Colors from "@/constants/Colors";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import TextInputComponent from "./TextInputWithIcon";
import Button from "./Button";
import { t } from "@/utils/translationHelper";

interface EmailAddressFieldProps {
  name: string;
  email: string;
  setEmail: any;
  onBlur: any;
  errors: any;
  placeholder: string;
  icon?: any;
}

const EmailAddressField = ({
  name,
  email,
  setEmail,
  onBlur,
  errors,
  placeholder,
  icon,
}: EmailAddressFieldProps) => {
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const validateEmailAddress = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setIsEmailValid(true);
      setEmail(email);
    } else {
      setIsEmailValid(false);
    }
  };

  const handleSendOtp = () => {
    if (isEmailValid) {
      setModalVisible(true);
      toast.success(t("otpSentTo"), `${email}`);
    } else {
      toast.error(t("pleaseEnterAValidEmailAddress"));
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("") === "1234") {
      toast.success(t("emailAddressVerifiedSuccessfully"));
      setModalVisible(false);
    } else {
      toast.error(t("incorrectOTPTryAgain"));
    }
  };

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs: any = useRef([]);

  const handleChange = (text: any, index: any) => {
    let newOtp = [...otp];
    newOtp[index] = text;

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    setOtp(newOtp);
  };

  const handleBackspace = (text: any, index: any) => {
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }

    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleVerify = () => {
    if (otp.join("") === "1234") {
      toast.success(t("emailAddressVerifiedSuccessfully"));
      setModalVisible(false);
    } else {
      toast.error(t("incorrectOTPTryAgain"));
    }
  };

  const resendOtp = () => {
    toast.success(t("otpResent"));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <TextInputComponent
          value={email}
          onBlur={onBlur}
          onChangeText={setEmail}
          placeholder={placeholder}
          label={t("emailAddress")}
          name={name}
          containerStyle={errors[name] && styles.errorInput}
          errors={errors}
          icon={icon && icon}
        />
      </View>

      {/* {!errors[name] && (
        <Button
          isPrimary={true}
          title={t("verifyEmailAddress")}
          onPress={handleSendOtp}
        />
      )} */}
      <Modal visible={isEmailValid} transparent={true} animationType="slide">
        <View style={styles.otpContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CustomHeading fontSize={50}>✉️</CustomHeading>
              <CustomHeading>{t("pleaseCheckYourEmail")}</CustomHeading>
              <CustomText>{t("weVeSentACodeTo")}</CustomText>

              <View style={styles.otpform}>
                {otp?.map((digit: string | undefined, index: any) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      return nativeEvent.key === "Backspace"
                        ? handleBackspace("", index)
                        : null;
                    }}
                    value={digit}
                    ref={(input) => (inputs.current[index] = input)} // Reference each input
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles?.resendContainer}
                onPress={resendOtp}
              >
                <CustomText>{t("didntGetTheCode")}</CustomText>
                <CustomText color={Colors?.link}>
                  {t("clickToResend")}
                </CustomText>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <Button
                  isPrimary={false}
                  title={t("cancel")}
                  onPress={() => setModalVisible(false)}
                />
                <Button
                  isPrimary={true}
                  title={t("verify")}
                  onPress={handleVerify}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    gap: 10,
  },
  countryCodeLabel: {
    width: "30%",
    fontWeight: "700",
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  emailAddress: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    gap: 5,
  },
  icon: {
    fontSize: 60,
    color: "#4CAF50",
    marginBottom: 10,
  },

  otpContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  otpform: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderColor: Colors?.primary,
    borderWidth: 2,
    textAlign: "center",
    fontSize: 24,
  },
  resendContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
    gap: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default EmailAddressField;
