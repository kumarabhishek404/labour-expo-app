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
import CustomSegmentedButton from "@/app/screens/bottomTabs/(user)/bookingsAndRequests/customTabs";
import { set } from "lodash";
import { getDynamicWorkerType } from "@/utils/i18n";
import { translateWorkerTypes } from "@/constants/functions";

const AddSkillDrawer = ({
  isDrawerVisible,
  setIsDrawerVisible,
  filteredSkills,
}: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [skillWithPrice, setSkillWithPrice] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [role, setRole] = useState("worker");

  const TABS: any = [
    { value: "worker", label: "worker" },
    { value: "mediator", label: "mediator" },
  ];

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skill: any) => USER?.updateSkills({ skill: skill }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails((prev: any) => ({
        ...prev,
        skills: user?.skills,
      }));
      TOAST?.success(t("skillsAddedSuccessfully"));
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
      console.log("Skiiiiii-", skillWithPrice);
      const payload =
        role === "worker" ? skillWithPrice : { skill: selectedSkill };
      await mutationAddSkills.mutateAsync(payload, {
        onSuccess: () => {
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

  const onCatChanged = (category: string) => {
    setRole(category);
    setSelectedSkill(null);
    setSkillWithPrice(null);
  };

  useEffect(() => {
    if (isDrawerVisible) {
      setDrawerState({
        visible: true,
        title: "addAtLeastOneSkillApplyServices",
        content: () => (
          <View style={{ paddingVertical: 10 }}>
            <CustomSegmentedButton
              buttons={TABS}
              selectedTab={role}
              onValueChange={onCatChanged}
            />
            <PaperDropdown
              name="addSkill"
              label="selectSkill"
              selectedValue={
                selectedSkill ? getDynamicWorkerType(selectedSkill, 1) : ""
              }
              onSelect={(skill: string) => handleSkillSelection(skill)}
              searchEnabled
              placeholder={t("searchAndSelectSkills")}
              options={filteredSkills ?? translateWorkerTypes(WORKERTYPES)}
              icon={
                <MaterialCommunityIcons
                  style={styles.icon}
                  color="black"
                  name="hammer-sickle"
                  size={30}
                />
              }
            />
            {selectedSkill && role === "worker" && renderPriceInput()}
          </View>
        ),
        primaryButton: {
          title: "addSkill",
          action: onAddSkills,
          disabled:
            role === "worker"
              ? !skillWithPrice || !skillWithPrice?.pricePerDay
              : !selectedSkill,
        },
        secondaryButton: {
          title: "cancel",
          action: () => {
            setIsDrawerVisible(false);
            setSelectedSkill(null);
            setSkillWithPrice(null);
            setDrawerState({ visible: false });
          },
        },
      });
    }
  }, [isDrawerVisible, role, selectedSkill, skillWithPrice]); // Re-run when drawer visibility or inputs change

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
