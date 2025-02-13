import USER from "@/app/api/user";
import Loader from "@/components/commons/Loaders/Loader";
import ModalComponent from "@/components/commons/Modal";
import Colors from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form"; // react-hook-form imports
import Button from "@/components/inputs/Button";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import CustomText from "@/components/commons/CustomText";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";

const DeleteAccountScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // useForm setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const selectedReasons: any = watch("selectedReasons"); // Watch for changes in selected reasons

  const reasons = [
    "No longer using the service/platform",
    "Found a better alternative",
    "Privacy concerns",
    "Too many emails/notifications",
    "Difficulty navigating the platform",
    "Account security concerns",
    "Personal reasons",
    "Others",
  ];

  const mutationDeleteService = useMutation({
    mutationKey: ["deleteProfile"],
    mutationFn: () => USER?.disableAccount(),
    onSuccess: (response) => {
      console.log("Response while deleting the user - ", response);
    },
    onError: (err) => {
      console.error("Error while deleting the user", err);
    },
  });

  const handleDelete = () => {
    mutationDeleteService.mutate();
  };

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
    setModalVisible(true);
  };

  const handleReasonSelect = (reason: string) => {
    const currentSelection: any = selectedReasons || [];
    if (currentSelection.includes(reason)) {
      setValue(
        "selectedReasons",
        currentSelection.filter((item: string) => item !== reason)
      );
    } else {
      setValue("selectedReasons", [...currentSelection, reason]);
    }
  };

  const modalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading baseFont={30}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading baseFont={20}>Are you sure?</CustomHeading>
        <CustomText baseFont={14}>
          You want to delete your account permanently. This action is
          irreversible and will lead to a loss of all your data.
        </CustomText>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader title="Delete Profile" left="back" />,
        }}
      />
      <Loader loading={mutationDeleteService?.isPending} />
      <ScrollView style={styles.container}>
        <CustomHeading textAlign="left">
          Please select the reason(s) for deleting your account.
        </CustomHeading>

        <Controller
          name="selectedReasons"
          control={control}
          rules={{
            validate: (value) =>
              value?.length > 0 || "At least one reason must be selected",
          }}
          render={({ field }) => (
            <>
              {reasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionContainer}
                  onPress={() => handleReasonSelect(reason)}
                >
                  <View style={styles.radioCircle}>
                    {selectedReasons?.includes(reason) && (
                      <View style={styles.selectedRb} />
                    )}
                  </View>
                  <CustomText baseFont={14}>{reason}</CustomText>
                </TouchableOpacity>
              ))}
              {errors?.selectedReasons && (
                <CustomText
                  textAlign="left"
                  baseFont={10}
                  color={Colors?.danger}
                >
                  {errors.selectedReasons.message}
                </CustomText>
              )}
            </>
          )}
        />

        {selectedReasons?.includes("Others") && (
          <Controller
            name="otherReason"
            control={control}
            rules={{ required: "Please write your reason." }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextAreaInputComponent
                label="Write the reason for deleting this account"
                name="otherReason"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="We'd love to give you the full experience :)"
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
        )}

        <ModalComponent
          title="Delete Account"
          visible={modalVisible}
          content={modalContent}
          onClose={() => setModalVisible(false)}
          primaryButton={{
            title: "Delete",
            styles: {
              backgroundColor: "red",
              borderColor: "red",
            },
            action: handleDelete,
          }}
          secondaryButton={{
            title: "Keep Account",
            styles: "",
            action: () => setModalVisible(false),
          }}
        />
        <View style={styles.footer}>
          <Button
            isPrimary={true}
            title="Delete Account"
            onPress={handleSubmit(onSubmit)}
            style={{
              width: "100%",
              paddingVertical: 10,
              backgroundColor: Colors?.danger,
              borderColor: Colors?.danger,
            }}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#3C3C3C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: "#3C3C3C",
  },
  footer: {
    flexDirection: "row",
    paddingTop: 30,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#FFD700", // Yellow circle
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DeleteAccountScreen;
