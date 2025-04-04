import { useState } from "react";
import { Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

const useBiometricAuth = () => {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  // Check if device supports biometrics
  const checkBiometricSupport = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricAvailable(hasHardware && isEnrolled);
    return hasHardware && isEnrolled;
  };

  // Perform biometric authentication
  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const supported = await checkBiometricSupport();

      if (!supported) {
        Alert.alert(
          "Biometric Authentication",
          "Your device does not support Face ID/Fingerprint."
        );
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to log in",
        fallbackLabel: "Use PIN",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return true;
      } else {
        Alert.alert("Authentication Failed", "Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Biometric Authentication Error:", error);
      return false;
    }
  };

  return { authenticateWithBiometrics, isBiometricAvailable };
};

export default useBiometricAuth;
