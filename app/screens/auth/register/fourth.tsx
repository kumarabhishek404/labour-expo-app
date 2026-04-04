import { ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Loader from "@/components/commons/Loaders/Loader";
import USER from "@/app/api/user";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import { useForm, Controller, useWatch } from "react-hook-form";
import RoleSelection from "@/components/inputs/SelectRole";
import SkillsSelector from "@/components/inputs/SelectSkills";
import { WORKTYPES } from "@/constants";
import ButtonComp from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
const { width } = Dimensions.get("window");

const UpdateUserSkillsScreen = () => {
  // const [previousRole, setPreviousRole] = useState("WORKER");
  // const [loading, setLoading] = useState(false);
  const { userId } = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "WORKER",
      skills: [],
    },
  });
  const roleValue = useWatch({
    control,
    name: "role",
  });

  const skillsValue = useWatch({
    control,
    name: "skills",
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
      TOAST?.success(t("userRoleAddedSuccessfully"));
      router.push({
        pathname: "/screens/auth/register/fifth",
        params: { userId: userId },
      });
    },
    onError: (error) => {
      console.error("Error while adding user details: ", error);
    },
  });
  
  const handleUpdate = async () => {
    if (roleValue !== "EMPLOYER" && !skillsValue.length) {
      TOAST?.error(t("pleaseSelectSkills"));
      return;
    }

    router.push({
      pathname: "/screens/auth/register/fifth",
      params: {
        userId,
        role: roleValue,
        skills: JSON.stringify(skillsValue), // 👈 MUST stringify
      },
    });
    // mutationUpdateProfile.mutate(payload);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {/* <Loader loading={loading} /> */}
      <View style={styles.container}>
        <CustomHeading style={{ marginTop: 20 }} baseFont={26}>
          {t("updateYourSkillsAndRole")}
        </CustomHeading>

        <View style={{ flexDirection: "column", gap: 20 }}>
          <Controller
            control={control}
            name="role"
            rules={{ required: t("selectAtLeastOneSkill") }}
            render={({ field: { onChange, value } }) => (
              <RoleSelection
                role={value}
                setRole={onChange}
                resetSkills={() => setValue("skills", [])} // ⭐ MAGIC LINE
              />
            )}
          />

          {roleValue === "WORKER" && (
            <Controller
              control={control}
              name="skills"
              rules={{
                required: t("selectAtLeastOneSkill"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SkillsSelector
                  isPricePerDayNeeded={true}
                  selectedInterests={value}
                  setSelectedInterests={onChange}
                  availableOptions={WORKTYPES}
                />
              )}
            />
          )}

          {roleValue === "MEDIATOR" && (
            <Controller
              control={control}
              name="skills"
              rules={{
                required: t("selectAtLeastOneSkill"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SkillsSelector
                  isPricePerDayNeeded={false}
                  selectedInterests={value}
                  setSelectedInterests={onChange}
                  availableOptions={WORKTYPES}
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
      </View>
    </>
  );
};

export default UpdateUserSkillsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors?.fourth,
    paddingHorizontal: 20,
    gap: 20,
    // paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 20,
    width: width,
    backgroundColor: "transparent",
  },
});
