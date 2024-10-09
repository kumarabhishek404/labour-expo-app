import { updateUserRoleById } from "@/app/api/user";
import { UserAtom } from "@/app/AtomStore/user";
import Loader from "@/components/Loader";
import Colors from "@/constants/Colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const ChangeRoleScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [selectedRole1, setSelectedRole1] = useState(null);
  const [selectedRole2, setSelectedRole2] = useState(null);
  const [selectedRole3, setSelectedRole3] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);

  console.log("userDetails----", userDetails);
  
  const mutationChangeProfileRole = useMutation({
    mutationKey: ["changeRole"],
    mutationFn: async () => {
      if (selectedRole1 && selectedRole2 && selectedRole3) {
        return await updateUserRoleById({
          role: "WORKER",
          labourType: userDetails?.roleType === "ONE" ? "ORG" : "ONE",
        });
      } else {
        return Alert.alert("Error", "Please select all roles.");
      }
    },
    onSuccess: (response: any) => {
      console.log("Response while updating the role of the User - ", response);
      let user = response?.data;
      setUserDetails({
        ...userDetails,
        roleType: userDetails?.roleType === "ONE" ? "ORG" : "ONE",
      });
    },
    onError: (err) => {
      console.error("error while updating the role of User ", err);
    },
  });

  const handleChangeRole = () => {
    if (selectedRole1 && selectedRole2 && selectedRole3) {
      Alert.alert("Success", "Roles have been changed successfully");
    } else {
      Alert.alert("Error", "Please select all roles.");
    }
  };

  const roleOptions = [
    { label: "Dhan Katai", value: "dhaanKatai" },
    { label: "Dhan Lagai", value: "dhanLagai" },
    { label: "Helpes", value: "helpers" },
    { label: "Construction Work", value: "constructionWork" },
  ];

  const extrFacilityOptions = [
    { label: "Food", value: "food" },
    { label: "Living", value: "living" },
    { label: "Travelling", value: "travelling" },
    { label: "Snacks", value: "snacks" },
  ];

  const teamCollectionPlaces = [
    { label: "My Home", value: "myHome" },
    { label: "Service Place", value: "servicePlace" },
    { label: "Employer Home", value: "employerHome" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Change Role",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 10,
                padding: 4,
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
      <Loader loading={mutationChangeProfileRole?.isPending} />
      <View style={styles.container}>
        <Text style={styles.label}>Mediator Type</Text>
        <Dropdown
          style={[styles.dropdown, isFocus1 && { borderColor: "#007BFF" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={roleOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus1 ? "Mediator Type" : "..."}
          searchPlaceholder="Search..."
          value={selectedRole1}
          onFocus={() => setIsFocus1(true)}
          onBlur={() => setIsFocus1(false)}
          onChange={(item: any) => {
            setSelectedRole1(item.value);
            setIsFocus1(false);
          }}
          containerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>Extra Facility</Text>
        <Dropdown
          style={[styles.dropdown, isFocus2 && { borderColor: "#007BFF" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={extrFacilityOptions}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus2 ? "Extra Facilities" : "..."}
          searchPlaceholder="Search..."
          value={selectedRole2}
          onFocus={() => setIsFocus2(true)}
          onBlur={() => setIsFocus2(false)}
          onChange={(item: any) => {
            setSelectedRole2(item.value);
            setIsFocus2(false);
          }}
          containerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>Place of Team Collection</Text>
        <Dropdown
          style={[styles.dropdown, isFocus3 && { borderColor: "#007BFF" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={teamCollectionPlaces}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus3 ? "Collection Places" : "..."}
          searchPlaceholder="Search..."
          value={selectedRole3}
          onFocus={() => setIsFocus3(true)}
          onBlur={() => setIsFocus3(false)}
          onChange={(item: any) => {
            setSelectedRole3(item.value);
            setIsFocus3(false);
          }}
          containerStyle={styles.dropdownContainer}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeRoleButton}
            onPress={() => mutationChangeProfileRole.mutate()}
          >
            <Text style={styles.changeRoleButtonText}>Change Role</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: "#dedede",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#C7C7CD",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: "#D1ECFF",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  changeRoleButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  changeRoleButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default ChangeRoleScreen;
