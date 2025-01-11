import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import ModalComponent from "./Modal";
import { getWorkLabel, removeEmptyStrings } from "@/constants/functions";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import DropdownComponent from "../inputs/Dropdown";
import TextInputComponent from "../inputs/TextInputWithIcon";

interface SkillSelectorProps {
  canAddSkills: boolean;
  role: string;
  isShowLabel?: boolean;
  style?: any;
  tagStyle?: any;
  tagTextStyle?: any;
  selectedSkills?: Array<string>;
  setSelectedSkills?: any;
  userSkills: Array<string>;
  availableSkills: any;
  handleAddSkill?: any;
  handleRemoveSkill?: any; // Function to handle removing a skill
  count?: number; // Optional prop to control the number of displayed skills
}

const SkillSelector = ({
  canAddSkills,
  role,
  isShowLabel,
  style,
  tagStyle,
  tagTextStyle,
  selectedSkills,
  setSelectedSkills,
  userSkills,
  availableSkills,
  handleAddSkill,
  handleRemoveSkill,
  count,
}: SkillSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false); // For remove skill modal
  const [skillPrices, setSkillPrices] = useState<any>({});
  const [skillWithPrice, setSkillWithPrice] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedSkillToRemove, setSelectedSkillToRemove] = useState<
    string | null
  >(null); // Track selected skill for removal

  // New state to hold filtered available skills (skills that are not already selected by the user)
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [selectedUserSkills, setSelectedUserSkills] = useState<any[]>([]);

  useEffect(() => {
    // Filter available skills by excluding the ones already present in userSkills
    const filteredSkills = availableSkills?.filter(
      (availableSkill: any) =>
        !userSkills?.some((userSkill: any) => {
          return (
            userSkill?.skill?.trim()?.toLowerCase() ===
            availableSkill?.value?.trim()?.toLowerCase()
          );
        })
    );

    setFilteredSkills(filteredSkills);
  }, [availableSkills, userSkills]);

  useEffect(() => {
    // Filter available skills by excluding the ones already present in userSkills
    const filteredSkills = availableSkills?.filter((availableSkill: any) =>
      userSkills?.some((userSkill: any) => {
        return (
          userSkill?.skill?.trim()?.toLowerCase() ===
          availableSkill?.value?.trim()?.toLowerCase()
        );
      })
    );

    setSelectedUserSkills(filteredSkills);
  }, [availableSkills, userSkills]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleRemoveModal = () => {
    setIsRemoveModalVisible(!isRemoveModalVisible);
  };

  const handleSkillSelection = (skill: string) => {
    setSelectedSkill(skill);
  };

  const handleSkillToRemoveSelection = (skill: string) => {
    setSelectedSkillToRemove(skill);
  };

  const handlePriceChange = (price: string) => {
    setSkillWithPrice({
      skill: selectedSkill,
      pricePerDay: parseInt(price, 10),
    });
  };

  const onAddSkills = async () => {
    try {
      // For MEDIATOR, skip price validation
      if (
        role === "WORKER" &&
        (!skillWithPrice || !skillWithPrice.pricePerDay)
      ) {
        return console.log("Please enter both skill and price.");
      }

      console.log("skill---", skillWithPrice, selectedSkill);

      // Send skill object to the API
      await handleAddSkill(
        role === "WORKER" ? skillWithPrice : { skill: selectedSkill }
      );

      setIsModalVisible(false);
      setSkillPrices({});
      setSelectedSkill(null); // Reset selected skill
      setSkillWithPrice(null); // Reset skill with price
    } catch (err) {
      console.log("Error adding skill:", err);
    }
  };

  const onRemoveSkill = async () => {
    try {
      // Ensure a skill is selected to be removed
      if (!selectedSkillToRemove) {
        return console.log("Please select a skill to remove.");
      }

      // Ensure at least one skill remains
      if (userSkills?.length <= 1) {
        return console.log("At least one skill is required.");
      }

      // Call remove skill API
      await handleRemoveSkill(selectedSkillToRemove);

      setIsRemoveModalVisible(false);
      setSelectedSkillToRemove(null); // Reset selected skill to remove
    } catch (err) {
      console.log("Error removing skill:", err);
    }
  };

  const renderPriceInput = () => {
    if (role === "WORKER") {
      return (
        <View style={styles.priceInputContainer}>
          <TextInputComponent
            label={t("enterPricePerDay")}
            name="pricePerDay"
            placeholder={t("enterPricePerDay")}
            type="number"
            style={styles.priceInput}
            value={skillWithPrice?.pricePerDay}
            maxLength={4}
            onChangeText={(price: string) => handlePriceChange(price)}
            icon={
              <FontAwesome
                name="rupee"
                size={26}
                color={Colors.secondary}
                style={{ paddingVertical: 10, paddingRight: 10 }}
              />
            }
          />
        </View>
      );
    }
    return null;
  };

  const renderSkills = () => {
    const skillsToShow = count
      ? removeEmptyStrings(userSkills)?.slice(0, count)
      : removeEmptyStrings(userSkills);

    return (
      <>
        {skillsToShow?.length > 0 ? (
          skillsToShow?.map((item: any, index: number) => (
            <View key={index}>
              {getWorkLabel(availableSkills, item?.skill) && (
                <View style={[styles.skillBox, tagStyle]}>
                  {role === "WORKER" ? (
                    <CustomText style={[tagTextStyle]}>
                      {`${getWorkLabel(availableSkills, item?.skill)} - ${t(
                        "rs"
                      )} ${item?.pricePerDay} / ${t("perDay")}`}
                    </CustomText>
                  ) : (
                    <CustomText style={[tagTextStyle]}>
                      {`${getWorkLabel(availableSkills, item?.skill)}`}
                    </CustomText>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <CustomText fontSize={14}>{t("noSkillsFound")}</CustomText>
        )}

        {count && count < userSkills?.length && (
          <CustomText color={Colors?.link} fontSize={18}>
            ...
          </CustomText>
        )}
      </>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {isShowLabel && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={styles.highlightIcon}>
              <FontAwesome name="users" size={14} color={Colors.primary} />
            </View>
            <CustomHeading>{t("skills")}</CustomHeading>
          </View>
        )}
      </View>

      <View style={styles.skillContainer}>{renderSkills()}</View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {canAddSkills && (
          <TouchableOpacity style={style?.addNewSkill} onPress={toggleModal}>
            <CustomHeading color={Colors?.link} fontWeight="bold">
              {t("addNewSkills")}
            </CustomHeading>
          </TouchableOpacity>
        )}

        {canAddSkills && (
          <TouchableOpacity onPress={toggleRemoveModal}>
            <CustomHeading color={Colors?.danger} fontWeight="bold">
              {t("removeSkill")}
            </CustomHeading>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Skill Modal */}
      <ModalComponent
        title={t("addNewSkills")}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        content={() => (
          <>
            <DropdownComponent
              value={selectedSkill}
              setValue={(skill: string) => handleSkillSelection(skill)}
              placeholder={t("searchAndSelectSkills")}
              options={filteredSkills}
              icon={
                <MaterialCommunityIcons
                  style={styles.icon}
                  color="black"
                  name="hammer-sickle"
                  size={30}
                />
              }
            />
            {selectedSkill && renderPriceInput()}
          </>
        )}
        primaryButton={{
          title: t("addSkill"),
          action: onAddSkills,
          disabled:
            (!skillWithPrice || !skillWithPrice.pricePerDay) &&
            role === "WORKER",
        }}
        secondaryButton={{
          action: () => setIsModalVisible(false),
        }}
      />

      {/* Remove Skill Modal */}
      <ModalComponent
        title={t("removeSkill")}
        visible={isRemoveModalVisible}
        onClose={() => setIsRemoveModalVisible(false)}
        content={() => (
          <>
            <DropdownComponent
              value={selectedSkillToRemove}
              setValue={handleSkillToRemoveSelection}
              placeholder={t("selectSkillToRemove")}
              options={selectedUserSkills}
              icon={
                <MaterialCommunityIcons
                  style={styles.icon}
                  color="black"
                  name="hammer-sickle"
                  size={30}
                />
              }
            />
          </>
        )}
        primaryButton={{
          title:
            userSkills?.length <= 1
              ? t("atLeastOneSkillRequired")
              : t("removeSkill"),
          action: onRemoveSkill,
          disabled: !selectedSkillToRemove || userSkills?.length <= 1,
        }}
        secondaryButton={{
          action: () => setIsRemoveModalVisible(false),
        }}
      />
    </View>
  );
};

export default SkillSelector;

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  skillBox: {
    backgroundColor: Colors?.white,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginVertical: 6,
  },
  highlightIcon: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
  priceInputContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  priceInput: {},
});
