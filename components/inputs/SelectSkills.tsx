import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomHeading from "../commons/CustomHeading";
import Colors from "@/constants/Colors";
import CustomText from "../commons/CustomText";
import { t } from "@/utils/translationHelper";
import ModalComponent from "../commons/Modal";
import TextInputComponent from "./TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import TOAST from "@/app/hooks/toast";

const { height } = Dimensions.get("window");

interface SkillsSelectorProps {
  name: string;
  isPricePerDayNeeded: boolean;
  selectedInterests: Array<any>;
  setSelectedInterests: any;
  availableOptions: Array<any>;
  onBlur?: any;
  errors: any;
}

const flattenSkills = (options: any[]) =>
  options.map((type) => ({
    label: type.label,
    value: type.value,
    skills: type?.subTypes?.flatMap((subType: any) => subType.workerTypes),
  }));

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedContainerHeight, setSelectedContainerHeight] = useState(0);
  const flattenedOptions = flattenSkills(availableOptions);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: priceErrors },
  } = useForm({ defaultValues: { pricePerDay: "" } });

  const handleSelect = (skill: any) => {
    if (selectedInterests.length >= 5) {
      TOAST?.error(t("skillLimitReached"));
      return;
    }
    if (isPricePerDayNeeded) {
      setSelectedSkill(skill);
      setIsEditMode(false);
      setPricePopupVisible(true);
    } else {
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

    const updatedInterests = isEditMode
      ? selectedInterests.map((item) =>
          item.skill === selectedSkill.value ? newSkill : item
        )
      : [...selectedInterests, newSkill];

    setSelectedInterests(updatedInterests);
    reset({ pricePerDay: "" });
    setPricePopupVisible(false);
  };

  const handleRemove = (skill: any) =>
    setSelectedInterests(
      selectedInterests.filter((item: any) => item.skill !== skill)
    );

  const handleEdit = (skill: any) => {
    const existingSkill = selectedInterests.find(
      (item) => item.skill === skill
    );
    setSelectedSkill(existingSkill);
    if (isPricePerDayNeeded) {
      setIsEditMode(true);
      reset({ pricePerDay: existingSkill?.pricePerDay || "" });
      setPricePopupVisible(true);
    }
  };

  const modalContent = () => (
    <View style={{ paddingVertical: 20 }}>
      <Controller
        control={control}
        name="pricePerDay"
        rules={{ required: t("priceIsRequired") }}
        render={({ field: { onChange, value } }) => (
          <TextInputComponent
            name="pricePerDay"
            label="pricePerDay"
            type="number"
            maxLength={4}
            placeholder={t("enterPricePerDay")}
            value={value}
            errors={priceErrors}
            textStyles={{ fontSize: 16 }}
            onChangeText={onChange}
          />
        )}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomHeading
        textAlign="left"
        color={Colors?.inputLabel}
        style={{ marginBottom: 10 }}
      >
        {t("selectAnySkills")} from below categories
      </CustomHeading>

      {/* Selected Skills - Fixed Section with dynamic height tracking */}
      <View
        style={styles.selectedContainer}
        onLayout={(event) =>
          setSelectedContainerHeight(event.nativeEvent.layout.height)
        }
      >
        {selectedInterests.map((interest: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.selectedItem}
            onPress={() => handleEdit(interest.skill)}
          >
            <CustomHeading color={Colors?.white}>
              {t(interest.skill)}
              {isPricePerDayNeeded && interest.pricePerDay
                ? ` - ₹ ${interest.pricePerDay} / ${t("perDay")}`
                : ""}
            </CustomHeading>
            <TouchableOpacity onPress={() => handleRemove(interest.skill)}>
              <Ionicons name="close-circle" size={20} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable Available Skills Section with dynamic height */}
      <ScrollView
        style={{
          ...styles.scrollContainer,
          height: height * 0.65 - selectedContainerHeight, // Dynamic height calculation
        }}
        contentContainerStyle={styles.skillContainer}
        showsVerticalScrollIndicator={false}
      >
        {flattenedOptions.map((item, idx) => (
          <View style={styles.skillBox} key={idx}>
            <CustomHeading
              textAlign="left"
              baseFont={20}
              color={Colors?.inputLabel}
            >
              {t(item.label)}
            </CustomHeading>
            <View style={styles.interestsContainer}>
              {item?.skills
                ?.filter(
                  (skill: any) =>
                    !selectedInterests?.find(
                      (sel) => sel?.skill === skill?.value
                    )
                )
                ?.map((skill: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.interestItem}
                    onPress={() => handleSelect(skill)}
                  >
                    <CustomHeading>+ {t(skill.label)}</CustomHeading>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal for price per day */}
      {isPricePerDayNeeded && (
        <ModalComponent
          visible={pricePopupVisible}
          content={modalContent}
          transparent={true}
          animationType="slide"
          title={`$${
            isEditMode ? t("editPriceForSkill") : t("enterPriceForSkill")
          } (${t(selectedSkill?.label)})`}
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
  mainContainer: {
    flexGrow: 1,
    backgroundColor: Colors?.background,
  },
  selectedContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "#DDD",
    width: "100%",
    minHeight: 80,
    padding: 6,
    borderRadius: 8,
  },
  scrollContainer: {
    paddingTop: 10,
  },
  skillContainer: {
    paddingBottom: 100,
  },
  skillBox: {
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  interestItem: {
    backgroundColor: Colors?.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedItem: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    gap: 10,
  },
});

export default SkillsSelector;
