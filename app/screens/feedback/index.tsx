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

const FeedbackForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 0,
      feedbackType: "",
      feedback: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Feedback" left="back" />,
        }}
      />
      <ScrollView style={styles.container}>
        <CustomHeading textAlign="left">
          How is your first impression of the product?
        </CustomHeading>

        <Controller
          control={control}
          name="rating"
          rules={{
            required: "Rating is required",
            min: { value: 1, message: "Rating is required" },
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

        <CustomHeading textAlign="left">
          What did you like the most?
        </CustomHeading>

        <Controller
          control={control}
          name="feedbackType"
          rules={{ required: false }}
          render={({ field: { onChange, value, onBlur } }) => (
            <ReasoneSelection role={value} setRole={onChange} onBlur={onBlur} />
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
          rules={{
            required: "Feedback is required",
            minLength: {
              value: 10,
              message: "Feedback must be at least 10 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextAreaInputComponent
              label="What would you like to explore next?"
              name="feedback"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="We'd love to give you the full experience :)"
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
          title="Send Feedback"
          onPress={handleSubmit(onSubmit)}
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
