import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Modal, Portal, Button } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import CustomHeading from "../commons/CustomHeading";
import { t } from "@/utils/translationHelper";
import ErrorText from "../commons/ErrorText";

const MultiSelectDropdown = ({
  options,
  selectedOptions,
  onSelect,
  onRemove,
  disabled = false,
  searchEnabled,
  placeholder,
  label,
  isLoading,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Handle selection of an item
  const handleSelect = (selectedItem: any) => {
    console.log("selec0 -", selectedItem);
    setVisible(false);
    setSearchText("");
    onSelect([...selectedOptions, selectedItem]);
  };

  // Handle removing a selected item
  const handleRemove = (option: any) => {
    onSelect(selectedOptions?.filter((item: any) => item !== option));
  };

  // Filter options based on search input
  const filteredOptions = options?.filter(
    (item: any) =>
      !selectedOptions?.includes?.(item.value) &&
      item?.label?.toLowerCase()?.includes?.(searchText?.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {label && <CustomHeading textAlign="left">{t(label)}</CustomHeading>}
      <TouchableOpacity
        style={[styles.dropdownHeader, disabled && styles.disabledDropdown]}
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedItemsContainer}
        >
          {selectedOptions?.length > 0 ? (
            <>
              {selectedOptions?.map?.((item: any) => (
                <View key={item} style={styles.selectedItem}>
                  <CustomText color={Colors.white} fontWeight="600">
                    {t(item)}
                  </CustomText>
                  <TouchableOpacity onPress={() => handleRemove(item)}>
                    <Ionicons name="close-circle" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles?.placeholderContainer}>
                <CustomText color={Colors?.inputPlaceholder}>
                  {t(placeholder)}
                </CustomText>
              </View>
            </>
          ) : (
            <CustomText color={Colors?.inputPlaceholder}>
              {t(placeholder)}
            </CustomText>
          )}
        </ScrollView>
        <MaterialIcons
          name="touch-app"
          size={20}
          color={Colors.tertieryButton}
          style={selectedOptions?.length > 0 && styles?.placeholderContainer}
        />
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          {searchEnabled && (
            <TextInput
              label="Search..."
              value={searchText}
              onChangeText={setSearchText}
              mode="outlined"
              style={styles.searchInput}
            />
          )}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={30} color={Colors?.tertieryButton} />
              <CustomText color={Colors?.tertieryButton}>Loading...</CustomText>
            </View>
          ) : (
            <ScrollView
              style={styles.listContainer}
              keyboardShouldPersistTaps="handled"
            >
              {filteredOptions?.length > 0 ? (
                filteredOptions?.map((item: any) => (
                  <TouchableOpacity
                    key={item.value}
                    style={styles.optionItem}
                    onPress={() => handleSelect(item.value)}
                  >
                    <CustomText textAlign="left">{t(item.label)}</CustomText>
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText style={styles.noOptionsText}>
                  {t("noOptionsAvailable")}
                </CustomText>
              )}
            </ScrollView>
          )}
          <Button
            mode="contained"
            onPress={() => {
              setVisible(false);
              setSearchText("");
            }}
            style={styles.closeButton}
          >
            {t("close")}
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  container: { width: "100%", flexGrow: 1, gap: 5 },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  disabledDropdown: { backgroundColor: Colors.disabledButton },
  selectedItemsContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingRight: 20,
    minHeight: 50,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.tertieryButton,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 2,
  },
  placeholderContainer: {
    paddingVertical: 4,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  searchInput: { marginBottom: 10 },
  listContainer: { maxHeight: 200 },
  optionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  noOptionsText: {
    marginVertical: 20,
    textAlign: "center",
    color: Colors.inputPlaceholder,
  },
  closeButton: { marginTop: 10, backgroundColor: Colors.danger },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    minHeight: 100,
  },
});

// import React from "react";
// import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import CustomHeading from "../commons/CustomHeading";
// import Colors from "@/constants/Colors";
// import CustomText from "../commons/CustomText";
// import { t } from "@/utils/translationHelper";

// const SelectableList = ({
//   options,
//   selectedOptions,
//   setSelectedOptions,
// }: any) => {
//   const handleSelect = (option: any) => {
//     setSelectedOptions([...selectedOptions, option?.value]);
//   };

//   const filteredOptions = options?.filter(
//     (opt: any) => !selectedOptions?.some((sel: any) => sel === opt.value)
//   );

//   return (
//     <View style={styles.container}>
//       {/* Selected Options Section */}
//       <View style={styles?.selectWrapper}>
//         <CustomHeading textAlign="left">
//           {t("selected_worker_types")}
//           {/* ({" "}
//           <CustomText style={styles.helpText} textAlign="left">
//             {t("selected_worker_help")}
//           </CustomText>{" "}
//           ) */}
//         </CustomHeading>

//         <View style={styles.selectedContainer}>
//           {selectedOptions?.length > 0 ? (
//             selectedOptions.map((option: any, index: number) => (
//               <View key={index} style={styles.selectedItem}>
//                 <CustomText color={Colors?.white} fontWeight="600">
//                   {t(option)}
//                 </CustomText>
//                 <TouchableOpacity onPress={() => handleRemove(option)}>
//                   <Ionicons name="close-circle" size={20} color="white" />
//                 </TouchableOpacity>
//               </View>
//             ))
//           ) : (
//             <CustomText style={styles.placeholder} textAlign="center">
//               {t("no_workers_selected")}
//             </CustomText>
//           )}
//         </View>
//       </View>

//       {/* Available Options Section with Fixed Height & Scrollbar */}
//       <View style={{ margin: 10 }}>
//         <CustomHeading textAlign="left" style={{ marginBottom: 5 }}>
//           {t("available_worker_types")}
//           {/* ({" "}
//           <CustomText style={styles.helpText}>
//             {t("available_worker_help")}
//           </CustomText>{" "}
//           ) */}
//         </CustomHeading>
//       </View>
//       <ScrollView
//         style={styles.scrollContainer}
//         nestedScrollEnabled={true}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.selectedContainer}>
//           <View style={styles.availableContainer}>
//             {filteredOptions?.length > 0 ? (
//               filteredOptions.map((option: any, index: number) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.optionItem}
//                   onPress={() => handleSelect(option)}
//                 >
//                   <CustomText>{t(option.label)}</CustomText>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <CustomText style={styles.placeholder}>
//                 {t("no_available_workers")}
//               </CustomText>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     backgroundColor: Colors?.fourth,
//     borderRadius: 8,
//   },
//   selectWrapper: {
//     padding: 10,
//     gap: 5,
//   },
//   selectedContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   selectedItem: {
//     backgroundColor: Colors?.tertieryButton,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     margin: 5,
//     gap: 10,
//   },
//   scrollContainer: {
//     maxHeight: 300,
//   },
//   availableContainer: {
//     flex: 1,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//     padding: 10,
//   },
//   optionItem: {
//     backgroundColor: Colors?.white,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   placeholder: {
//     width: "100%",
//     color: "#888",
//     fontStyle: "italic",
//     padding: 10,
//     paddingVertical: 30,
//   },
//   helpText: {
//     fontSize: 12,
//     color: "#666",
//     marginBottom: 5,
//   },
// });

// export default SelectableList;
