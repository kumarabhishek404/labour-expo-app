import { deleteUserById } from "@/app/api/user";
import { UserAtom } from "@/app/AtomStore/user";
import Loader from "@/components/Loader";
import ModalComponent from "@/components/Modal";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const DeleteAccountScreen = () => {
  const userDetails = useAtomValue(UserAtom);
  const [selectedReason, setSelectedReason] = useState("");
  const [showTextArea, setShowTextArea] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

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
      console.error("error while deleting the user", err);
    },
  });

  const handleReasonSelect = (reason: React.SetStateAction<string>) => {
    setSelectedReason(reason);
    if (reason === "Others") {
      setShowTextArea(true);
    } else {
      setShowTextArea(false);
      setOtherReason("");
    }
  };

  const handleDelete = () => {
    setModalVisible(true);
  };

  //   const confirmDelete = () => {
  //     setModalVisible(false);
  //     // Call the Profile Delete function here
  //     Alert.alert(
  //       "Profile Deleted",
  //       "Your profile has been deleted successfully."
  //     );
  //   };

  const modalContent = () => {
    return (
      // <View style={styles.modalOverlay}>
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
          Ensuring that the user understands the consequences of deleting their
          account (
          <Text style={styles.italicText}>
            loss of data, subscriptions, etc.
          </Text>
          ).
        </Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          // headerTransparent: false,
          headerTitle: "Delete Profile",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
                marginRight: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 10,
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
          If you need to delete an account and you're prompted to provide a
          reason.
        </Text>

        {reasons.map((reason, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionContainer}
            onPress={() => handleReasonSelect(reason)}
          >
            <View style={styles.radioCircle}>
              {selectedReason === reason && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.optionText}>{reason}</Text>
          </TouchableOpacity>
        ))}

        {showTextArea && (
          <TextInput
            style={styles.textArea}
            placeholder="Please specify your reason"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setOtherReason(text)}
            value={otherReason}
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
            action: mutationDeleteService?.mutate,
          }}
          secondaryButton={{
            title: "Keep Account",
            styles: "",
            action: () => setModalVisible(false),
          }}
        />
      </ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <TouchableOpacity
          onPress={handleDelete}
          style={[styles.footerBtn, styles.footerBookBtn]}
        >
          <Text style={styles.footerBtnTxt}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3C3C3C",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3C3C3C",
  },
  optionText: {
    fontSize: 16,
  },
  textArea: {
    borderColor: "#B0B0B0",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    // width: 300,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    borderRadius: 5,
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
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
  },
  footerBtn: {
    flex: 1,
    backgroundColor: Colors.black,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  footerBookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
  },
  footerBtnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});

export default DeleteAccountScreen;
