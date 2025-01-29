import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import TOAST from "@/app/hooks/toast";
import { Ionicons } from "@expo/vector-icons";
import Stepper from "@/components/commons/Stepper";
import { REGISTERSTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";

interface FourthScreenProps {
  setStep: any;
  password: string;
  setPassword: any;
  confirmPassword: string;
  setConfirmPassword: any;
}

const FourthScreen: React.FC<FourthScreenProps> = ({
  setStep,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: FourthScreenProps) => {
  const [passwordStep, setPasswordStep] = useState<"create" | "confirm">(
    "create"
  );

  const onSubmit = () => {
    if (password === confirmPassword) {
      setPassword(password);
      setConfirmPassword(confirmPassword);
      setStep(4);
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

  const handlePasswordBack = () => {
    if (passwordStep === "create") {
      setStep(2);
    } else {
      setPasswordStep("create");
      setConfirmPassword("");
    }
  };

  return (
    <View style={{ gap: 15 }}>
      <View style={{ marginBottom: 30 }}>
        <Stepper currentStep={3} steps={REGISTERSTEPS} />
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Text style={styles.title}>
          {passwordStep === "create"
            ? "Create a 4-Digit Password"
            : "Confirm Your Password"}
        </Text>
        <View style={styles.passwordContainer}>
          {Array(4)
            .fill()
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
        <Button
          isPrimary={false}
          title={t("back")}
          onPress={handlePasswordBack}
          style={{width: "30%"}}
        />
        <Button
          isPrimary={true}
          title={passwordStep === "create" ? "Next" : "Confirm Your Password"}
          onPress={() =>
            passwordStep === "create" ? handleSetPassword() : onSubmit()
          }
          style={{width: "50%", paddingHorizontal: 6}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    marginTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },

  label: {
    marginVertical: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  buttonText: {
    color: Colors?.white,
    fontWeight: "700",
    textAlign: "center",
    fontSize: 18,
  },

  forgotPasswordText: {
    textAlign: "right",
    color: Colors.primary,
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  conditionText: {
    fontSize: 13,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "red",
  },
  successText: {
    color: "green",
  },
  title: {
    fontSize: 18,
    color: Colors?.primary,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#3a3a4f",
    marginHorizontal: 10,
  },
  filledDot: {
    backgroundColor: "#5DB075",
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

{
  /* Do not remove this comment */
}

{
  /* <Controller
control={control}
name="password"
defaultValue=""
rules={{
  required: t("passwordIsRequired"),
  pattern: {
    value: /^\d{4}$/,
    message: t("passwordMustBe4Digits"),
  },
}}
render={({ field: { onChange, onBlur, value } }) => (
  <>
    <PasswordComponent
      label={t("password")}
      name="password"
      value={value}
      onBlur={onBlur}
      onChangeText={(text: any) => {
        onChange(text);
        checkPasswordConditions(text);
      }}
      placeholder={t("enterYourPassword")}
      containerStyle={errors?.password && styles.errorInput}
      errors={errors}
      icon={
        <MaterialIcons
          name={"password"}
          size={30}
          color={Colors.secondary}
          style={{ paddingVertical: 10, paddingRight: 10 }}
        />
      }
    />
    <CustomText
      textAlign="left"
      style={[passwordConditions.hasFourDigits && styles?.successText]}
    >
      {passwordConditions.hasFourDigits ? (
        <Entypo name={"check"} size={16} />
      ) : (
        <Entypo name="cross" size={16} />
      )}{" "}
      {t("passwordMustBe4Digits")}
    </CustomText>
    <View style={{ marginBottom: 15 }}>
      <CustomText
        textAlign="left"
        style={[passwordConditions.hasNumber && styles?.successText]}
      >
        {passwordConditions.hasNumber ? (
          <Entypo name={"check"} size={16} />
        ) : (
          <Entypo name="cross" size={16} />
        )}{" "}
        {t("useAtLeastOneNumber")}
      </CustomText>
      <CustomText
        textAlign="left"
        style={[passwordConditions.hasLowerCase && styles?.successText]}
      >
        {passwordConditions.hasLowerCase ? (
          <Entypo name={"check"} size={16} />
        ) : (
          <Entypo name="cross" size={16} />
        )}{" "}
        {t("useAtLeastOneLowerCaseLetter")}
      </CustomText>
      <CustomText
        textAlign="left"
        style={[passwordConditions.hasSymbol && styles?.successText]}
      >
        {passwordConditions.hasSymbol ? (
          <Entypo name={"check"} size={16} />
        ) : (
          <Entypo name="cross" size={16} />
        )}{" "}
        {t("useAtLeastOneSymbol")}
      </CustomText>
      <CustomText
        textAlign="left"
        style={[passwordConditions.isLongEnough && styles?.successText]}
      >
        {passwordConditions.isLongEnough ? (
          <Entypo name={"check"} size={16} />
        ) : (
          <Entypo name="cross" size={16} />
        )}{" "}
        {t("beAtLeast8CharactersLong")}
      </CustomText>
    </View>
  </>
)}
/>

<Controller
control={control}
name="confirmPassword"
defaultValue=""
rules={{
  required: t("pleaseConfirmYourPassword"),
  validate: (value) =>
    value == watch("password") || t("passwordsDoNotMatch"),
}}
render={({ field: { onChange, onBlur, value } }) => (
  <PasswordComponent
    label={t("confirmPassword")}
    name="confirmPassword"
    value={value}
    onBlur={onBlur}
    onChangeText={onChange}
    placeholder={t("enterYourConfirmPassword")}
    containerStyle={errors?.confirmPassword && styles.errorInput}
    errors={errors}
    icon={
      <FontAwesome
        name={"user-secret"}
        size={30}
        color={Colors.secondary}
        style={{ paddingVertical: 10, paddingRight: 10 }}
      />
    }
  />
)}
/> */
}
