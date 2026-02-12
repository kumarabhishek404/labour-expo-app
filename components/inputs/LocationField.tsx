import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import { convertToLabelValueArray } from "@/constants/functions";
import { t } from "@/utils/translationHelper";
import PaperDropdown from "./Dropdown";
import AddAddressDrawer from "@/app/screens/location/addAddress";
import CustomText from "../commons/CustomText";

interface LocationFieldProps {
  address: string;
  setAddress: any;
  setLocation: any;
  savedAddress: string[];
  setSavedAddress: any;
  isModalVisible: boolean;
  setIsModalVisible: any;
  isError: boolean;
}

const LocationField = ({
  address,
  setAddress,
  setLocation,
  savedAddress,
  setSavedAddress,
  isModalVisible,
  setIsModalVisible,
  isError,
}: LocationFieldProps) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const [allSavedAddresses, setAllSavedAddresses] = useState([
    ...(userDetails?.savedAddresses?.length > 0
      ? convertToLabelValueArray(userDetails?.savedAddresses)
      : []),
  ]);

  console.log("address---", address);
  console.log("userDetails?.savedAddresses---", userDetails?.savedAddresses);

  useEffect(() => {
    if (userDetails?.savedAddresses) {
      const uniqueAddresses = Array.from(
        new Set(userDetails.savedAddresses),
      ).map((address) => ({
        label: address as string,
        value: address as string,
      }));

      setAllSavedAddresses([...uniqueAddresses]);

      if (
        userDetails.savedAddresses.includes(address) === false &&
        userDetails.savedAddresses.length > 0
      ) {
        setAddress(
          userDetails.savedAddresses[userDetails.savedAddresses.length - 1],
        );
      }
    }
  }, [userDetails?.savedAddresses]);

  return (
    <View style={styles.container}>
      {allSavedAddresses && allSavedAddresses?.length > 0 ? (
        <PaperDropdown
          name="selectAddress"
          selectedValue={address}
          onSelect={setAddress}
          placeholder={t("selectAddress")}
          options={allSavedAddresses}
          errors={isError}
          icon={
            <Ionicons
              name={"location"}
              size={30}
              color={Colors.secondary}
              style={{ paddingVertical: 10, paddingRight: 10 }}
            />
          }
        />
      ) : (
        <TouchableOpacity
          style={styles.addAddressBox}
          onPress={() => setIsModalVisible(true)}
        >
          <CustomText baseFont={16} textAlign="left" color={Colors?.link}>
            {t("addNewAddress")}
          </CustomText>
          <Ionicons
            name="location-outline"
            size={20}
            color={Colors?.inputPlaceholder}
          />
        </TouchableOpacity>
      )}
      <AddAddressDrawer
        type="secondary"
        visible={isModalVisible}
        isMainAddress={false}
        onClose={() => setIsModalVisible(false)}
        userId={userDetails?._id}
        setAddress={(address: any) => {
          setAddress(address?.address);
        }}
        setLocation={(location: any) => {
          setLocation(location);
        }}
        setSavedAddress={(address: any) => {
          setSavedAddress(...savedAddress, address);
        }}
      />
    </View>
  );
};

export default LocationField;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "transparent",
  },
  dropdown: {
    height: 53,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  focusStyle: {
    borderColor: Colors?.primary,
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
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
  addAddressBox: {
    minHeight: 53,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors?.inputBorder,
    borderRadius: 8,
    backgroundColor: Colors?.white,
    gap: 5,
  },
});
