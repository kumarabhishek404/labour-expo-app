import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import TextInputComponent from "../inputs/TextInputWithIcon";
import { WORKERTYPES } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import { useAtom, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import Loader from "./Loaders/Loader";
import PaperDropdown from "../inputs/Dropdown";

const AddSkillDrawer = ({ isDrawerVisible, setIsDrawerVisible }: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [skillWithPrice, setSkillWithPrice] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skill: any) => USER?.updateSkills({ skill: skill }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails({ ...userDetails, skills: user?.skills });
      TOAST?.showToast?.success(t("skillsAddedSuccessfully"));
      console.log("Response while adding new skills in a worker - ", response);
    },
    onError: (err) => {
      console.error("error while adding new skills in a worker ", err);
    },
  });

  const handleSkillSelection = (skill: string) => {
    setSelectedSkill(skill);
  };

  const handlePriceChange = (price: string) => {
    setSkillWithPrice({
      skill: selectedSkill,
      pricePerDay: parseInt(price, 10),
    });
  };

  const onAddSkills = async () => {
    try {
      if (!skillWithPrice || !skillWithPrice.pricePerDay) {
        console.log("Please enter both skill and price.");
        return;
      }

      await mutationAddSkills.mutateAsync(skillWithPrice, {
        onSuccess: () => {
          console.log(
            "Skill added successfully:",
            skillWithPrice,
            selectedSkill
          );
          setDrawerState({ visible: false });
          setIsDrawerVisible(false);
          setSelectedSkill(null);
          setSkillWithPrice(null);
        },
        onError: (err) => {
          console.error("Error adding skill:", err);
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

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

  useEffect(() => {
    if (isDrawerVisible) {
      setDrawerState({
        visible: true,
        title: "Add at least one skill to apply in services",
        content: () => (
          <View style={{ paddingVertical: 20 }}>
            <PaperDropdown
              name="addSkill"
              label="selectSkill"
              selectedValue={selectedSkill}
              onSelect={(skill: string) => handleSkillSelection(skill)}
              translationEnabled
              placeholder="searchAndSelectSkills"
              options={WORKERTYPES}
              // errors={errors}
              search={false}
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
          title: t("addSkill"),
          action: onAddSkills,
          disabled: !skillWithPrice || !skillWithPrice.pricePerDay,
        },
        secondaryButton: {
          title: t("cancel"),
          action: () => {
            setIsDrawerVisible(false);
            setDrawerState({ visible: false });
          },
        },
      });
    }
  }, [isDrawerVisible, selectedSkill, skillWithPrice]); // Re-run when drawer visibility or inputs change

  return <Loader loading={mutationAddSkills?.isPending} />; // Component does not return UI directly
};

export default AddSkillDrawer;

const styles = StyleSheet.create({
  container: {},
  skillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
    paddingHorizontal: 5,
    paddingVertical: 10,
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
