import React from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../commons/Header";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";

interface DropdownComponentProps {
  label?: string;
  value: any;
  setValue: any;
  placeholder?: string;
  options: any;
  icon: any;
  style?: any;
}

const DropdownComponent = ({
  label,
  value,
  setValue,
  placeholder,
  options,
  icon,
  style,
}: DropdownComponentProps) => {
  const translatedOptions = options.map((option: any) => ({
    ...option,
    label: t(option.label),
  }));

  return (
    <View style={styles.container}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      <Dropdown
        style={[styles.dropdown, style]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={translatedOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || "Select item"}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item: any) => {
          console.log("Item--", item);

          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <View
            style={{
              marginRight: 5,
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
    gap: 5,
  },
  dropdown: {
    height: 53,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 8,
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
