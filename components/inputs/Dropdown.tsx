import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Modal, Portal, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import CustomText from "../commons/CustomText";
import Colors from "@/constants/Colors";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";
import ErrorText from "../commons/ErrorText";

const PaperDropdown = ({
  options,
  onSelect,
  onFocus,
  selectedValue,
  disabled = false,
  translationEnabled,
  searchEnabled,
  placeholder,
  name,
  label,
  errors,
  isLoading,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Handle selection of an item
  const handleSelect = (selectedItem: string) => {
    onSelect(selectedItem);
    setVisible(false);
    onSelect(selectedItem);
  };

  // Filter options based on search input
  const filteredOptions = options?.filter((item: any) =>
    item?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {label && (
        <CustomHeading
          textAlign="left"
          color={Colors?.inputLabel}
          baseFont={16}
          fontWeight="500"
        >
          {t(label)}
        </CustomHeading>
      )}
      <TouchableOpacity
        style={[
          styles.dropdownHeader,
          disabled && styles.disabledDropdown,
          errors?.[name] && { borderColor: Colors?.error },
        ]}
        onPress={() => {
          if (!disabled) {
            setVisible(true);
            if (onFocus) onFocus();
          }
        }}
        disabled={disabled}
      >
        <CustomText
          baseFont={16}
          textAlign="left"
          style={[
            styles.selectedText,
            disabled
              ? { color: Colors?.disabledButtonText }
              : selectedValue
              ? { color: Colors?.inputText }
              : { color: Colors?.inputPlaceholder },
          ]}
        >
          {translationEnabled
            ? t(selectedValue || placeholder)
            : selectedValue || placeholder}
        </CustomText>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color={
            disabled
              ? Colors?.disabledButtonText
              : selectedValue
              ? Colors?.inputText
              : Colors?.inputPlaceholder
          }
        />
      </TouchableOpacity>

      {!disabled && name && errors?.[name] && (
        <ErrorText>{errors?.[name]?.message || ""}</ErrorText>
      )}

      {/* Modal for Dropdown */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {/* Search Bar */}
          {!isLoading && options.length > 0 && searchEnabled && (
            <TextInput
              label="Search..."
              value={searchText}
              onChangeText={setSearchText}
              mode="outlined"
              style={styles.searchInput}
            />
          )}

          {/* Scrollable Dropdown List */}
          {isLoading ? (
            <View
              style={{
                minHeight: 100,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <ActivityIndicator size={30} color={Colors?.tertieryButton} />
              <CustomText color={Colors?.tertieryButton}>Loading...</CustomText>
            </View>
          ) : (
            <ScrollView
              style={styles.listContainer}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item: any) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.optionItem}
                    onPress={() => handleSelect(item.value)}
                  >
                    <View style={styles.optionContent}>
                      {item.icon && (
                        <View style={styles.iconContainer}>{item.icon}</View>
                      )}
                      <Text style={styles.optionText}>
                        {translationEnabled ? t(item.label) : item.label}
                      </Text>
                    </View>
                    {selectedValue === item.value && (
                      <Ionicons name="checkmark" size={20} color="black" />
                    )}
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText
                  style={{ marginVertical: 20 }}
                  baseFont={20}
                  color={Colors?.inputPlaceholder}
                >
                  {translationEnabled ? t(placeholder) : placeholder}
                </CustomText>
              )}
            </ScrollView>
          )}

          {/* Close Button */}
          <Button
            mode="contained"
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          >
            Close
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default PaperDropdown;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors?.background,
    flexGrow: 1,
    gap: 5,
  },
  dropdownHeader: {
    minHeight: 53,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors?.inputBorder,
    borderRadius: 8,
    backgroundColor: Colors?.white,
    gap: 5,
  },
  disabledDropdown: {
    backgroundColor: Colors?.disabledButton,
    borderColor: Colors?.disabledButton,
  },
  selectedText: {
    width: "90%",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 4,
  },
  searchInput: {
    marginBottom: 10,
    backgroundColor: Colors?.fourth,
  },
  listContainer: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: Colors?.danger,
  },
});
