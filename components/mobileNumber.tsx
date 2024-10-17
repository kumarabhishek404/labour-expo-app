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
import { Dropdown } from "react-native-element-dropdown";

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

  const validatePhoneNumber = (number: any) => {
    const regex = /[6-9]\d{9}/;
    if (regex.test(number)) {
      setPhoneValid(true);
    } else {
      setPhoneValid(false);
    }
    setPhoneNumber(number);
  };

  const handleSendOtp = () => {
    if (isPhoneValid) {
      setModalVisible(true);
      toast.success("OTP sent to", `${countryCode} ${phoneNumber}`);
    } else {
      Alert.alert("Error", "Please enter a valid phone number.");
    }
  };

  //   const handleVerifyOtp = () => {
  //     if (otp === "1234") {
  //       Alert.alert("Success", "Mobile number verified successfully.");
  //       setModalVisible(false);
  //     } else {
  //       Alert.alert("Error", "Incorrect OTP. Try again.");
  //     }
  //   };

  const handleLabelPress = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown when label is clicked
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
      <Text style={styles.label}>Phone Number</Text>

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
          <Text style={styles?.countryCodeLabel}>Country Code</Text>
        )}
      />

      <View style={[styles.inputContainer, errors[name] && styles?.errorInput]}>
        {icon && icon}
        <Text style={styles?.countryCodeValue}>{countryCode}</Text>
        <TextInput
          value={phoneNumber}
          onBlur={onBlur}
          onChangeText={setPhoneNumber}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.secondary}
          maxLength={10}
        />
      </View>
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      )}

      {/* {phoneNumber && !errors[name] && (
        <TouchableOpacity style={styles.verifyBtn} onPress={handleSendOtp}>
          <Text style={styles.btnText}>Verify Mobile</Text>
        </TouchableOpacity>
      )} */}

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.otpContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.icon}>✉️</Text>
              <Text style={styles.instruction}>Please check your email</Text>
              <Text style={styles.subText}>
                We've sent a code to contact@curfcode.com
              </Text>

              <View style={styles.otpform}>
                {otp?.map((digit: string | undefined, index: any) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={({ nativeEvent }) => {
                      nativeEvent.key === "Backspace"
                        ? handleBackspace("", index)
                        : null;
                    }}
                    value={digit}
                    ref={(input) => (inputs.current[index] = input)} // Reference each input
                  />
                ))}
              </View>

              <TouchableOpacity onPress={resendOtp}>
                <Text style={styles.resendLink}>
                  Didn't get the code? Click to resend.
                </Text>
              </TouchableOpacity>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={handleVerify}
                >
                  <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>
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
    // padding: 20,
    justifyContent: "center",
    // backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  countryCodeLabel: {
    width: "50%",
    fontWeight: "700",
    fontSize: 14,
    // position: 'absolute',
    // top: 0,
    // left: 0,
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
  mobileNumber: {
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
  countryCodeValue: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    padding: 10,
    flex: 1,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  validInput: {
    borderColor: "#28a745",
  },
  invalidInput: {
    borderColor: "#dc3545",
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
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
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
  },
  icon: {
    fontSize: 60,
    color: "#4CAF50",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flex: 1,
    // padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundColor: "#F5F5F5",
  },
  otpform: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderColor: "#4CAF50",
    borderWidth: 2,
    textAlign: "center",
    fontSize: 24,
  },
  resendLink: {
    fontSize: 14,
    color: "#4CAF50",
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
  },
  verifyButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  cancelText: {
    color: "#555",
    fontSize: 16,
  },
  verifyText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default MobileNumberField;
