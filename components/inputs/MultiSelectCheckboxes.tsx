import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

interface FiltersProps {
  label: string;
  options: Array<any>;
  selectedOption: Array<any>;
  setSelectedOption: any;
}

const MultiSelectCheckboxes = ({
  label,
  options,
  selectedOption,
  setSelectedOption,
}: FiltersProps) => {
  const toggleWorkerSelection = (worker: string) => {
    if (selectedOption.includes(worker)) {
      setSelectedOption(
        selectedOption.filter((item: string) => item !== worker)
      );
    } else {
      setSelectedOption([...selectedOption, worker]);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeading>{label}</CustomHeading>
      {options?.map((worker) => (
        <TouchableOpacity
          key={worker?.value}
          style={styles.workerItem}
          onPress={() => toggleWorkerSelection(worker?.value)}
        >
          <CustomText>{worker?.label}</CustomText>
          <View
            style={
              selectedOption.includes(worker?.value)
                ? styles.checkboxSelected
                : styles.checkbox
            }
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  workerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    backgroundColor: "#4F8EF7",
    borderRadius: 4,
  },
});

export default MultiSelectCheckboxes;
