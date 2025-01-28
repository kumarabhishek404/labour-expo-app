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
  const translatedOptions = options?.map((option: any) => ({
    ...option,
    label: t(option.label),
  }));

  return (
    <View style={[styles.container]}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      <DropDownPicker
        open={open}
        value={value}
        items={translatedOptions}
        setOpen={setOpen}
        setValue={() => {}}
        disabled={disabled}
        onSelectItem={(item) => {
          setValue(item?.value);
        }}
        style={[styles.dropdown, style, containerStyle]}
        placeholder={placeholder || t("selectItem")}
        placeholderStyle={styles.placeholderStyle}
        textStyle={styles.selectedTextStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        searchPlaceholder={t("search")}
        searchable={search}
        listMode="SCROLLVIEW"
        maxHeight={300}
        // ArrowUpIconComponent={() => (
        //   <Ionicons name="list" size={20} color="blue" />
        // )}
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
        <CustomText textAlign="left" baseFont={10} color={Colors?.danger}>
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
    flexGrow: 1,
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
  },
  dropDownContainerStyle: {
    borderColor: Colors.secondary,
    borderRadius: 8,
  },
  dropDownItemContainerStyle: {
    color: Colors?.primary,
  },
});
