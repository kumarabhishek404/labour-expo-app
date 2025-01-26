import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/utils/translationHelper";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";

interface DropdownComponentProps {
  name?: string;
  label?: string;
  value: any;
  setValue: (value: any) => void;
  placeholder?: string;
  options: { label: string; value: any }[];
  errors?: any;
  icon?: any;
  search?: boolean;
  style?: any;
  containerStyle?: any;
  disabled?: boolean;
}

const DropdownComponent = ({
  name,
  label,
  value,
  setValue,
  placeholder,
  errors,
  options,
  icon,
  search = false,
  style,
  containerStyle,
  disabled = false,
}: DropdownComponentProps) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    options.map((option) => ({
      label: option.label,
      value: option.value,
    }))
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        items={items}
        setItems={setItems}
        disabled={disabled}
        style={[styles.dropdown, style]}
        placeholder={placeholder || t("selectItem")}
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.selectedTextStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        searchPlaceholder={t("search")}
        searchable={search}
        listMode="SCROLLVIEW"
        maxHeight={300}
        ArrowUpIconComponent={() => (
          <Ionicons name="list" size={20} color="blue" />
        )}
        // icon={
        //   <View style={styles.iconContainer}>
        //     {icon || (
        //       <Ionicons
        //         style={styles.icon}
        //         color={Colors.secondary}
        //         name="person"
        //         size={20}
        //       />
        //     )}
        //   </View>
        // }
      />
      {errors?.[name] && (
        <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}
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
  iconContainer: {
    marginRight: 5,
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
    color: Colors.secondary,
  },
  dropDownContainerStyle: {
    borderColor: Colors.secondary,
    borderRadius: 8,
  },
});
