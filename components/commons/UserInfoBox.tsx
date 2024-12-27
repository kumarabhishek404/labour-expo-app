import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { useTranslation } from "@/utils/i18n";
import Button from "../inputs/Button";
import Colors from "@/constants/Colors";
import { toast } from "@/app/hooks/toast";
import { useMutation } from "@tanstack/react-query";
import { verifyEmail, verifyEmailCode } from "@/app/api/firebase";
import ModalComponent from "./Modal";

interface UserInfoComponentProps {
  user: any;
  style?: any;
}

const UserInfoComponent = ({ user, style }: UserInfoComponentProps) => {
  const mutationSendOtp = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: (payload: any) => verifyEmail(payload),
    onSuccess: (data: any) => {
      toast.success(t("otpSentTo"), data);
      // setConfirmation(data);
      setModalVisible(true);
    },
    onError: (error: any) => {
      toast.error(t("errorWhileSendingCode"), error?.message);
    },
  });

  const mutationVerifyCode = useMutation({
    mutationKey: ["verifyEmailCode"],
    mutationFn: (payload: any) =>
      verifyEmailCode(payload?.confirmation, payload?.otp),
    onSuccess: (data: any) => {
      toast.success(t("emailVerifiedSuccessfully"));
      setModalVisible(false);
    },
    onError: (error: any) => {
      toast.error(t("incorrectOTPTryAgain"));
    },
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs: any = useRef([]);
  const [confirmation, setConfirmation] = useState(null);
  const { t } = useTranslation();

  const handleSendOtp = async () => {
    try {
      // mutationSendOtp.mutate(user?.email);
      setModalVisible(true);
    } catch (err) {
      toast.error(t("errorWhileSendingCode"));
    }
  };

  const handleVerifyOtp = async () => {
    if (otp?.join("") && confirmation && otp?.join("")?.length === 4) {
      mutationVerifyCode.mutate({ confirmation, otp: otp?.join("") });
    } else {
      toast?.error(t("incorrectOTPTryAgain"));
    }
  };

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

  const resendOtp = () => {
    handleSendOtp();
    toast.success(t("otpResent"));
  };

  const modalContent = () => (
    <View>
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
            ref={(input) => (inputs.current[index] = input)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles?.resendContainer} onPress={resendOtp}>
        <CustomText>{t("didntGetTheCode")}</CustomText>
        <CustomText color={Colors?.link}>{t("clickToResend")}</CustomText>
      </TouchableOpacity>
    </View>
  );

  console.log(user?.email);
  return (
    <View style={[styles.userInfoTextWrapper, style]}>
      <View>
        <View
          style={[styles.row, user?.role === "EMPLOYER" && styles.firstBox]}
        >
          <CustomHeading textAlign="left" fontSize={14} padding={12}>
            <CustomText>{t("address")}</CustomText>
            {"  "}
            {user?.address || t("addressNotFound")}
          </CustomHeading>
        </View>
        <View style={styles.row}>
          <CustomHeading fontSize={14} padding={12}>
            <CustomText>{t("mobileNumber")}</CustomText>
            {"  "}
            {user?.mobile || user?.alternateMobile || t("mobileNotFound")}
          </CustomHeading>
        </View>
        <View style={[styles.row, styles.lastBox]}>
          <CustomHeading
            fontSize={14}
            padding={12}
            style={styles?.verifyEmailBtnWrapper}
          >
            <CustomText>{t("emailAddress")}</CustomText>
            {"  "}
            {user?.email?.value || user?.alternateEmail || t("emailNotFound")}
            {user?.email && !user?.email?.isVerified && (
              <TouchableOpacity onPress={handleSendOtp}>
                <CustomText color={Colors?.link} style={styles.verifyEmailBtn}>
                  , {t("verify")}
                </CustomText>
              </TouchableOpacity>
            )}
          </CustomHeading>
        </View>
      </View>

      <ModalComponent
        visible={isModalVisible}
        content={modalContent}
        transparent={true}
        animationType="slide"
        title={t("verifyEmail")}
        onClose={() => setModalVisible(false)}
        primaryButton={{
          title: t("verify"),
          action: handleVerifyOtp,
        }}
        secondaryButton={{
          title: t("cancel"),
          action: () => setModalVisible(false),
        }}
      />
    </View>
  );
};

export default UserInfoComponent;

const styles = StyleSheet.create({
  row: {
    paddingTop: 0,
    flexDirection: "row",
    marginBottom: 5,
    backgroundColor: "#ddd",
  },
  userInfoTextWrapper: {
    marginBottom: 25,
    marginHorizontal: 20,
  },
  firstBox: {
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  lastBox: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifyEmailBtn: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  verifyEmailBtnWrapper: {
    alignItems: "baseline",
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
  containerStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
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
