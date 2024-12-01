import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import CustomHeading from "../commons/CustomHeading";

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
  const userDetails = useAtomValue(UserAtom);
  const [allSavedAddresses, setAllSavedAddresses] = useState([
    { label: "Add New Address", value: "addAddress" },
  ]);

  useEffect(() => {
    let addresses =
      userDetails?.serviceAddress &&
      userDetails?.serviceAddress?.map((address: any) => {
        return {
          label: address,
          value: address,
        };
      });

    if (addresses && addresses?.length > 0)
      setAllSavedAddresses([...addresses, ...allSavedAddresses]);
  }, [userDetails?.serviceAddress]);

  return (
    <View style={styles.container}>
      <Dropdown
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
        placeholder="Select item"
        value={address}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: any) => {
          setAddress(item.value);
        }}
        renderItem={(item: any) => {
          if (item?.value === "addAddress") {
            return (
              <Link href="/screens/location/addAddress" asChild>
                <TouchableOpacity style={styles.actionItemWrapper}>
                  <CustomHeading color={Colors?.link}>
                    {item.label}
                  </CustomHeading>
                  <Entypo name="link" size={20} color={Colors?.link} />
                </TouchableOpacity>
              </Link>
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
});
