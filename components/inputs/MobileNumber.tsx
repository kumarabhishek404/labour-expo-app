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
import auth from "@react-native-firebase/auth";

interface MobileNumberFieldProps {
  name: string;
  countriesPhoneCode: Array<any>;
  countryCode: string;
  setCountryCode: any;
  phoneNumber: string;
  setPhoneNumber: any;
  onBlur: any;
  errors: any;
  placeholder: string;
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
  placeholder,
  icon,
}: MobileNumberFieldProps) => {
  const [isPhoneValid, setPhoneValid] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs: any = useRef([]);

  const validatePhoneNumber = (number: any) => {
    const regex = /[6-9]\d{9}/;
    if (regex.test(number)) {
      setPhoneValid(true);
    } else {
      setPhoneValid(false);
    }
    setPhoneNumber(number);
  };

  const handleSendOtp = async () => {
    try {
      const confirmation: any = await auth().signInWithPhoneNumber(
        "+916397308499"
      );
      // setConfirm(confirmation);
      toast.success("OTP sent to", confirmation);
    } catch (err) {
      console.log("Error while sending code", err);
    }
    // if (isPhoneValid) {
    //   setModalVisible(true);
    //   toast.success("OTP sent to", `${countryCode} ${phoneNumber}`);
    // } else {
    //   Alert.alert("Error", "Please enter a valid phone number.");
    // }
  };

  const handleVerifyOtp = () => {
    if (otp?.join() === "1234") {
      toast?.success("Mobile number verified successfully.");
      setModalVisible(false);
    } else {
      toast?.error("Incorrect OTP. Try again.");
    }
  };

  const handleLabelPress = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown when label is clicked
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

  const handleVerify = () => {
    if (otp.join("") === "1234") {
      toast.success("Success", "Mobile number verified successfully.");
      setModalVisible(false);
    } else {
      toast.error("Error", "Incorrect OTP. Try again.");
    }
  };

  const resendOtp = () => {
    console.log("OTP Resent");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <CustomHeading textAlign="left">Phone Number</CustomHeading>
      <Dropdown
        style={[styles.dropdown, isFocus && styles?.focusStyle]}
        data={countriesPhoneCode}
        selectedTextStyle={styles.selectedTextStyle}
        containerStyle={isFocus && styles?.containerStyle}
        labelField="label"
        valueField="value"
        placeholder="Select country"
        value={countryCode}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => setCountryCode(item.value)}
        showsVerticalScrollIndicator={true}
        renderLeftIcon={() => (
          <CustomHeading textAlign="left" fontSize={14}>
            Country Code
          </CustomHeading>
        )}
      />

      <View style={errors[name] && styles?.errorInput}>
        <TextInputComponent
          value={phoneNumber}
          onBlur={onBlur}
          onChangeText={setPhoneNumber}
          placeholder={placeholder}
          maxLength={10}
          label=""
          name="firstName"
          containerStyle={errors?.firstName && styles.errorInput}
          errors={errors}
          icon={
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {icon && icon}
              <CustomHeading>{countryCode}</CustomHeading>
            </View>
          }
        />
      </View>
      {errors[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}

      {phoneNumber && phoneNumber?.length === 10 && !errors[name] && (
        <TouchableOpacity style={styles.verifyBtn} onPress={handleSendOtp}>
          <CustomHeading color={Colors?.white}>Verify Mobile</CustomHeading>
        </TouchableOpacity>
      )}

      <Modal visible={isPhoneValid} transparent={true} animationType="slide">
        <View style={styles.otpContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CustomHeading fontSize={50}>✉️</CustomHeading>
              <CustomHeading>Please check your email</CustomHeading>
              <CustomText>We&#39;ve sent a code to contact@curfcode.com</CustomText>

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
                <CustomText>Didn&#39;t get the code?</CustomText>
                <CustomText color={Colors?.link}>Click to resend.</CustomText>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <Button
                  isPrimary={false}
                  title="Cancel"
                  onPress={() => setModalVisible(false)}
                />
                <Button
                  isPrimary={true}
                  title="Verify"
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
    flex: 1,
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
    bottom: 23,
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
  },
  modalContainer: {
    // flex: 1,
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
    width: "100%",
  },
});

export default MobileNumberField;
