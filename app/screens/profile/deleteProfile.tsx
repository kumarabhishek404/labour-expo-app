import { deleteUserById } from "@/app/api/user";
import Loader from "@/components/Loader";
import ModalComponent from "@/components/Modal";
import Colors from "@/constants/Colors";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form"; // react-hook-form imports
import Button from "@/components/Button";
import TextAreaInputComponent from "@/components/TextArea";

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
    mutationFn: () => deleteUserById(),
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
            <Text style={styles.iconText}>?</Text>
          </View>
        </View>
        <Text style={styles.modalHeader}>Are you sure?</Text>
        <Text style={styles.modalBody}>
          You want to delete your account permanently.
        </Text>
        <Text style={styles.modalFooter}>
          This action is irreversible and will lead to a loss of all your data.
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Delete Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Loader loading={mutationDeleteService?.isPending} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Delete Account</Text>
        <Text style={styles.subHeader}>
          Please select the reason(s) for deleting your account.
        </Text>

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
                  <Text style={styles.optionText}>{reason}</Text>
                </TouchableOpacity>
              ))}
              {errors.selectedReasons && (
                <Text style={styles.errorText}>
                  {errors.selectedReasons.message}
                </Text>
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
                containerStyle={errors?.otherReason && styles.errorInput}
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#6e6e6e",
    marginBottom: 20,
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
  optionText: {
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    paddingTop: 30,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  errorInput: {
    borderColor: "red",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#FFD700", // Yellow circle
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 30,
    color: "#000",
    fontWeight: "bold",
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  modalFooter: {
    fontSize: 14,
    color: "#6e6e6e",
    textAlign: "center",
    marginBottom: 20,
  },
  italicText: {
    fontStyle: "italic",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonStyle: {
    backgroundColor: "#FF3B30",
  },
  keepButtonStyle: {
    backgroundColor: Colors?.primary,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
  },
  keepText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default DeleteAccountScreen;
