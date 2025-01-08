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
  KeyboardAvoidingView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import TextInputComponent from "./TextInputWithIcon";
import Button from "./Button";
import { t } from "@/utils/translationHelper";
import { signInWithPhoneNumber, verifyCode } from "@/app/api/firebase";
import ModalComponent from "../commons/Modal";
import { useMutation } from "@tanstack/react-query";
import Loader from "../commons/Loader";
import { checkMobileExistance } from "@/app/api/user";

interface MobileNumberFieldProps {
  name: string;
  countriesPhoneCode?: Array<any>;
  countryCode?: string;
  setCountryCode?: any;
  phoneNumber: string;
  setPhoneNumber: any;
  onBlur: any;
  errors: any;
  isMobileNumberExist?: boolean|null;
  placeholder: string;
  loading: boolean;
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
    mutationFn: (payload: any) => signInWithPhoneNumber(payload),
    onSuccess: (data: any) => {
      toast.success(t("otpSentTo"), data);
      setConfirmation(data);
      setModalVisible(true);
    },
    onError: (error: any) => {
      toast.error(t("errorWhileSendingCode"), error?.message);
    },
  });

  const mutationVerifyCode = useMutation({
    mutationKey: ["verifyCode"],
    mutationFn: (payload: any) =>
      verifyCode(payload?.confirmation, payload?.otp),
    onSuccess: (data: any) => {
      toast.success(t("mobileNumberVerifiedSuccessfully"));
      setModalVisible(false);
    },
    onError: (error: any) => {
      toast.error(t("incorrectOTPTryAgain"));
    },
  });

  // const handleSendOtp = async () => {
  //   try {
  //     mutationSendOtp.mutate(`${countryCode}${phoneNumber}`);
  //   } catch (err) {
  //     toast.error(t("errorWhileSendingCode"));
  //   }
  // };

  // const handleVerifyOtp = async () => {
  //   if (otp?.join("") && confirmation && otp?.join("")?.length === 4) {
  //     mutationVerifyCode.mutate({ confirmation, otp: otp?.join("") });
  //   } else {
  //     toast?.error(t("incorrectOTPTryAgain"));
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
  //   toast.success(t("otpResent"));
  // };

  // const modalContent = () => (
  //   <View>
  //     <CustomHeading fontSize={50}>✉️</CustomHeading>
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
        <CustomHeading textAlign="left">{t("phoneNumber")}</CustomHeading>
        {countriesPhoneCode && countriesPhoneCode?.length > 0 && (
          <Dropdown
            style={[styles.dropdown, isFocus && styles?.focusStyle]}
            data={countriesPhoneCode?.map((item: any) => ({
              label: t(item?.label),
              value: item?.value,
            }))}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={isFocus && styles?.containerStyle}
            labelField="label"
            valueField="value"
            placeholder={t("selectCountry")}
            value={countryCode}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => setCountryCode(item.value)}
            showsVerticalScrollIndicator={true}
            renderLeftIcon={() => (
              <CustomHeading textAlign="left" fontSize={14}>
                {t("countryCode")}
              </CustomHeading>
            )}
          />
        )}

        <View
          style={{
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <CustomHeading
            textAlign="left"
            fontSize={16}
            color={Colors?.secondaryText}
          >
            {t("note")}
            {"  "}
            <CustomText
              textAlign="left"
              fontSize={15}
              color={Colors?.secondaryText}
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
          label=""
          name={name}
          containerStyle={(errors[name] || isMobileNumberExist) && styles.errorInput}
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
              <CustomHeading fontSize={18}>{countryCode}</CustomHeading>
            </View>
          }
        />

        {/* {phoneNumber && phoneNumber?.length === 10 && !errors[name] && (
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
    marginBottom: 15,
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

export default MobileNumberField;
