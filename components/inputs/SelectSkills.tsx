import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Requires @expo/vector-icons or similar icon library
import { getWorkLabel } from "@/constants/functions";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";
import ModalComponent from "../commons/Modal";
import TextInputComponent from "./TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import TOAST from "@/app/hooks/toast";

interface SkillsSelectorProps {
  name: string;
  isPricePerDayNeeded: boolean;
  selectedInterests: Array<any>;
  setSelectedInterests: any;
  availableOptions: Array<any>;
  onBlur: any;
  errors: any;
  icon?: any;
}

const SkillsSelector = ({
  name,
  isPricePerDayNeeded,
  selectedInterests,
  setSelectedInterests,
  availableOptions,
  onBlur,
  errors,
}: SkillsSelectorProps) => {
  const [pricePopupVisible, setPricePopupVisible] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors: priceErrors },
  } = useForm({
    defaultValues: {
      pricePerDay: "",
    },
  });

  const handleSelect = (skill: any) => {
    if (selectedInterests.length >= 5) {
      TOAST?.showToast?.error(t("skillLimitReached")); // Limit to 5 skills
      return;
    }

    if (isPricePerDayNeeded) {
      setSelectedSkill(skill);
      setIsEditMode(false); // Ensure edit mode is off
      setPricePopupVisible(true); // Show popup for pricePerDay input
    } else {
      // Add skill without pricePerDay
      setSelectedInterests([
        ...selectedInterests,
        { skill: skill.value, pricePerDay: null },
      ]);
    }
  };

  const handleAddSkill = (data: any) => {
    const newSkill = {
      skill: selectedSkill?.value,
      pricePerDay: isPricePerDayNeeded ? data.pricePerDay : null,
    };

    if (isEditMode) {
      const updatedInterests = selectedInterests.map((item) =>
        item.skill === selectedSkill.value ? newSkill : item
      );
      setSelectedInterests(updatedInterests);
    } else {
      setSelectedInterests([...selectedInterests, newSkill]);
    }

    reset({ pricePerDay: "" });
    setPricePopupVisible(false);
  };

  const handleRemove = (skill: any) => {
    const updatedInterests = selectedInterests.filter(
      (item: any) => item.skill !== skill
    );
    setSelectedInterests(updatedInterests);
  };

  const handleEdit = (skill: any) => {
    const existingSkill = selectedInterests.find(
      (item) => item.skill === skill
    );

    setSelectedSkill({
      value: skill,
      label: getWorkLabel(availableOptions, skill),
    });

    if (isPricePerDayNeeded) {
      setIsEditMode(true);
      reset({ pricePerDay: existingSkill?.pricePerDay || "" });
      setPricePopupVisible(true);
    } else {
      TOAST?.showToast?.error(t("priceEditNotAllowed")); // Optional toast for feedback
    }
  };

  const modalContent = () => {
    if (!isPricePerDayNeeded) return null;

    return (
      <View style={{ paddingVertical: 20 }}>
        <Controller
          control={control}
          name="pricePerDay"
          defaultValue=""
          rules={{ required: t("priceIsRequired") }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              name="pricePerDay"
              label={t("pricePerDay")}
              type="number"
              maxLength={4}
              placeholder={t("enterPricePerDay")}
              value={value}
              containerStyle={priceErrors?.pricePerDay && styles.errorInput}
              errors={priceErrors}
              textStyles={{ fontSize: 16 }}
              onChangeText={onChange}
            />
          )}
        />
      </View>
    );
  };

  console.log("selectedInterests--", selectedInterests);
  

  return (
    <View style={styles.container}>
      <CustomHeading textAlign="left">{t("selectAnySkills")}</CustomHeading>

      {/* Selected Skills */}
      <View
        style={[styles.selectedContainer, errors[name] && styles?.errorInput]}
      >
        {selectedInterests && selectedInterests?.length > 0 ? (
          selectedInterests.map((interest: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.selectedItem}
              onPress={() => handleEdit(interest.skill)}
            >
              <CustomHeading color={Colors?.white}>
                {getWorkLabel(availableOptions, interest.skill)}{" "}
                {isPricePerDayNeeded && interest.pricePerDay
                  ? `- ₹ ${interest.pricePerDay} / ${t("perDay")}`
                  : ""}
              </CustomHeading>
              <TouchableOpacity
                onPress={() => handleRemove(interest.skill)}
                style={{ marginLeft: 8 }}
              >
                <Ionicons name="close-circle" size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <CustomText baseFont={14}>{t("whatYouCanDo")}</CustomText>
        )}
      </View>

      {errors[name] && (
        <CustomText textAlign="left" baseFont={10} color={Colors?.danger}>
          {errors[name]?.message || ""}
        </CustomText>
      )}

      {/* Available Skills */}
      <View style={styles.interestsContainer}>
        {availableOptions
          .filter(
            (interest) =>
              !selectedInterests.find((item) => item.skill === interest?.value)
          ) // Filter out already selected skills
          .map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interestItem}
              onPress={() => handleSelect(interest)}
            >
              <CustomHeading>+ {t(interest?.label)}</CustomHeading>
            </TouchableOpacity>
          ))}
      </View>

      {isPricePerDayNeeded && (
        <ModalComponent
          visible={pricePopupVisible}
          content={modalContent}
          transparent={true}
          animationType="slide"
          title={
            (isEditMode ? t("editPriceForSkill") : t("enterPriceForSkill")) +
            ` (${selectedSkill?.label})`
          }
          onClose={() => {
            setPricePopupVisible(false);
            reset({ pricePerDay: "" });
          }}
          primaryButton={{
            title: isEditMode ? t("updateSkillPrice") : t("addSkillPrice"),
            action: handleSubmit(handleAddSkill),
          }}
          secondaryButton={{
            title: t("cancel"),
            action: () => {
              setPricePopupVisible(false);
              reset({ pricePerDay: "" });
            },
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 5,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#DDD",
    width: "100%",
    minHeight: 110,
    padding: 6,
  },
  selectedItem: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    gap: 5,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 10,
  },
  interestItem: {
    backgroundColor: "#EEE",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default SkillsSelector;
