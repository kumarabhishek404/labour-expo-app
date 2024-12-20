import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";

const MultiSelectDropdownComponent = ({
  value,
  setValue,
  placeholder,
  options,
  icon,
  style,
}: any) => {
  const handleSelectItem = (item: any) => {
    if (value) setValue([...value, item]);
    else setValue([item]);
  };

  const handleRemoveItem = (item: any) => {
    setValue(value?.filter((i: { value: any }) => i.value !== item.value));
  };

  const availableOptions = options.filter(
    (option: any) =>
      !value?.some((item: { value: any }) => item.value === option.value)
  ).map((option: any) => ({
    ...option,
    label: t(option.label)
  }));

  return (
    <View style={styles.container}>
      <View style={styles.selectedContainer}>
        <View style={{ flexDirection: "column", gap: 4 }}>
          <CustomHeading textAlign="left">
            {t('selectedSkills')}
          </CustomHeading>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {value && value?.length > 0 ? (
              value.map((item: any, index: number) => (
                <View key={index} style={styles.selectedItem}>
                  <CustomHeading fontSize={14} color={Colors?.white} style={{marginRight: 5}}>
                    {t(item.label)}
                  </CustomHeading>
                  <TouchableOpacity onPress={() => handleRemoveItem(item)}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={Colors.white}
                    />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <CustomText color={Colors?.secondary}>
                {t('noSkillsSelected')}
              </CustomText>
            )}
          </View>
        </View>
      </View>

      <Dropdown
        style={[styles.dropdown, style]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={availableOptions}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || "Select item"}
        searchPlaceholder="Search..."
        value={null} // Reset the value to allow multiple selections
        onChange={(item: any) => {
          handleSelectItem(item);
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

export default MultiSelectDropdownComponent;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "white",
  },
  selectedContainer: {
    marginBottom: 20,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedItemText: {
    color: "white",
    marginRight: 5,
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
