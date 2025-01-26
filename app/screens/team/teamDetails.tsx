import Atoms from "@/app/AtomStore";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";
import { useAtomValue } from "jotai";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TeamDetails = ({ type, user }: any) => {
  const userDetails = useAtomValue(Atoms?.UserAtom);
  console.log("user", user?.employedBy, userDetails?._id);
  return (
    <>
      {type === "WORKER" ? (
        <View
          style={[
            styles.row,
            {
              backgroundColor:
                user?.employedBy === userDetails?._id
                  ? Colors?.success
                  : Colors?.danger,
            },
          ]}
        >
          <CustomHeading fontSize={16} fontWeight="bold" color={Colors?.white}>
            {user?.employedBy === userDetails?._id
              ? t("alreadyJoinedInYourTeam")
              : t("alreadyJoinedTeam")}
          </CustomHeading>
        </View>
      ) : (
        <View style={styles.row}>
          <View style={styles.teamTextWrapper}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CustomHeading
                fontSize={16}
                fontWeight="bold"
                color={Colors?.white}
              >
                {t("team")}
              </CustomHeading>
              <CustomText color={Colors?.white}>
                ({t(user?.teamDetails?.status)})
              </CustomText>
            </View>
            <CustomText color={Colors?.white}>
              {user?.teamDetails?.memberCount || 0} {t("members")}
            </CustomText>
          </View>
          <Button
            isPrimary={false}
            title={t("viewAllMembers")}
            onPress={() =>
              router?.push({
                pathname: "/screens/team/[id]",
                params: {
                  id: user?._id,
                  role: "mediator",
                  title: t("teamMembers"),
                  type: "details",
                },
              })
            }
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 12,
    backgroundColor: Colors?.primary,
    borderRadius: 8,
  },
  teamTextWrapper: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default TeamDetails;
