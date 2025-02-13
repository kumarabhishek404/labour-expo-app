import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import TOAST from "@/app/hooks/toast";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/utils/translationHelper";
import { router, Stack, useLocalSearchParams } from "expo-router";
import CustomHeading from "@/components/commons/CustomHeading";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Loader from "@/components/commons/Loaders/Loader";
import CustomText from "@/components/commons/CustomText";

const FourthScreen = () => {
  const { userId } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStep, setPasswordStep] = useState<"create" | "confirm">(
    "create"
  );

  const mutationUpdateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) =>
      USER.updateUserById({
        _id: userId,
        ...payload,
      }),
    onSuccess: () => {
      console.log("Profile updated successfully");
      TOAST?.showToast?.success(t("profileUpdated"));
      router.push({
        pathname: "/screens/auth/register/third",
        params: { userId: userId },
      });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
    },
  });

  const onSubmit = () => {
    if (password === confirmPassword) {
      mutationUpdateProfile.mutate({
        password,
      });
    } else {
      TOAST?.showToast?.error("Passwords do not match. Please try again.");
      setConfirmPassword("");
    }
  };

  const handleSetPassword = () => {
    if (password?.length === 4) {
      setPasswordStep("confirm");
    } else {
      TOAST?.showToast?.error("Please enter full password");
    }
  };

  const handleNumberPress = (num: string) => {
    if (passwordStep === "create") {
      if (num === "remove") {
        setPassword(password.slice(0, -1));
      } else if (password.length < 4) {
        setPassword(password + num);
      }
    } else if (passwordStep === "confirm") {
      if (num === "remove") {
        setConfirmPassword(confirmPassword.slice(0, -1));
      } else if (confirmPassword.length < 4) {
        setConfirmPassword(confirmPassword + num);
      }
    }
  };

  const handlePasswordBack = async () => {
    if (passwordStep === "create") {
      router?.back();
    } else {
      setPasswordStep("create");
      setConfirmPassword("");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Loader loading={mutationUpdateProfile?.isPending} />
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 10,
        }}
      >
        <View style={styles.title}>
          <CustomHeading baseFont={30} color={Colors?.heading}>
            {passwordStep === "create"
              ? "Create a 4-Digit Password"
              : "Confirm Your Password"}
          </CustomHeading>
          <CustomText color={Colors?.tertiery} fontWeight="bold">
            (
            {passwordStep === "create"
              ? "please do not forget this password"
              : "please write the password again"}
            )
          </CustomText>
        </View>
        <View style={styles.passwordContainer}>
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  (passwordStep === "create"
                    ? password.length
                    : confirmPassword.length) > index && styles.filledDot,
                ]}
              />
            ))}
        </View>

        <View style={styles.keypad}>
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "remove"].map(
            (num, index) => (
              <TouchableOpacity
                key={index}
                style={styles.key}
                onPress={() => handleNumberPress(num)}
              >
                {num === "remove" ? (
                  <Ionicons name="backspace" size={37} color={Colors.white} />
                ) : (
                  <Text style={styles.keyText}>{num}</Text>
                )}
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      <View style={styles?.buttonContainer}>
        {router?.canGoBack() && (
          <Button
            isPrimary={false}
            title={t("back")}
            onPress={handlePasswordBack}
            style={{ width: "25%" }}
            bgColor={Colors?.error}
          />
        )}
        <Button
          isPrimary={true}
          title={passwordStep === "create" ? "Next" : "Confirm Your Password"}
          onPress={() =>
            passwordStep === "create" ? handleSetPassword() : onSubmit()
          }
          style={{ flex: 1, paddingHorizontal: 5 }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: Colors?.white,
    paddingHorizontal: 20,
    gap: 10,
    width: "100%",
    justifyContent: "center",
  },
  label: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  heading: {
    marginBottom: 20,
  },

  successText: {
    color: "green",
  },
  title: {
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
  },
  passwordContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#3a3a4f",
    marginHorizontal: 10,
  },
  filledDot: {
    backgroundColor: Colors?.tertieryButton,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "95%",
    height: "auto",
    marginBottom: 20,
    padding: 0,
  },
  key: {
    width: "30%",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: Colors?.black,
    borderRadius: 8,
  },
  keyText: {
    fontSize: 37,
    color: "white",
  },
});

export default FourthScreen;
