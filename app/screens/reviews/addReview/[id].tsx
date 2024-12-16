import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import Button from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import ReasoneSelection from "./reasons";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import { selectFromApplicant } from "@/app/api/services";
import { toast } from "@/app/hooks/toast";
import { addReview, deleteReview, editReview } from "@/app/api/rating";
import Loader from "@/components/commons/Loader";

const AddReview = () => {
  const { id, type, data }: any = useLocalSearchParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: JSON.parse(data)?.rating || 0,
      feedbackType: JSON.parse(data)?.comment || "",
      feedback: JSON.parse(data)?.feedback || "",
    },
  });

  console.log("Data -- ", data);

  const mutationAddReview = useMutation({
    mutationKey: ["addReview", { id }],
    mutationFn: (data: any) =>
      addReview({
        id,
        data: {
          score: data.rating,
          comment: data.feedbackType,
        },
      }),
    onSuccess: (response) => {
      toast.success(t("reviewAddedSuccessfully"));
      router.back();
      console.log("Response while adding review - ", response);
    },
    onError: (err) => {
      console.error("error while adding review ", err);
    },
  });

  const mutationEditReview = useMutation({
    mutationKey: ["editReview", { id }],
    mutationFn: (reviewData: any) =>
      editReview({
        id,
        reviewId: JSON.parse(data)?.id,
        data: {
          score: reviewData.rating,
          comment: reviewData.feedbackType,
        },
      }),
    onSuccess: (response) => {
      toast.success(t("reviewEditedSuccessfully"));
      router.back();
      console.log("Response while editing review - ", response);
    },
    onError: (err) => {
      console.error("error while editing review ", err);
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title={t("addReview")} left="back" />,
        }}
      />
      <ScrollView style={styles.container}>
        <Loader
          loading={mutationAddReview.isPending || mutationEditReview.isPending}
        />
        <CustomHeading textAlign="left">{t("howWouldYouRate")}</CustomHeading>

        <Controller
          control={control}
          name="rating"
          rules={{
            required: t("ratingIsRequired"),
            min: { value: 1, message: t("ratingIsRequired") },
          }}
          render={({ field: { value, onChange } }) => (
            <View style={styles.starContainer}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <TouchableOpacity key={num} onPress={() => onChange(num)}>
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
                >
                  {errors.rating.message}
                </CustomText>
              )}
            </View>
          )}
        />

        <CustomHeading textAlign="left">{t("whatDidYouLike")}</CustomHeading>

        <Controller
          control={control}
          name="feedbackType"
          rules={{ required: false }}
          render={({ field: { onChange, value, onBlur } }) => (
            <ReasoneSelection
              reason={value}
              setReason={onChange}
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
          name="feedback"
          rules={
            {
              // required: t("feedbackIsRequired"),
              // minLength: {
              //   value: 10,
              //   message: t("feedbackIsRequired"),
              // },
            }
          }
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label={t("whatWouldYouLike")}
              name="feedback"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("weWouldLoveToGiveYou")}
              containerStyle={errors?.feedback && styles.errorInput}
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

        <Button
          isPrimary={true}
          title={t("addReview")}
          onPress={handleSubmit((reviewData) =>
            type === "add"
              ? mutationAddReview.mutate(reviewData)
              : mutationEditReview.mutate(reviewData)
          )}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </>
  );
};

export default AddReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  starContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 20,
    marginTop: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
});
