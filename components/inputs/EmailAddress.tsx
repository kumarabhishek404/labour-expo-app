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
    const emailRegex = /[a-zA-Z0-9._%+-]+(\+1)?@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
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
      toast.success("OTP sent to", `${email}`);
    } else {
      Alert.alert("Error", "Please enter a valid phone address.");
    }
  };

  const handleVerifyOtp = () => {
    if (otp.join("") === "1234") {
      Alert.alert("Success", "Email address verified successfully.");
      setModalVisible(false);
    } else {
      Alert.alert("Error", "Incorrect OTP. Try again.");
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
      toast.success("Success", "Email address verified successfully.");
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
      <View>
        <View style={errors[name] && styles?.errorInput}>
          <TextInputComponent
            value={email}
            onBlur={onBlur}
            onChangeText={setEmail}
            placeholder={placeholder}
            label="Email Address"
            name="firstName"
            containerStyle={errors?.firstName && styles.errorInput}
            errors={errors}
            icon={icon && icon}
          />
        </View>
        {errors[name] && (
          <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
            {errors[name]?.message || ""}
          </CustomText>
        )}
      </View>

      {!errors[name] && (
        <Button
          isPrimary={true}
          title="Verify Email Address"
          onPress={handleSendOtp}
        />
      )}
      <Modal visible={isEmailValid} transparent={true} animationType="slide">
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
