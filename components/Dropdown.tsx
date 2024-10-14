import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "@/constants/Colors";
import { Fontisto, Ionicons } from "@expo/vector-icons";

const DropdownComponent = ({
  value,
  setValue,
  placeholder,
  options,
  icon,
  style,
}: any) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, style]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={options}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || "Select item"}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item: any) => {
          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <View
            style={{
              marginLeft: 6,
            }}
          >
            {icon ? (
              icon
            ) : (
              <Ionicons
                style={styles.icon}
                color="black"
                name="person"
                size={20}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  dropdown: {
    height: 53,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 16,
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
});
