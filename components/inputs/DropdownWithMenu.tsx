import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";

const DropdownWithMenu = ({
  id, // Unique ID for each dropdown
  label,
  options,
  selectedValue,
  onSelect,
  containerStyle,
  placeholder,
  searchEnabled = true,
  openDropdownId,
  setOpenDropdownId,
  icon, // Default icon before placeholder
  disabled = false,
}: any) => {
  const isOpen = openDropdownId === id; // Check if this dropdown is open
  const [searchText, setSearchText] = useState("");
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    if (disabled) return; // Prevent opening if disabled

    if (isOpen) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(id);
    }
    Animated.timing(dropdownAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleSelect = (value: any) => {
    onSelect(value);
    setSearchText("");
    setOpenDropdownId(null); // Close dropdown after selection
  };

  const filteredOptions = options.filter((item: any) =>
    item.label.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}

      <TouchableOpacity
        style={[
          styles.input,
          isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
          disabled && styles.disabledInput, // Apply disabled styles
        ]}
        onPress={toggleDropdown}
        activeOpacity={disabled ? 1 : 0.7} // Prevents feedback on disabled
      >
        <View style={styles.inputContent}>
          {icon && icon}
          {selectedValue ? (
            <CustomText baseFont={18}>{selectedValue}</CustomText>
          ) : (
            <CustomText color={Colors?.secondary}>
              {placeholder || label}
            </CustomText>
          )}
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={disabled ? Colors.gray : Colors.secondary} // Gray color when disabled
        />
      </TouchableOpacity>

      {isOpen && !disabled && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              maxHeight: dropdownAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 200],
              }),
            },
          ]}
        >
          {searchEnabled && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
            />
          )}

          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item.value)}
              >
                <CustomText textAlign="left">{item.label}</CustomText>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    gap: 5,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f2f2f2",
    borderColor: "#ccc",
    opacity: 0.6, // Make it look disabled
  },
  inputContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: "hidden",
    zIndex: 10,
  },
  searchInput: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    fontSize: 16,
    backgroundColor: "#f8f8f8",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default DropdownWithMenu;
