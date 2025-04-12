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
import { useAtomValue, useSetAtom } from "jotai";
import AUTH from "@/app/api/auth";
import AddAddressDrawer from "@/app/screens/location/addAddress";

interface UserInfoComponentProps {
  user: any;
  style?: any;
}

const UserInfoComponent = ({ user, style }: UserInfoComponentProps) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [isAddAddress, setIsAddress] = useState(false);
  const { refreshUser, isLoading } = REFRESH_USER.useRefreshUser();
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const mutationSendOtp = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: (payload: any) => AUTH?.sendEmailCode(payload),
    onSuccess: (data: any) => {
      TOAST?.success(t("otpSentTo"));
      setModalVisible(true);
    },
    onError: (error: any) => {
      TOAST?.error(t("errorWhileSendingCode"));
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
        <View
          style={[
            styles.row,
            !user?.skills && styles.firstBox,
            styles?.addressRow,
          ]}
        >
          <CustomHeading style={{ flex: 1 }} baseFont={14} textAlign="left">
            <CustomText>{t("address")}</CustomText>
            {"  "}
            {user?.address || t("addressNotFound")}{" "}
          </CustomHeading>
          {user?._id === userDetails?._id && (
            <TouchableOpacity
              onPress={() => setIsAddress(true)}
              style={styles?.changeAddress}
            >
              <CustomText color={Colors?.link} fontWeight="600">
                {t("changeAddress")}
              </CustomText>
            </TouchableOpacity>
          )}
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
            style={{ width: "70%" }}
            baseFont={14}
            textAlign="left"
          >
            <CustomText>{t("emailAddress")}</CustomText>
            {"  "}
            {user?.email?.value ||
              user?.alternateEmail ||
              t("emailNotFound")}{" "}
          </CustomHeading>
          {user?._id === userDetails?._id &&
            userDetails?.status === "ACTIVE" &&
            user?.email &&
            !user?.email?.isVerified && (
              <TouchableOpacity onPress={handleSendOtp}>
                <CustomText color={Colors?.link} fontWeight="600">
                  {t("verify")}
                </CustomText>
              </TouchableOpacity>
            )}
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

      <AddAddressDrawer
        type="primary"
        userId={userDetails?._id}
        visible={isAddAddress}
        isMainAddress={true}
        onClose={() => {
          setDrawerState({
            visible: false,
            title: "",
            content: () => null,
            primaryButton: null,
            secondaryButton: null,
          });
          setIsAddress(false);
        }}
      />
    </View>
  );
};

export default UserInfoComponent;

const styles = StyleSheet.create({
  row: {
    marginTop: 5,
    flexDirection: "row",
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
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 12,
  },
  addressHeading: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    gap: 10,
  },
  addressText: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  changeAddress: {
    width: "30%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  lastBox: {
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
    padding: 12,
  },
  verifyEmailBtnWrapper: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    gap: 10,
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
