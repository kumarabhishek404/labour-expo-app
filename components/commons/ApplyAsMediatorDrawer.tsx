import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Checkbox, Button } from "react-native-paper";
import { useSetAtom } from "jotai";
import Colors from "@/constants/Colors";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import { t } from "@/utils/translationHelper";
import ReusableCategoryComponent from "../inputs/CategoryButtons";
import CustomText from "./CustomText";

const ApplyAsMediatorDrawer = ({
  isDrawerVisible,
  setIsDrawerVisible,
  requirements,
  teamMembers,
  serviceId,
  applyAsMediator,
}: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedMembers, setSelectedMembers] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    if (requirements?.length > 0) {
      setSelectedSkill(requirements[0]);
    }
  }, [requirements]);

  const matchedMembers = teamMembers?.filter(
    (member: any) =>
      member.skills?.some((s: any) => s.skill === selectedSkill?.name) &&
      !Object.keys(selectedMembers).includes(member.id)
  );

  const selectedCount = Object.values(selectedMembers).filter(
    (skill) => skill === selectedSkill?.name
  ).length;
  const maxSelectable = selectedSkill?.count || 0;

  const toggleMemberSelection = (member: any) => {
    setSelectedMembers((prev) => {
      const updatedSelection = { ...prev };
      const memberId = member?._id;

      if (!memberId) {
        console.error("Error: Member ID is undefined", member);
        return prev;
      }

      if (updatedSelection[memberId]) {
        delete updatedSelection[memberId];
      } else if (selectedCount < maxSelectable) {
        updatedSelection[memberId] = selectedSkill?.name;
      }
      return updatedSelection;
    });
  };

  const handleApply = () => {
    if (Object.keys(selectedMembers).length === 0) {
      TOAST.error("Select at least one worker!");
      return;
    }
    const validWorkers = Object.keys(selectedMembers).filter(
      (workerId) => workerId !== "undefined"
    );
    if (validWorkers.length === 0) {
      TOAST.error("Invalid worker selection.");
      return;
    }
    const payload = {
      serviceId,
      workers: validWorkers,
      skills: Object.fromEntries(
        validWorkers.map((workerId) => [workerId, selectedMembers[workerId]])
      ),
    };
    applyAsMediator(payload);
  };

  useEffect(() => {
    if (isDrawerVisible) {
      setDrawerState({
        visible: true,
        title: "applyAsMediator",
        content: () => (
          <View style={{ paddingVertical: 10 }}>
            <ScrollView horizontal contentContainerStyle={styles.skillButtons}>
              {requirements?.map((skill: any, index: number) => (
                <Button
                  key={index}
                  mode={selectedSkill === skill ? "contained" : "outlined"}
                  onPress={() => setSelectedSkill(skill)}
                  buttonColor={
                    selectedSkill === skill ? Colors?.primary : Colors?.white
                  }
                >
                  <CustomText
                    color={
                      selectedSkill === skill ? Colors?.white : Colors?.primary
                    }
                    fontWeight="600"
                    style={styles.buttonItem}
                  >
                    {skill?.count} {skill?.name}
                  </CustomText>
                </Button>
              ))}
            </ScrollView>
            <ScrollView style={{ maxHeight: 300 }}>
              {matchedMembers.length > 0 ? (
                matchedMembers.map((member: any, index: number) => {
                  const isChecked = !!selectedMembers[member._id];
                  const isDisabled =
                    !isChecked && selectedCount >= maxSelectable;

                  return (
                    <TouchableOpacity
                      onPress={() => toggleMemberSelection(member)}
                      key={index}
                      style={styles.memberRow}
                    >
                      <Checkbox
                        status={isChecked ? "checked" : "unchecked"}
                        onPress={() => toggleMemberSelection(member)}
                        color={Colors.primary}
                        disabled={isDisabled}
                      />
                      <Text style={isDisabled ? styles.disabledText : {}}>
                        {member.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>
                  {t("noMembersAvailableForThisSkill")}
                </Text>
              )}
            </ScrollView>
          </View>
        ),
        primaryButton: {
          title: "apply",
          action: handleApply,
          disabled: Object.keys(selectedMembers).length === 0,
        },
        secondaryButton: {
          title: "cancel",
          action: () => setIsDrawerVisible(false),
        },
      });
    }
  }, [isDrawerVisible, selectedSkill, selectedMembers]);

  return null;
};

export default ApplyAsMediatorDrawer;

const styles = StyleSheet.create({
  skillButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  buttonItem: {
    textTransform: "capitalize",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  disabledText: {
    color: "gray",
  },
});
