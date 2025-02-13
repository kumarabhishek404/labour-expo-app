import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "@/components/commons/CustomHeading";
import { t } from "@/utils/translationHelper";

const DropdownWithMenu = ({
  name,
  label,
  options = [],
  selectedValue,
  onSelect,
  placeholder,
  errors,
  disabled = false,
  translationEnabled,
}: any) => {
  const [selected, setSelected] = useState(selectedValue || "");
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  // Animate dropdown visibility
  const animateDropdown = (toValue: number) => {
    Animated.timing(dropdownAnim, {
      toValue,
      duration: 150, // Faster opening/closing
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container]}>
      {label && (
        <CustomHeading
          textAlign="left"
          baseFont={16}
          fontWeight="500"
          color={Colors?.inputLabel}
        >
          {t(label)}
        </CustomHeading>
      )}

      <View
        pointerEvents={disabled ? "none" : "auto"}
        style={{ opacity: disabled ? 0.6 : 1, marginTop: 4 }}
      >
        <SelectList
          setSelected={(val: any) => {
            console.log("valuee---", val);

            setSelected(val);
            onSelect(val);
            animateDropdown(1); // Show animation on selection
          }}
          data={options.map((item: any) => ({
            key: item?.label,
            value: translationEnabled ? t(item.label) : item?.label,
          }))}
          save="key"
          arrowicon={
            <FontAwesome
              name="chevron-down"
              size={16}
              color={disabled ? Colors.darkGray : Colors.primary}
            />
          }
          search={false}
          boxStyles={StyleSheet.flatten([
            styles.input,
            disabled && styles.disabledInput,
            errors?.[name] && { borderColol: Colors?.error },
          ])}
          dropdownItemStyles={{ paddingVertical: 8, paddingHorizontal: 12 }}
          dropdownStyles={StyleSheet.flatten([styles.dropdown])}
          placeholder={t(placeholder) || "Select an option"}
          defaultOption={options.find((item: any) => item.value === selected)}
        />

        {/* Animated Dropdown */}
        <Animated.View
          style={[
            styles.animatedDropdown,
            { transform: [{ scale: dropdownAnim }] },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 999,
  },
  input: {
    borderWidth: 1,
    // borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  disabledInput: {
    backgroundColor: Colors?.gray,
    borderColor: "#ddd",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primary,
    maxHeight: 200,
    borderRadius: 8,
    elevation: 1,
    zIndex: 999,
    padding: 0,
  },
  animatedDropdown: {
    position: "absolute",
    top: 50,
    width: "100%",
    height: 10,
    backgroundColor: "transparent",
  },
});

export default DropdownWithMenu;
