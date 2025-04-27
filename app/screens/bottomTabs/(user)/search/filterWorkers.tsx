import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import SelectableTags from "../../../../../components/inputs/SingleSelectedTag";
import CustomText from "../../../../../components/commons/CustomText";
import { t } from "@/utils/translationHelper";
import { useAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import MultiSelectDropdown from "../../../../../components/inputs/MultiSelectDropdown";
import CustomHeading from "@/components/commons/CustomHeading";

const SERVICE_COMPLETED = [
  { label: "more_than_10", value: "more_than_10" },
  { label: "more_than_50", value: "more_than_50" },
  { label: "more_than_100", value: "more_than_100" },
  { label: "more_than_500", value: "more_than_500" },
  { label: "zero", value: "zero" },
];

const DISTANCE = [
  { label: "within_10km", value: "within_10km" },
  { label: "within_50km", value: "within_50km" },
  { label: "within_100km", value: "within_100km" },
  { label: "anywhere", value: "anywhere" },
];

const FiltersWorkers = ({ filterVisible, setFilterVisible, onApply }: any) => {
  const [drawerAtom, setDrawerState]: any = useAtom(Atoms?.BottomDrawerAtom);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      completedServices: "",
      rating: 0,
      distance: "",
      skills: [],
    },
  });

  const handleApply = (data: any) => {
    reset();
    setFilterVisible(false);
    onApply(data);
  };

  const handleClear = () => {
    reset();
    setFilterVisible(false);
  };

  const filterContent = () => (
    <View style={styles.scrollbarContent}>
      <Controller
        control={control}
        name="completedServices"
        render={({ field: { onChange, value } }) => (
          <SelectableTags
            label={t("number_of_service_completed")}
            options={SERVICE_COMPLETED}
            selectedTag={value}
            setSelectedTag={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="rating"
        render={({ field: { onChange, value } }) => (
          <View style={styles.section}>
            <CustomHeading style={styles.label} textAlign="left">
              {t("rating_of_worker")}
            </CustomHeading>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => onChange(num)}
                  style={[styles.star, value === num && styles.selectedStar]}
                >
                  <CustomText
                    color={
                      value === num ? Colors?.white : Colors?.inputPlaceholder
                    }
                    fontWeight="600"
                    baseFont={24}
                  >
                    {num}
                  </CustomText>
                  <AntDesign
                    name="star"
                    size={22}
                    color={
                      value === num ? Colors?.white : Colors?.inputPlaceholder
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

      <Controller
        control={control}
        name="distance"
        render={({ field: { onChange, value } }) => (
          <SelectableTags
            label={t("distance_of_worker")}
            options={DISTANCE}
            selectedTag={value}
            setSelectedTag={onChange}
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
        onClose: () => {
          setDrawerState((prev: any) => ({ ...prev, visible: false }));
          setFilterVisible(false);
        },
      });
    }
    return () => {
      setDrawerState((prev: any) => ({ ...prev, visible: false }));
    };
  }, [filterVisible]);

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
    marginTop: 15,
    gap: 20,
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
    borderColor: Colors?.inputPlaceholder,
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

export default FiltersWorkers;
