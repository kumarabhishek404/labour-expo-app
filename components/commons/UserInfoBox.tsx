import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { useTranslation } from "@/utils/i18n";
import Button from "../inputs/Button";
import Colors from "@/constants/Colors";
import TOAST from "@/app/hooks/toast";
import { useMutation } from "@tanstack/react-query";
import ModalComponent from "./Modal";
import Loader from "./Loaders/Loader";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";
import AUTH from "@/app/api/auth";

interface UserInfoComponentProps {
  user: any;
  style?: any;
}

const UserInfoComponent = ({ user, style }: UserInfoComponentProps) => {
  const { refreshUser, isLoading } = REFRESH_USER.useRefreshUser();
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const mutationSendOtp = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: (payload: any) => AUTH?.sendEmailCode(payload),
    onSuccess: (data: any) => {
      TOAST?.success(t("otpSentTo"), data);
      setModalVisible(true);
    },
    onError: (error: any) => {
      TOAST?.error(t("errorWhileSendingCode"), error?.message);
    },
  });

  const mutationVerifyCode = useMutation({
    mutationKey: ["verifyEmailCode"],
    mutationFn: (payload: any) => AUTH?.verifyEmailCode(payload?.code),
    onSuccess: (data: any) => {
      TOAST?.success(t("emailVerifiedSuccessfully"));
      setModalVisible(false);
      refreshUser();
    },
    onError: (error: any) => {
      TOAST?.error(t("incorrectOTPTryAgain"));
    },
  });
  const [isModalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs: any = useRef([]);
  const { t } = useTranslation();

  const handleSendOtp = async () => {
    try {
      await mutationSendOtp.mutateAsync(user?.email?.value);
      setModalVisible(true);
    } catch (err) {
      TOAST?.error(t("errorWhileSendingCode"));
    }
  };

  const handleVerifyOtp = async () => {
    if (otp?.join("") && otp?.join("")?.length === 4) {
      await mutationVerifyCode.mutateAsync({ code: otp?.join("") });
      setOtp(["", "", "", ""]);
    } else {
      TOAST?.error(t("incorrectOTPTryAgain"));
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

  const modalContent = () => (
    <View style={{ paddingVertical: 20 }}>
      <CustomHeading baseFont={50}>✉️</CustomHeading>
      <CustomHeading>{t("pleaseCheckYourEmail")}</CustomHeading>
      <CustomHeading baseFont={18} color={Colors?.tertiery}>
        ({user?.email?.value})
      </CustomHeading>
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

      <View style={styles?.resendContainer}>
        <CustomText>{t("didntGetTheCode")}</CustomText>
        <TouchableOpacity onPress={handleSendOtp}>
          <CustomText color={Colors?.link}>{t("clickToResend")}</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.userInfoTextWrapper, style]}>
      <Loader
        loading={
          mutationSendOtp.isPending || mutationVerifyCode.isPending || isLoading
        }
      />
      <View>
        <View style={[styles.row, !user?.skills && styles.firstBox]}>
          <CustomHeading textAlign="left" baseFont={14} padding={12}>
            <CustomText>{t("address")}</CustomText>
            {"  "}
            {user?.address || t("addressNotFound")}
          </CustomHeading>
        </View>
        <View style={styles.row}>
          <CustomHeading baseFont={14} padding={12}>
            <CustomText>{t("mobileNumber")}</CustomText>
            {"  "}
            {user?._id === userDetails?._id
              ? user?.mobile || user?.alternateMobile || t("mobileNotFound")
              : "**********"}
          </CustomHeading>
        </View>
        <View style={[styles.row, styles.lastBox]}>
          <CustomHeading
            baseFont={14}
            padding={12}
            style={styles?.verifyEmailBtnWrapper}
          >
            <CustomText>{t("emailAddress")}</CustomText>
            {"  "}
            {user?.email?.value || user?.alternateEmail || t("emailNotFound")}
            {user?._id === userDetails?._id &&
              userDetails?.status === "ACTIVE" &&
              user?.email &&
              !user?.email?.isVerified && (
                <TouchableOpacity onPress={handleSendOtp}>
                  <CustomText
                    color={Colors?.link}
                    style={styles.verifyEmailBtn}
                  >
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
    backgroundColor: Colors?.background,
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
    marginBottom: 0,
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
    // width: "100%",
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
