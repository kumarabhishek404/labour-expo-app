import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import CustomHeading from "../commons/CustomHeading";
import AddAddressModal from "@/app/screens/location/addAddress";
import { t } from "@/utils/translationHelper";
import { convertToLabelValueArray } from "@/constants/functions";

interface LocationFieldProps {
  address: string;
  setAddress: any;
  isError: boolean;
}

const LocationField = ({
  address,
  setAddress,
  isError,
}: LocationFieldProps) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const userDetails = useAtomValue(UserAtom);

  const [allSavedAddresses, setAllSavedAddresses] = useState([
    ...(userDetails?.savedAddresses?.length > 0 ? convertToLabelValueArray(userDetails?.savedAddresses) : []),
    { label: t("addNewAddress"), value: "addAddress" },
  ]);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    console.log("useEffect called", userDetails?.savedAddresses);
    if (userDetails?.savedAddresses) {
      // Remove duplicates and create unique address objects
      const uniqueAddresses = Array.from(
        new Set(userDetails.savedAddresses)
      ).map((address) => ({
        label: address as string,
        value: address as string,
      }));

      // Add the "Add New Address" option at the end
      setAllSavedAddresses([
        ...uniqueAddresses,
        { label: t("addNewAddress"), value: "addAddress" },
      ]);

      // Auto-select the newly added address if it exists in savedAddresses
      // but isn't currently selected
      if (
        userDetails.savedAddresses.includes(address) === false &&
        userDetails.savedAddresses.length > 0
      ) {
        setAddress(
          userDetails.savedAddresses[userDetails.savedAddresses.length - 1]
        );
      }
    }
  }, [userDetails?.savedAddresses]);

  return (
    <View style={styles.container}>
      <Dropdown
        ref={dropdownRef}
        style={[
          styles.dropdown,
          isFocus && styles?.focusStyle,
          isError && styles?.errorInput,
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        containerStyle={isFocus && styles?.containerStyle}
        iconStyle={styles.iconStyle}
        data={allSavedAddresses}
        labelField="label"
        valueField="value"
        placeholder={t("selectAddress")}
        value={address}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: any) => {
          if (item.value === "addAddress") {
            setIsModalVisible(true);
            return;
          }
          setAddress(item.value);
          setIsFocus(false);
        }}
        renderItem={(item: any) => {
          if (item?.value === "addAddress") {
            return (
              <TouchableOpacity
                style={styles.actionItemWrapper}
                onPress={() => {
                  dropdownRef.current?.close();
                  setIsModalVisible(true);
                }}
              >
                <CustomHeading color={Colors?.link}>{item.label}</CustomHeading>
                <Entypo name="link" size={20} color={Colors?.link} />
              </TouchableOpacity>
            );
          } else {
            return (
              <CustomHeading
                textAlign="left"
                fontSize={12}
                style={{ padding: 10 }}
              >
                {item.label}
              </CustomHeading>
            );
          }
        }}
        renderLeftIcon={() => (
          <FontAwesome6
            style={styles.icon}
            color="black"
            name="location-dot"
            size={20}
          />
        )}
      />
      <AddAddressModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setAddress={(address: any) => {
          setAddress(address);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default LocationField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
    // marginBottom: 10,
  },
  dropdown: {
    height: 53,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  focusStyle: {
    borderColor: Colors?.primary,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
  containerStyle: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 0,
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
  placeholderStyle: {
    fontSize: 16,
    color: Colors.secondary,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
    color: Colors.secondary,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  actionItemWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  menuItem: {
    padding: 8,
    fontSize: 16,
    color: "black",
  },
  actionItem: {
    color: "blue",
  },
  dropdownOpen: {
    borderColor: "blue",
  },
  dropdownClosed: {
    borderColor: "gray",
  },
});
