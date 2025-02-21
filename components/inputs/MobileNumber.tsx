import TOAST from "@/app/hooks/toast";
import Colors from "@/constants/Colors";
import React, { useRef, useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import TextInputComponent from "./TextInputWithIcon";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import Loader from "../commons/Loaders/Loader";
import AUTH from "@/app/api/auth";

interface MobileNumberFieldProps {
  name: string;
  countriesPhoneCode?: Array<any>;
  countryCode?: string;
  setCountryCode?: any;
  phoneNumber: string;
  setPhoneNumber: any;
  onBlur?: any;
  errors: any;
  isMobileNumberExist?: boolean | null;
  placeholder: string;
  loading?: boolean;
  icon?: any;
}

const MobileNumberField = ({
  name,
  countriesPhoneCode,
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
  onBlur,
  errors,
  isMobileNumberExist,
  placeholder,
  loading,
  icon,
}: MobileNumberFieldProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs: any = useRef([]);
  const [confirmation, setConfirmation] = useState(null);

  const mutationSendOtp = useMutation({
    mutationKey: ["signInWithPhoneNumber"],
    mutationFn: (payload: any) => AUTH?.sendOTP(payload),
    onSuccess: (data: any) => {
      TOAST?.success(t("otpSentTo"), data);
      setConfirmation(data);
      setModalVisible(true);
    },
    onError: (error: any) => {
      TOAST?.error(t("errorWhileSendingCode"), error?.message);
    },
  });

  const mutationVerifyCode = useMutation({
    mutationKey: ["verifyCode"],
    mutationFn: (payload: any) =>
      AUTH?.verifyOTP(payload?.confirmation, payload?.otp),
    onSuccess: (data: any) => {
      TOAST?.success(t("mobileNumberVerifiedSuccessfully"));
      setModalVisible(false);
    },
    onError: (error: any) => {
      TOAST?.error(t("incorrectOTPTryAgain"));
    },
  });

  // const handleSendOtp = async () => {
  //   try {
  //     mutationSendOtp.mutate(`${countryCode}${phoneNumber}`);
  //   } catch (err) {
  //     TOAST?.error(t("errorWhileSendingCode"));
  //   }
  // };

  // const handleVerifyOtp = async () => {
  //   if (otp?.join("") && confirmation && otp?.join("")?.length === 4) {
  //     mutationVerifyCode.mutate({ confirmation, otp: otp?.join("") });
  //   } else {
  //     TOAST?.error(t("incorrectOTPTryAgain"));
  //   }
  // };

  // const handleChange = (text: any, index: any) => {
  //   let newOtp = [...otp];
  //   newOtp[index] = text;

  //   if (text && index < 3) {
  //     inputs.current[index + 1].focus();
  //   }

  //   setOtp(newOtp);
  // };

  // const handleBackspace = (text: any, index: any) => {
  //   if (!text && index > 0) {
  //     inputs.current[index - 1].focus();
  //   }

  //   let newOtp = [...otp];
  //   newOtp[index] = text;
  //   setOtp(newOtp);
  // };

  // const resendOtp = () => {
  //   handleSendOtp();
  //   TOAST?.success(t("otpResent"));
  // };

  // const modalContent = () => (
  //   <View>
  //     <CustomHeading baseFont={50}>✉️</CustomHeading>
  //     <CustomHeading>{t("pleaseCheckYourEmail")}</CustomHeading>
  //     <CustomText>{t("weVeSentACodeTo")}</CustomText>

  //     <View style={styles.otpform}>
  //       {otp?.map((digit: string | undefined, index: any) => (
  //         <TextInput
  //           key={index}
  //           style={styles.otpInput}
  //           keyboardType="numeric"
  //           maxLength={1}
  //           onChangeText={(text) => handleChange(text, index)}
  //           onKeyPress={({ nativeEvent }) => {
  //             return nativeEvent.key === "Backspace"
  //               ? handleBackspace("", index)
  //               : null;
  //           }}
  //           value={digit}
  //           ref={(input) => (inputs.current[index] = input)}
  //         />
  //       ))}
  //     </View>

  //     <TouchableOpacity style={styles?.resendContainer} onPress={resendOtp}>
  //       <CustomText>{t("didntGetTheCode")}</CustomText>
  //       <CustomText color={Colors?.link}>{t("clickToResend")}</CustomText>
  //     </TouchableOpacity>
  //   </View>
  // );

  return (
    <>
      <Loader
        loading={mutationSendOtp.isPending || mutationVerifyCode.isPending}
      />
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <CustomHeading
            textAlign="left"
            baseFont={16}
            color={Colors?.tertieryButton}
          >
            {t("note")}
            {"  "}
            <CustomText
              textAlign="left"
              baseFont={15}
              color={Colors?.tertieryButton}
            >
              {t("enterActiveNumber")}
            </CustomText>
          </CustomHeading>
        </View>

        <TextInputComponent
          value={phoneNumber}
          onBlur={onBlur}
          type="number"
          onChangeText={setPhoneNumber}
          placeholder={placeholder}
          maxLength={10}
          label="phoneNumber"
          name={name}
          isMobileNumberExist={isMobileNumberExist}
          errors={errors}
          loading={loading}
          style={{ fontSize: 18 }}
          textStyles={{ fontSize: 18 }}
          icon={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: countryCode ? 10 : 0,
              }}
            >
              {icon && icon}
              <CustomHeading baseFont={18}>{countryCode}</CustomHeading>
            </View>
          }
        />

        {/* {phoneNumber && phoneNumber?.length === 10 && !errors?.[name] && (
          <TouchableOpacity style={styles.verifyBtn} onPress={handleSendOtp}>
            <CustomHeading color={Colors?.white}>{t("verify")}</CustomHeading>
          </TouchableOpacity>
        )} */}

        {/* <ModalComponent
          visible={isModalVisible}
          content={modalContent}
          transparent={true}
          animationType="slide"
          title={t("verifyMobile")}
          onClose={() => setModalVisible(false)}
          primaryButton={{
            title: t("verify"),
            action: handleVerifyOtp,
          }}
          secondaryButton={{
            title: t("cancel"),
            action: () => setModalVisible(false),
          }}
        /> */}
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  countryCodeLabel: {
    width: "50%",
    fontWeight: "700",
    fontSize: 14,
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
    borderRadius: 8,
    padding: 14,
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    textAlign: "right",
  },
  focusStyle: {
    borderColor: Colors?.primary,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
  selectedTextStyle: {
    textAlign: "right",
    marginRight: 10,
  },
  verifyBtn: {
    position: "absolute",
    right: 7,
    bottom: 10,
    backgroundColor: Colors?.primary,
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
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
    marginTop: 20,
    gap: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

export default MobileNumberField;
