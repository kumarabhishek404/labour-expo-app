import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import AddAddressDrawer from "@/app/screens/location/addAddress";
import { t } from "@/utils/translationHelper";

interface Props {
  label: string;
  address: string;
  setAddress: (val: string) => void;
  setLocation: (loc: any) => void;
  errors?: any;
}

const AddressSelector = ({
  label,
  address,
  setAddress,
  setLocation,
  errors,
}: Props) => {
  const user = useAtomValue(Atoms?.UserAtom);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    if (user?.savedAddresses?.length) {
      const unique: any = Array.from(new Set(user.savedAddresses));
      setAddresses(unique);

      // auto select last address if none selected
      if (!address) setAddress(unique[unique.length - 1]);
    }
  }, [user?.savedAddresses]);

  const selectAddress = (addr: string) => {
    setAddress(addr);
  };

  return (
    <View style={{ gap: 10 }}>
      <CustomHeading baseFont={18} textAlign="left">
        {label}
      </CustomHeading>

      {/* Saved Address List */}
      {addresses.map((addr, index) => {
        const selected = address === addr;
        return (
          <TouchableOpacity
            key={index}
            style={[styles.card, selected && styles.activeCard]}
            onPress={() => selectAddress(addr)}
          >
            <View style={[styles.radio, selected && styles.radioActive]} />
            <CustomText
              style={{ flex: 1 }}
              textAlign="left"
              color={selected ? Colors.primary : Colors.text}
            >
              {addr}
            </CustomText>
          </TouchableOpacity>
        );
      })}

      {/* Add new address button */}
      <TouchableOpacity
        style={styles.addNewBtn}
        onPress={() => setDrawerVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
        <CustomText color={Colors.primary}>{t("addNewAddress")}</CustomText>
      </TouchableOpacity>

      <AddAddressDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        userId={user?._id}
        isMainAddress={false}
        setAddress={(data: any) => {
          setAddress(data.address);
        }}
        setLocation={setLocation}
      />

      {errors && (
        <CustomText color={Colors.danger}>{errors.message}</CustomText>
      )}
    </View>
  );
};

export default AddressSelector;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 10,
  },
  activeCard: {
    borderColor: Colors.primary,
    backgroundColor: "#F1F8FF",
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#aaa",
  },
  radioActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
});
