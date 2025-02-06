import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AddAddressModal from "@/app/screens/location/addAddress";
import { convertToLabelValueArray } from "@/constants/functions";
import DropdownWithMenu from "./dropdownWithMenu";

interface LocationFieldProps {
  address: string;
  setAddress: any;
  isModalVisible: boolean;
  setIsModalVisible: any;
  isError: boolean;
}

const LocationField = ({
  address,
  setAddress,
  isModalVisible,
  setIsModalVisible,
  isError,
}: LocationFieldProps) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const userDetails = useAtomValue(Atoms?.UserAtom);

  const [allSavedAddresses, setAllSavedAddresses] = useState([
    ...(userDetails?.savedAddresses?.length > 0
      ? convertToLabelValueArray(userDetails?.savedAddresses)
      : []),
    // { label: t("addNewAddress"), value: "addAddress" },
  ]);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    if (userDetails?.savedAddresses) {
      const uniqueAddresses = Array.from(
        new Set(userDetails.savedAddresses)
      ).map((address) => ({
        label: address as string,
        value: address as string,
      }));

      setAllSavedAddresses([
        ...uniqueAddresses,
        // { label: t("addNewAddress"), value: "addAddress" },
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
      <DropdownWithMenu
        id="selectAddress"
        name="type"
        placeholder="selectAddress"
        searchEnabled={false}
        options={allSavedAddresses}
        icon={
          <Ionicons
            name={"location"}
            size={30}
            color={Colors.secondary}
            style={{ paddingVertical: 10, paddingRight: 10 }}
            errors={isError}
            containerStyle={isError && styles.errorInput}
          />
        }
        selectedValue={address}
        onSelect={setAddress}
        openDropdownId={openDropdownId}
        setOpenDropdownId={setOpenDropdownId}
      />
      {/* <PaperDropdown
        name="type"
        value={address}
        onSelect={setAddress}
        placeholder={t("selectAddress")}
        options={allSavedAddresses}
        errors={isError}
        containerStyle={isError && styles.errorInput}
        search={false}
        icon={
          <Ionicons
            name={"mail-outline"}
            size={30}
            color={Colors.secondary}
            style={{ paddingVertical: 10, paddingRight: 10 }}
          />
        }
      /> */}
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
    backgroundColor: "transparent",
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
