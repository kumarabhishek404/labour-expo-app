import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import ButtonComp from "../../../../../components/inputs/Button";
import SelectableTags from "../../../../../components/inputs/SingleSelectedTag";
import { t } from "@/utils/translationHelper";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import MultiSelectDropdown from "../../../../../components/inputs/MultiSelectDropdown";

const DISTANCE = [
  { label: "within_10km", value: "within_10km" },
  { label: "within_50km", value: "within_50km" },
  { label: "within_100km", value: "within_100km" },
  { label: "more_than_100km", value: "more_than_100km" },
  { label: "anywhere", value: "anywhere" },
];

const DURATION = [
  { label: "less_5_days", value: "less_5_days" },
  { label: "less_15_days", value: "less_15_days" },
  { label: "less_one_month", value: "less_one_month" },
  { label: "more_one_month", value: "more_one_month" },
  { label: "any_duration", value: "any_duration" },
];

const SERVICE_STARTS_IN = [
  { label: "within_one_month", value: "within_one_month" },
  { label: "within_six_months", value: "within_six_months" },
  { label: "within_one_year", value: "within_one_year" },
  { label: "more_than_one_year", value: "more_than_one_year" },
  { label: "anytime", value: "anytime" },
];

const FiltersServices = ({ filterVisible, setFilterVisible, onApply }: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      distance: "",
      duration: "",
      serviceStartIn: "",
      skills: [],
    },
  });

  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const handleApply = (data: any) => {
    reset();
    setFilterVisible(false);
    onApply(data);
  };

  const handleClear = () => {
    reset();
    setFilterVisible(false);
    setSelectedWorkers([]);
  };

  const filterContent = () => (
    <View style={styles.scrollbarContent}>
      <Controller
        control={control}
        name="distance"
        render={({ field: { onChange, value } }) => (
          <SelectableTags
            label={t("distance_of_service")}
            options={DISTANCE}
            selectedTag={value}
            setSelectedTag={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="duration"
        render={({ field: { onChange, value } }) => (
          <SelectableTags
            label={t("duration_of_service")}
            options={DURATION}
            selectedTag={value}
            setSelectedTag={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="serviceStartIn"
        render={({ field: { onChange, value } }) => (
          <SelectableTags
            label={t("service_will_start_in")}
            options={SERVICE_STARTS_IN}
            selectedTag={value}
            setSelectedTag={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="skills"
        render={({ field: { onChange, value } }) => (
          <MultiSelectDropdown
            label="selectSkills"
            options={WORKERTYPES}
            selectedOptions={value}
            onSelect={onChange}
            searchEnabled={true}
            placeholder="searchAndSelectSkills"
          />
        )}
      />
    </View>
  );

  useEffect(() => {
    if (filterVisible) {
      setDrawerState({
        visible: true,
        title: "filters",
        content: filterContent,
        primaryButton: {
          title: "apply",
          action: handleSubmit(handleApply),
        },
        secondaryButton: {
          title: "clear",
          action: handleClear,
        },
        onClose: () => setFilterVisible(false), // Close drawer when clicking the close button
      });
    }
  }, [filterVisible, selectedWorkers]);

  return null;
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterScreen: {
    backgroundColor: Colors?.fourth,
    height: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollbarContent: {
    // marginBottom: 50
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    left: 10,
    bottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  clearButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  star: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors?.primary,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  selectedStar: {
    backgroundColor: "gold",
    borderWidth: 1,
    borderColor: "gold",
  },
});

export default FiltersServices;
