// import { View, Text } from 'react-native'
// import React from 'react'

// export default function LocationField() {
//   return (
//     <View>
//       <Text>LocationField</Text>
//     </View>
//   )
// }

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAtomValue } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";


const LocationField = ({ address, setAddress }: any) => {
  const [isFocus, setIsFocus] = useState(false);
  const userDetails = useAtomValue(UserAtom)
  const [serviceAddress, setServiceAddress] = useState([])
  
  useEffect(() => {
    let addresses = userDetails?.serviceAddress && userDetails?.serviceAddress?.map((address:any) => {
      return {
        label: address,
        value: address
      }
    })
    setServiceAddress(addresses)
  }, [userDetails])

  const data = [
    ...serviceAddress,
    { label: "Add New Address", value: "addAddress" }
  ];
  
  return (
    <View style={styles.container}>
      {/* <Text
        style={{
          marginVertical: 10,
        }}
      >
        Address
      </Text> */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={address}
        onChange={(item: any) => {
          setAddress(item.value);
        }}
        renderItem={(item: any) => {
          if (item?.value === "addAddress") {
            return (
              <Link href="/screens/location/addAddress" asChild>
                <TouchableOpacity style={styles.actionItemWrapper}>
                  <Text style={[styles.menuItem, styles.actionItem]}>
                    {item.label}
                  </Text>
                  <Entypo
                    name="link"
                    size={20}
                    color="blue"
                    // style={styles.cancelImage}
                  />
                </TouchableOpacity>
              </Link>
            );
          } else {
            return <Text style={styles.menuItem}>{item.label}</Text>;
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
    marginBottom: 16
  },
  dropdown: {
    height: 53,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
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
