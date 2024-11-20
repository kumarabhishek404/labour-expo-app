import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { toast } from "@/app/hooks/toast";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import PasswordComponent from "@/components/inputs/Password";
import { Controller, useForm } from "react-hook-form";
import CustomText from "@/components/commons/CustomText";
import Stepper from "@/components/commons/Stepper";
import { REGISTERSTEPS } from "@/constants";


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
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: password,
      confirmPassword: confirmPassword,
    },
  });

  const [passwordConditions, setPasswordConditions] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSymbol: false,
    isLongEnough: false,
  });

  const checkPasswordConditions = (password: any) => {
    const conditions = {
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isLongEnough: password.length >= 8,
    };

    setPasswordConditions(conditions);
  };

  const onSubmit = (data: any) => {
    setPassword(data?.password);
    setConfirmPassword(data?.confirmPassword);
    setStep(5);
    // handleRegister();
  };

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={4} steps={REGISTERSTEPS} />
      </View>

      <Controller
        control={control}
        name="password"
        defaultValue=""
        rules={{
          required: false,
          // required: "Password is required",
          // pattern: {
          //   value: /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[a-z\d@$!%*?&]{8,}$/,
          //   message: "You have to full fill all the following conditions",
          // },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <PasswordComponent
              label="Password"
              name="password"
              value={value}
              onBlur={onBlur}
              onChangeText={(text: any) => {
                onChange(text);
                checkPasswordConditions(text);
              }}
              placeholder="Enter your password"
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
                Use at least one number (0-9)
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
                Use at least one lower-case letter (a-z)
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
                Use at least one symbol (e.g., !@#$%^&*)
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
                Be at least 8 characters long
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
          required: false,
          // required: "Please confirm your password",
          // validate: (value) =>
          //   value == watch("password") || "Passwords do not match",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordComponent
            label="Confirm Password"
            name="confirmPassword"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Enter your confirm password"
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
      />

      <View style={styles?.buttonContainer}>
        <Button isPrimary={false} title="Back" onPress={() => setStep(3)} />
        <Button
          isPrimary={true}
          title="Save All Details"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </>
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
    marginVertical: 20,
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
    // fontFamily: fonts.SemiBold,
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
    // fontFamily: fonts.SemiBold,
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
});

export default FourthScreen;
