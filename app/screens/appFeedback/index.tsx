import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import Button from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import TOAST from "@/app/hooks/toast";
import Loader from "@/components/commons/Loaders/Loader";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import * as DeviceInfo from "expo-device";
import { Platform } from "react-native";
import ReasoneSelection from "../allFeedback/reasons";
import ErrorText from "@/components/commons/ErrorText";
const FeedbackForm = () => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      feedbackType: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const info = {
        brand: DeviceInfo.brand,
        designName: DeviceInfo.designName,
        deviceName: DeviceInfo.deviceName,
        deviceType: DeviceInfo.deviceType,
        manufacturer: DeviceInfo.manufacturer,
        modelId: DeviceInfo.modelId,
        modelName: DeviceInfo.modelName,
        osName: DeviceInfo.osName,
        osVersion: DeviceInfo.osVersion,
        deviceYearClass: DeviceInfo.deviceYearClass,
      };
      setDeviceInfo(info);
    };

    fetchDeviceInfo();
  }, []);

  const mutateAddAppFeedback = useMutation({
    mutationKey: ["addAppFeedback"],
    mutationFn: (data: any) => USER?.addAppFeedback(data),
    onSuccess: () => {
      router.back();
      TOAST?.success("Feedback submitted successfully");
    },
    onError: (error: any) => {
      TOAST?.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);
    try {
      // Call the mutation function with the payload
      await mutateAddAppFeedback.mutate({
        ...data,
        deviceInfo: deviceInfo ?? {},
      });
      console.log("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title="allFeedback"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <Loader loading={mutateAddAppFeedback.isPending} />
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.feedbackContainer}>
            <CustomHeading textAlign="left" color={Colors?.inputLabel}>
              {t("howIsYourFirstImpressionOfTheProduct")}
            </CustomHeading>
            {userDetails?.isAdmin && (
              <Button
                isPrimary={false}
                title={t("allFeedbacks")}
                onPress={() => {}}
                style={styles.allFeedbacksButton}
                textStyle={{ fontSize: 11 }}
              />
            )}
          </View>

          <Controller
            control={control}
            name="rating"
            rules={{
              required: t("ratingIsRequired"),
              min: { value: 1, message: t("ratingIsRequired") },
            }}
            render={({ field: { value, onChange } }) => (
              <View style={styles.starContainer}>
                <View style={styles.starsWrapper}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <TouchableOpacity
                      key={num}
                      onPress={() => onChange(num)}
                      style={styles.starButton}
                    >
                      <FontAwesome
                        name={num <= value ? "star" : "star-o"}
                        size={35}
                        color={num <= value ? Colors?.primary : "#b3b3b3"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {errors?.rating && (
                  <CustomText
                    textAlign="left"
                    baseFont={10}
                    color={Colors?.danger}
                    style={styles.errorText}
                  >
                    {errors.rating.message}
                  </CustomText>
                )}
              </View>
            )}
          />

          <CustomHeading textAlign="left" color={Colors?.inputLabel}>
            {t("whatDidYouLikeTheMost")}
          </CustomHeading>

          <Controller
            control={control}
            name="feedbackType"
            rules={{ required: t("feedbackTypeIsRequired") }}
            render={({ field: { onChange, value, onBlur } }) => (
              <ReasoneSelection
                selectedReason={value}
                setSelectedReason={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors?.feedbackType && (
            <ErrorText>{errors.feedbackType.message}</ErrorText>
          )}

          <Controller
            control={control}
            name="description"
            rules={{
              required: t("feedbackIsRequired"),
              minLength: {
                value: 10,
                message: t("feedbackMustBeAtLeast10Characters"),
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextAreaInputComponent
                label="whatWouldYouLikeToExploreNext"
                name="description"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("weDLoveToGiveYouTheFullExperience")}
                errors={errors}
                icon={
                  <MaterialIcons
                    name={"feedback"}
                    size={30}
                    color={Colors.secondary}
                    style={{ paddingVertical: 10, paddingRight: 10 }}
                  />
                }
              />
            )}
          />
        </View>

        <Button
          isPrimary={true}
          title={t("sendFeedback")}
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />
      </ScrollView>
    </>
  );
};

export default FeedbackForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.fourth,
  },
  feedbackContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  allFeedbacksButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  formContainer: {
    padding: 20,
    gap: 10,
  },
  starContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  starsWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  starButton: {
    padding: 8,
  },
  errorText: {
    marginTop: 0,
  },
  submitButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
