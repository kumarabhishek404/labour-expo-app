import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import LocationField from "../inputs/LocationField";
import Button from "../inputs/Button";
import * as Location from "expo-location";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import CustomHeading from "./CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { isEmptyObject } from "@/constants/functions";
import ErrorText from "./ErrorText";

interface AddLocationAndAddressProps {
  label: string;
  name: string;
  address: string;
  setAddress: any;
  location: any;
  setLocation: any;
  savedAddress?: string[];
  setSavedAddress?: any;
  selectedOption?: string;
  errors: any;
  icon?: any;
  style?: any;
  isRequired?: boolean;
}

const AddLocationAndAddress = ({
  label,
  name,
  address,
  setAddress,
  location,
  setLocation,
  savedAddress,
  setSavedAddress,
  selectedOption = "address",
  errors,
  style,
  isRequired,
}: AddLocationAndAddressProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.radioContainer}>
        <Text style={styles?.labelContainer}>
          <CustomHeading
            color={Colors?.inputLabel}
            baseFont={18}
            fontWeight="600"
          >
            {label}
          </CustomHeading>
          {isRequired && (
            <CustomHeading
              textAlign="left"
              color={Colors.danger}
              baseFont={16}
              fontWeight="500"
            >
              {" "}
              ({t("required")})
            </CustomHeading>
          )}
        </Text>
      </View>

      <LocationField
        address={address}
        setAddress={setAddress}
        setLocation={setLocation}
        savedAddress={savedAddress}
        setSavedAddress={setSavedAddress}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        isError={errors?.[name]}
      />
      {errors?.[name] && (
        <ErrorText> {errors?.[name]?.message || ""}</ErrorText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  labelContainer: {
    flexDirection: "row",
    gap: 5,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors?.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  radioChecked: {
    width: 12,
    height: 12,
    borderRadius: 8,
    backgroundColor: Colors?.primary,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 15,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#f9f9f9",
  },
  locationContainer: {},
  locationText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
});

export default AddLocationAndAddress;
