import { ScrollView, StyleSheet, View, Text, Dimensions } from "react-native";
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
import { MEDIATORTYPES, WORKERTYPES, WORKTYPES } from "@/constants";
import ButtonComp from "@/components/inputs/Button";
import CustomText from "@/components/commons/CustomText";
import CustomHeading from "@/components/commons/CustomHeading";
import { fetchCurrentLocation } from "@/constants/functions";
const { width } = Dimensions.get("window");

const UpdateUserSkillsScreen = () => {
  const [previousRole, setPreviousRole] = useState("WORKER");
  const [loading, setLoading] = useState(false);
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
      TOAST?.success(t("profileUpdated"));
      router.push({
        pathname: "/screens/auth/register/fifth",
        params: { userId: userId },
      });
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      TOAST?.error(error?.message || t("updateFailed"));
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

  const handleUpdate = async () => {
    if (watch("role") !== "EMPLOYER" && !watch("skills").length) {
      TOAST?.error(t("pleaseSelectSkills"));
      return;
    }

    let payload: any = {
      skills: watch("skills"),
    };

    // Fetch the user's current location
    try {
      setLoading(true);
      const locationData = await fetchCurrentLocation();
      payload.location = locationData?.location;
      payload.address = locationData?.address;
      setLoading(false);
    } catch (err) {
      setLoading(false);
      TOAST?.error(t("unableToFetchLocation"));
    }

    mutationUpdateProfile.mutate(payload);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Loader loading={mutationUpdateProfile?.isPending || loading} />
      <View
        style={styles.container}
        // keyboardShouldPersistTaps="handled"
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
                  availableOptions={WORKTYPES}
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
                  availableOptions={WORKTYPES}
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
    paddingTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // ✅ Allows buttons to wrap if needed
    justifyContent: "space-evenly", // ✅ Ensures even spacing
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