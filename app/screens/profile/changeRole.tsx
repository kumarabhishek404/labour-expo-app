import USER from "@/app/api/user";
import Atoms from "@/app/AtomStore";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomHeader from "@/components/commons/Header";
import Loader from "@/components/commons/Loaders/Loader";
import Button from "@/components/inputs/Button";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";

const ChangeRoleScreen = () => {
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [selectedRole1, setSelectedRole1] = useState(null);
  const [selectedRole2, setSelectedRole2] = useState(null);
  const [selectedRole3, setSelectedRole3] = useState(null);
  const [isFocus1, setIsFocus1] = useState(false);
  const [isFocus2, setIsFocus2] = useState(false);
  const [isFocus3, setIsFocus3] = useState(false);

  const mutationChangeProfileRole = useMutation({
    mutationKey: ["changeRole"],
    mutationFn: async () => {
      if (selectedRole1 && selectedRole2 && selectedRole3) {
        return await USER?.updateUserRoleById({
          role:  "MEDIATOR",
        });
      } else {
        return Alert.alert("Error", "Please select all roles.");
      }
    },
    onSuccess: (response: any) => {
      console.log("Response while updating the of the User - ", response);
      let user = response?.data;
      setUserDetails({
        ...userDetails,
        role: "MEDIATOR",
      });
    },
    onError: (err) => {
      console.error("error while updating the of User ", err);
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
          header: () => <CustomHeader title="Change Role" left="back" />,
        }}
      />
      <Loader loading={mutationChangeProfileRole?.isPending} />
      <View style={styles.container}>
        <CustomHeading textAlign="left">Mediator Type</CustomHeading>
        {/* <Dropdown
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
        /> */}
        <CustomHeading textAlign="left">Extra Facility</CustomHeading>
        {/* <Dropdown
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
        /> */}
        <CustomHeading textAlign="left">Place of Team Collection</CustomHeading>
        {/* <Dropdown
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
        /> */}

        <View style={styles.buttonContainer}>
          <Button
            isPrimary={false}
            title={t("cancel")}
            onPress={() => router.back()}
          />
          <Button
            isPrimary={true}
            title="Change Role"
            onPress={() => mutationChangeProfileRole.mutate()}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 5,
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
    borderRadius: 8,
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
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  changeRoleButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  changeRoleButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default ChangeRoleScreen;
