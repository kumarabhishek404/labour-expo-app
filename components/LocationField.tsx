// import { View, Text } from 'react-native'
// import React from 'react'

// export default function LocationField() {
//   return (
//     <View>
//       <Text>LocationField</Text>
//     </View>
//   )
// }

import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
  { label: "Add New Address", value: "addAddress" },
];

const LocationField = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
        }}
      >
        Address
      </Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        // searchPlaceholder="Search..."
        value={value}
        onChange={(item: any) => {
          setValue(item.value);
        }}
        renderItem={(item: any) => {
          if (item?.value === "addAddress") {
            return (
              <Link href="/location/addAddress" asChild>
                <TouchableOpacity style={styles.actionItemWrapper}>
                  <Text style={[styles.menuItem, styles.actionItem]}>{item.label}</Text>
                  <Entypo
                    name="link"
                    size={20}
                    color='blue'
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItem: {
    padding: 8,
    fontSize: 16,
    color: "black",
  },
  actionItem: {
    color: 'blue'
  }
});
