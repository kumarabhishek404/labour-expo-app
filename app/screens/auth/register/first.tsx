import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Link } from "expo-router";
import Button from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import Stepper from "@/components/commons/Stepper";
import { COUNTRYPHONECODE, REGISTERSTEPS } from "@/constants";
import { t } from "@/utils/translationHelper";
import MobileNumberField from "@/components/inputs/MobileNumber";
import { Feather } from "@expo/vector-icons";
import ModalComponent from "@/components/commons/Modal";
import { set } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { checkMobileExistance } from "@/app/api/user";

interface FirstScreenProps {
  setStep: any;
  phoneNumber: string;
  setPhoneNumber: any;
  countryCode: string;
  setCountryCode: any;
  name: string;
  setFirstName: any;
}

const FirstScreen: React.FC<FirstScreenProps> = ({
  setStep,
  phoneNumber,
  setPhoneNumber,
  countryCode,
  setCountryCode,
  name,
  setFirstName,
}: FirstScreenProps) => {
  const [isMobileNumberExist, setIsMobileNumberExist] = useState<boolean|null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      name: name,
    },
  });

  const onSubmit = (data: any) => {
    setCountryCode(data?.countryCode);
    setPhoneNumber(data?.phoneNumber);
    setFirstName(data?.name);
    if (!isMobileNumberExist) {
      setModalVisible(true);
    }
  };

  const onConfirmMobilerNumber = () => {
    setModalVisible(false);
    setStep(2);
  };

  const mutationCheckMobileNumber = useMutation({
    mutationKey: ["checkMobileNumber"],
    mutationFn: (payload: any) => checkMobileExistance(payload),
    onSuccess: (response) => {
      console.log("Response while checking the mobile number - ", response);
      if (response?.data?.data?.exists) {
        setIsMobileNumberExist(true);
      } else {
        setIsMobileNumberExist(false);
      }
    },
    onError: (err) => {
      console.error("error while deactivatibg the profile ", err);
    },
  });

  const modalContent = () => (
    <View style={{ padding: 10 }}>
      <CustomText fontSize={18} fontWeight="bold">
        {t("confirmYourMobileNumber")}
      </CustomText>
      <CustomText fontSize={16} color="#555">
        {t("isYourCorrectNumber")}
      </CustomText>
      <CustomText
        fontSize={20}
        fontWeight="bold"
        color={Colors?.primary}
        style={{ letterSpacing: 1 }}
      >
        {watch("countryCode")} {watch("phoneNumber")}
      </CustomText>
    </View>
  );

  return (
    <>
      <View style={{ marginBottom: 20 }}>
        <Stepper currentStep={1} steps={REGISTERSTEPS} />
      </View>

      <View style={{ gap: 10, marginBottom: 15 }}>
        <Controller
          control={control}
          name="phoneNumber"
          defaultValue=""
          rules={{
            required: t("mobileNumberIsRequired"),
            pattern: {
              value: /^(\+91[-\s]?)?[6-9]\d{9}$/,
              message: t("enterAValidMobileNumber"),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <MobileNumberField
              name="phoneNumber"
              countriesPhoneCode={COUNTRYPHONECODE}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={value}
              setPhoneNumber={async (val: any) => {
                const regex = /^(\+91[-\s]?)?[6-9]\d{9}$/;
                if (val.length < 10) {
                  onChange(val);
                  setIsMobileNumberExist(true);
                } else if (val.length === 10 && regex.test(val)) {
                  onChange(val);
                  await mutationCheckMobileNumber.mutate({
                    mobile: val,
                  });
                }
                return;
              }}
              onBlur={onBlur}
              errors={errors}
              isMobileNumberExist={isMobileNumberExist}
              placeholder={t("enterYourMobileNumber")}
              loading={mutationCheckMobileNumber.isPending}
              icon={
                <Feather
                  name={"phone"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{
            required: t("firstNameIsRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              name="name"
              label={t("name")}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("enterYourFirstName")}
              textStyles={{ fontSize: 16 }}
              containerStyle={errors?.name && styles.errorInput}
              errors={errors}
              disabled={isMobileNumberExist}
            />
          )}
        />

      </View>
      <Button
        isPrimary={true}
        title={t("saveAndNext")}
        onPress={handleSubmit(onSubmit)}
        style={styles.submitButton}
      />

      <View style={styles.footerContainer}>
        <CustomText fontSize={14}>{t("alreadyHaveAnAccount")}</CustomText>
        <Link href="/screens/auth/login" asChild>
          <TouchableOpacity>
            <CustomHeading color={Colors?.link}>{t("signIn")}</CustomHeading>
          </TouchableOpacity>
        </Link>
      </View>

      <ModalComponent
        visible={isModalVisible}
        content={modalContent}
        transparent={true}
        animationType="slide"
        title={t("checkYourMobileNumber")}
        onClose={() => setModalVisible(false)}
        primaryButton={{
          title: t("yesProceed"),
          action: onConfirmMobilerNumber,
        }}
        secondaryButton={{
          title: t("noEdit"),
          action: () => setModalVisible(false),
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    borderColor: Colors.primary,
    backgroundColor: "#ffe5cc",
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  submitButton: {
    borderRadius: 30,
    marginTop: 10,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.danger,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FirstScreen;
