import React from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import { Controller, useForm } from "react-hook-form";
import SelfieScreen from "@/components/inputs/Selfie";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";

interface FifthScreenProps {
  setStep: any;
  profilePicture: string;
  setProfilePicture: any;
  handleRegister: any;
}

const FifthScreen: React.FC<FifthScreenProps> = ({
  setStep,
  profilePicture,
  setProfilePicture,
  handleRegister,
}: FifthScreenProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      profilePicture: profilePicture,
    },
  });

  const onSubmit = (data: any) => {
    if (
      !data?.profilePicture ||
      typeof data.profilePicture !== "string" ||
      data.profilePicture.trim() === ""
    ) {
      TOAST?.showToast?.error(t("pleaseSelectAProfilePicture"));
      return;
    }

    setProfilePicture(data.profilePicture);
    handleRegister(data);
  };

  return (
    <View style={styles?.container}>
      <Controller
        control={control}
        name="profilePicture"
        defaultValue=""
        rules={{
          required: t("profilePictureIsRequired"),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <SelfieScreen
            name="profilePicture"
            profilePicture={value}
            setProfilePicture={onChange}
            onBlur={onBlur}
            errors={errors}
          />
        )}
      />
      <View style={styles?.buttonContainer}>
        <Button
          isPrimary={false}
          title={t("back")}
          onPress={() => setStep(3)}
          style={{ width: "30%" }}
        />
        <Button
          isPrimary={true}
          title={t("saveProfilePicture")}
          onPress={handleSubmit(onSubmit)}
          style={{width: "45%"}}
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
    paddingVertical: 0,
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
  conditionsContainer: {},
  conditionText: {
    fontSize: 13,
    marginBottom: 6,
  },
  successText: {
    color: "green",
  },
});

export default FifthScreen;
