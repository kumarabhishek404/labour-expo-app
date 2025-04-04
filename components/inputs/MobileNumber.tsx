import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import TextInputComponent from "./TextInputWithIcon";

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
  isMobileNumberNotExist?: boolean | null;
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
  isMobileNumberNotExist,
  placeholder,
  loading,
  icon,
}: MobileNumberFieldProps) => {
  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
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
          isMobileNumberNotExist={isMobileNumberNotExist}
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
              {/* <CustomHeading baseFont={18}>{countryCode}</CustomHeading> */}
            </View>
          }
        />
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
