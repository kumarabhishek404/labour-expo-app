import { ScrollView, StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { Controller, useForm } from "react-hook-form";
import RoleSelection from "@/components/inputs/SelectRole";
import SkillsSelector from "@/components/inputs/SelectSkills";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import ButtonComp from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";

const UpdateUserSkillsScreen = () => {
  const [previousRole, setPreviousRole] = useState("WORKER");
  const { userId } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "WORKER",
      skills: [],
    },
  });

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
        pathname: "/screens/auth/register/fourth",
        params: { userId: userId },
      });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      TOAST?.showToast?.error(error?.message || t("updateFailed"));
    },
  });

  React.useEffect(() => {
    if (previousRole !== watch("role")) {
      setValue("skills", []);
    } else {
      setValue("skills", [...watch("skills")]);
    }
    setPreviousRole(watch("role"));
  }, [watch("role")]);

  const handleUpdate = () => {
    if (watch("role") !== "EMPLOYER" && !watch("skills").length) {
      TOAST?.showToast?.error(t("pleaseSelectSkills"));
      return;
    }

    const payload = {
      skills: watch("skills"),
    };
    console.log("Paylaod---", payload);

    mutationUpdateProfile.mutate(payload);
  };

  console.log("selectedInterests32423424--", watch("skills"));

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationUpdateProfile?.isPending} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <CustomHeading baseFont={26}>
          {t("updateYourSkillsAndRole")}
        </CustomHeading>

        <View style={{ flexDirection: "column", gap: 20 }}>
          <Controller
            control={control}
            name="role"
            rules={{
              required: t("selectAtLeastOneSkill"),
            }}
            render={({ field: { onChange, value } }) => (
              <RoleSelection role={value} setRole={onChange} />
            )}
          />

          {watch("role") === "WORKER" && (
            <Controller
              control={control}
              name="skills"
              rules={{
                required: t("selectAtLeastOneSkill"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SkillsSelector
                  name="skills"
                  isPricePerDayNeeded={true}
                  selectedInterests={value}
                  setSelectedInterests={onChange}
                  availableOptions={WORKERTYPES}
                  onBlur={onBlur}
                  errors={errors}
                />
              )}
            />
          )}

          {watch("role") === "MEDIATOR" && (
            <Controller
              control={control}
              name="skills"
              rules={{
                required: t("selectAtLeastOneSkill"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SkillsSelector
                  name="skills"
                  isPricePerDayNeeded={false}
                  selectedInterests={value}
                  setSelectedInterests={onChange}
                  availableOptions={MEDIATORTYPES}
                  onBlur={onBlur}
                  errors={errors}
                />
              )}
            />
          )}
        </View>
        <View style={styles?.buttonContainer}>
          <ButtonComp
            isPrimary={true}
            title={t("back")}
            onPress={() => router?.back()}
            style={{ width: "30%" }}
            bgColor={Colors?.danger}
            borderColor={Colors?.danger}
          />
          <ButtonComp
            isPrimary={true}
            title={t("saveAndNext")}
            onPress={handleSubmit(handleUpdate)}
            style={{ flex: 1 }}
            bgColor={Colors?.success}
            borderColor={Colors?.success}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default UpdateUserSkillsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors?.background,
    paddingHorizontal: 20,
    gap: 20,
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 30,
  },
});
