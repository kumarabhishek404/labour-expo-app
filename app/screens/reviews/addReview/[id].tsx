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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import RATING from "@/app/api/rating";
import Loader from "@/components/commons/Loaders/Loader";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

const AddReview = () => {
  const { id, type, data }: any = useLocalSearchParams();
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: data ? JSON.parse(data)?.rating : 0,
      feedbackType: data ? JSON.parse(data)?.ratingType : "",
      comment: data ? JSON.parse(data)?.comment : "",
    },
  });

  const mutationAddReview = useMutation({
    mutationKey: ["addReview", { id }],
    mutationFn: (reviewData: any) =>
      RATING?.addReview({
        id,
        data: {
          rating: reviewData.rating,
          comment: reviewData?.comment,
          reviewedUserRole: userDetails?.role,
          ratingType: reviewData?.feedbackType,
        },
      }),
    onSuccess: (response) => {
      TOAST?.showToast?.success(t("reviewAddedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({
        queryKey: ["userDetails", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["tops"],
      });
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
      RATING?.editReview({
        id: JSON.parse(data)?.reviewee,
        data: {
          rating: reviewData.rating,
          comment: reviewData?.comment,
          reviewedUserRole: userDetails?.role,
          ratingType: reviewData?.feedbackType,
        },
      }),
    onSuccess: (response) => {
      TOAST?.showToast?.success(t("reviewEditedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({
        queryKey: ["userDetails", JSON.parse(data)?.reviewee],
      });
      queryClient.invalidateQueries({
        queryKey: ["tops"],
      });
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
          header: () => (
            <CustomHeader
              title={type === "add" ? t("addReview") : t("editReview")}
              left="back"
            />
          ),
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
            max: { value: 5, message: t("ratingIsRequired") },
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
                  <TouchableOpacity
                    key={num}
                    onPress={() => onChange(num)}
                    style={{ marginHorizontal: 2 }}
                  >
                    <FontAwesome
                      name={num <= value ? "star" : "star-o"}
                      size={45}
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
          <CustomText textAlign="left" baseFont={10} color={Colors?.danger}>
            {errors.feedbackType.message}
          </CustomText>
        )}

        <Controller
          control={control}
          name="comment"
          rules={{
            required: t("feedbackIsRequired"),
            minLength: {
              value: 10,
              message: t("feedbackShouldBeAtLeast10Characters"),
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label={t("whatWouldYouLike")}
              name="comment"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("weWouldLoveToGiveYou")}
              containerStyle={errors?.comment && styles.errorInput}
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
          title={type === "add" ? t("addReview") : t("editReview")}
          onPress={handleSubmit((reviewData) =>
            type === "add"
              ? mutationAddReview.mutate(reviewData)
              : mutationEditReview.mutate(reviewData)
          )}
          style={{ marginVertical: 20 }}
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
    paddingHorizontal: 20,
  },
  starContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginVertical: 30,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
  },
});
