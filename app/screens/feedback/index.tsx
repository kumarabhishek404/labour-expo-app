import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import Button from "@/components/inputs/Button";
import ReasoneSelection from "./reasons";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import { addAppFeedback } from "@/app/api/user";
import { toast } from "@/app/hooks/toast";
import Loader from "@/components/commons/Loader";

const FeedbackForm = () => {
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

  const mutateAddAppFeedback = useMutation({
    mutationKey: ["addAppFeedback"],
    mutationFn: (data: any) => addAppFeedback(data),
    onSuccess: () => {
      router.back();
      toast.success("Feedback submitted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
    mutateAddAppFeedback.mutate(data);
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Feedback" left="back" />,
        }}
      />
      <Loader loading={mutateAddAppFeedback.isPending} />
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <CustomHeading textAlign="left" style={styles.sectionHeading}>
            {t("howIsYourFirstImpressionOfTheProduct")}
          </CustomHeading>

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
                    fontSize={10}
                    color={Colors?.danger}
                    style={styles.errorText}
                  >
                    {errors.rating.message}
                  </CustomText>
                )}
              </View>
            )}
          />

          <CustomHeading textAlign="left" style={styles.sectionHeading}>
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
            <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
              {errors.feedbackType.message}
            </CustomText>
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
                label={t("whatWouldYouLikeToExploreNext")}
                name="description"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("weDLoveToGiveYouTheFullExperience")}
                containerStyle={errors?.description && styles.errorInput}
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
    backgroundColor: "#f5f7fa",
  },
  formContainer: {
    padding: 20,
    gap: 10,
  },
  sectionHeading: {},
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
  errorInput: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
  },
  submitButton: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
