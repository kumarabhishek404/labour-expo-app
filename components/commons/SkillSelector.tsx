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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRemoveModalVisible, setIsRemoveModalVisible] = useState(false);
  const [skillWithPrice, setSkillWithPrice] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
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

  useEffect(() => {
    if (!selectedSkill && !skillWithPrice) return;

    setDrawerState({
      visible: true,
      title: "addNewSkills",
      content: () => (
        <View style={{ paddingVertical: 20 }}>
          <PaperDropdown
            name="addSkill"
            label="selectSkill"
            selectedValue={selectedSkill}
            onSelect={(skill: string) => handleSkillSelection(skill)}
            placeholder="searchAndSelectSkills"
            options={filteredSkills}
            search={false}
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
          {selectedSkill && renderPriceInput()}
        </View>
      ),
      primaryButton: {
        title: "addSkill",
        action: onAddSkills,
        disabled: !skillWithPrice || !skillWithPrice.pricePerDay,
      },
      secondaryButton: {
        title: "cancel",
        action: () => {
          setDrawerState({ visible: false });
        },
      },
    });
  }, [selectedSkill, skillWithPrice]);

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

  const renderPriceInput = () => {
    return (
      <View style={styles.priceInputContainer}>
        <TextInputComponent
          label="enterPricePerDay"
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

        {count && count < userSkills?.length && (
          <CustomText color={Colors?.link} baseFont={18}>
            ...
          </CustomText>
        )}
      </>
    );
  };

  const handleOpenSkillDrawer = () => {
    setDrawerState({
      visible: true,
      title: "addNewSkills",
      content: () => (
        <View style={{ paddingVertical: 20 }}>
          {/* Skill Selection Dropdown */}
          <PaperDropdown
            name="addSkill"
            label="selectSkill"
            selectedValue={selectedSkill}
            onSelect={(skill: string) => handleSkillSelection(skill)}
            placeholder="searchAndSelectSkills"
            options={filteredSkills}
            search={false}
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
          {/* Render Price Input Only if Skill is Selected */}
          {selectedSkill && renderPriceInput()}
        </View>
      ),
      primaryButton: {
        title: "addSkill",
        action: onAddSkills,
        disabled: !selectedSkillToRemove || userSkills?.length <= 1,
      },
      secondaryButton: {
        title: "cancel",
        action: () => {
          setDrawerState({ visible: false });
        },
      },
    });
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
        action: onAddSkills,
        disabled: !skillWithPrice || !skillWithPrice.pricePerDay,
      },
      secondaryButton: {
        title: "cancel",
        action: () => {
          setDrawerState({ visible: false });
        },
      },
    });
  };

  const onAddSkills = async () => {
    try {
      if (!skillWithPrice || !skillWithPrice.pricePerDay) {
        console.log("Please enter both skill and price.");
        return;
      }

      await handleAddSkill(skillWithPrice, {
        onSuccess: () => {
          console.log(
            "Skill added successfully:",
            skillWithPrice,
            selectedSkill
          );
          setDrawerState({ visible: false });
          setSelectedSkill(null);
          setSkillWithPrice(null);
        },
        onError: (err: any) => {
          console.error("Error adding skill:", err);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
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
        onError: (err: any) => {
          console.error("Error while remove the skill:", err);
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
            paddingHorizontal: 5,
          }}
        >
          {canAddSkills && (
            <TouchableOpacity
              style={style?.addNewSkill}
              onPress={handleOpenSkillDrawer}
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
    paddingHorizontal: 5,
    paddingVertical: 10,
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
