import React from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../commons/Header";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";
import CustomText from "../commons/CustomText";

interface DropdownComponentProps {
  name?: any;
  label?: string;
  value: any;
  setValue: any;
  placeholder?: string;
  emptyPlaceholder?: string;
  options: any;
  errors?: any;
  icon: any;
  search?: boolean;
  style?: any;
  containerStyle?: any;
}

const DropdownComponent = ({
  name,
  label,
  value,
  setValue,
  placeholder,
  emptyPlaceholder,
  errors,
  options,
  icon,
  search,
  style,
  containerStyle,
}: DropdownComponentProps) => {
  const translatedOptions = options?.map((option: any) => ({
    ...option,
    label: t(option.label),
  }));

  return (
    <View style={[styles.container]}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      <Dropdown
        style={[styles.dropdown, style, containerStyle]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={translatedOptions}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || t("selectItem")}
        searchPlaceholder={t("search")}
        value={value}
        onChange={(item: any) => {
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
