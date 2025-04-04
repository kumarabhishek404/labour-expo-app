import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { getWorkLabel, removeEmptyStrings } from "@/constants/functions";
import CustomText from "./CustomText";
import CustomHeading from "./CustomHeading";
import { t } from "@/utils/translationHelper";
import TextInputComponent from "../inputs/TextInputWithIcon";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import PaperDropdown from "../inputs/Dropdown";
import AddSkillDrawer from "./AddSkillModal";
interface SkillSelectorProps {
  canAddSkills: boolean;
  isShowLabel?: boolean;
  style?: any;
  tagStyle?: any;
  tagTextStyle?: any;
  userSkills: Array<string>;
  availableSkills: any;
  handleAddSkill?: any;
  handleRemoveSkill?: any;
  count?: number;
}

const SkillSelector = ({
  canAddSkills,
  isShowLabel,
  style,
  tagStyle,
  tagTextStyle,
  userSkills,
  availableSkills,
  handleAddSkill,
  handleRemoveSkill,
  count,
}: SkillSelectorProps) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [isAddSkill, setIsAddSkill] = useState(false);
  const [selectedSkillToRemove, setSelectedSkillToRemove] = useState<
    string | null
  >(null);

  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [selectedUserSkills, setSelectedUserSkills] = useState<any[]>([]);

  useEffect(() => {
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

  const handleSkillToRemoveSelection = (skill: string) => {
    setSelectedSkillToRemove(skill);
  };

  useEffect(() => {
    if (!selectedSkillToRemove) return;

    setDrawerState({
      visible: true,
      title: "removeSkill",
      content: () => (
        <View style={{ paddingVertical: 20 }}>
          <PaperDropdown
            name="removeSkill"
            label="removeSkill"
            selectedValue={selectedSkillToRemove}
            onSelect={(skill: string) => handleSkillToRemoveSelection(skill)}
            placeholder="selectSkillToRemove"
            options={selectedUserSkills}
            search={false}
            translationEnabled
            searchEnabled
            icon={
              <MaterialCommunityIcons
                style={styles.icon}
                color="black"
                name="hammer-sickle"
                size={30}
              />
            }
          />
        </View>
      ),
      primaryButton: {
        title: "removeSkill",
        action: onRemoveSkill,
        disabled: !selectedSkillToRemove || userSkills?.length <= 1,
      },
      secondaryButton: {
        title: "cancel",
        action: () => {
          setDrawerState({ visible: false });
        },
      },
    });
  }, [selectedSkillToRemove]);

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
                  {item?.pricePerDay ? (
                    <CustomText textAlign="left" style={tagTextStyle}>
                      {`${getWorkLabel(availableSkills, item?.skill)} - ${t(
                        "rs"
                      )} ${item?.pricePerDay} / ${t("perDay")}`}
                    </CustomText>
                  ) : (
                    <CustomText style={tagTextStyle}>
                      {`${getWorkLabel(availableSkills, item?.skill)}`}
                    </CustomText>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <CustomText baseFont={14}>{t("noSkillsFound")}</CustomText>
        )}
      </>
    );
  };

  const handleOpenRemoveSkillDrawer = () => {
    setDrawerState({
      visible: true,
      title: "removeSkill",
      content: () => (
        <View style={{ paddingVertical: 20 }}>
          <PaperDropdown
            name="removeSkill"
            label="removeSkill"
            selectedValue={selectedSkillToRemove}
            onSelect={(skill: string) => handleSkillToRemoveSelection(skill)}
            placeholder="selectSkillToRemove"
            options={selectedUserSkills}
            search={false}
            searchEnabled
            translationEnabled
            icon={
              <MaterialCommunityIcons
                style={styles.icon}
                color="black"
                name="hammer-sickle"
                size={30}
              />
            }
          />
        </View>
      ),
      primaryButton: {
        title: "removeSkill",
        action: onRemoveSkill,
        disabled: !selectedSkillToRemove,
      },
      secondaryButton: {
        title: "cancel",
        action: () => {
          setDrawerState({ visible: false });
        },
      },
    });
  };

  const onRemoveSkill = async () => {
    try {
      if (!selectedSkillToRemove) {
        console.log("Please enter a skill.");
        return;
      }

      await handleRemoveSkill(selectedSkillToRemove, {
        onSuccess: () => {
          console.log("Skill removed successfully:", selectedSkillToRemove);
          setDrawerState({ visible: false });
          setSelectedSkillToRemove(null);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <>
      <View style={[styles.container, style]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {isShowLabel && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <View style={styles.highlightIcon}>
                <FontAwesome name="users" size={14} color={Colors.primary} />
              </View>
              <CustomHeading>{t("skills")}</CustomHeading>
            </View>
          )}
        </View>

        <View style={styles.skillContainer}>{renderSkills()}</View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {canAddSkills && (
            <TouchableOpacity
              style={style?.addNewSkill}
              onPress={() => setIsAddSkill(true)}
            >
              <CustomHeading color={Colors?.link} fontWeight="bold">
                {t("addNewSkills")}
              </CustomHeading>
            </TouchableOpacity>
          )}

          {canAddSkills && (
            <TouchableOpacity onPress={handleOpenRemoveSkillDrawer}>
              <CustomHeading color={Colors?.danger} fontWeight="bold">
                {t("removeSkill")}
              </CustomHeading>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <AddSkillDrawer
        isDrawerVisible={isAddSkill}
        setIsDrawerVisible={setIsAddSkill}
        filteredSkills={filteredSkills}
      />
    </>
  );
};

export default SkillSelector;

const styles = StyleSheet.create({
  container: {},
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
    backgroundColor: Colors?.white,
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
