import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import AddAddressModal from "@/app/screens/location/addAddress";
import { convertToLabelValueArray } from "@/constants/functions";
import DropdownWithMenu from "./DropdownWithMenu";
import { t } from "@/utils/translationHelper";
import PaperDropdown from "./Dropdown";

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

  console.log("address---", address);

  return (
    <View style={styles.container}>
      <PaperDropdown
        name="selectAddress"
        value={address}
        onSelect={setAddress}
        placeholder={t("selectAddress")}
        options={allSavedAddresses}
        errors={isError}
        search={false}
        icon={
          <Ionicons
            name={"location"}
            size={30}
            color={Colors.secondary}
            style={{ paddingVertical: 10, paddingRight: 10 }}
          />
        }
      />
      <AddAddressModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setAddress={(address: any) => {
          setAddress(address?.address);
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
});
