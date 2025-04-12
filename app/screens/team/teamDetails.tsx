import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { router } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";

const TeamDetails = ({ type, mediatorId, teamDetails, isInYourTeam }: any) => {
  return (
    <>
      {type === "WORKER" ? (
        <View
          style={[
            styles.row,
            {
              backgroundColor: isInYourTeam ? Colors?.success : Colors?.danger,
            },
          ]}
        >
          <CustomHeading baseFont={16} fontWeight="bold" color={Colors?.white}>
            {isInYourTeam
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
                baseFont={16}
                fontWeight="bold"
                color={Colors?.white}
              >
                {t("team")}
              </CustomHeading>
              <CustomText color={Colors?.white}>
                ({t(teamDetails?.status?.toLowerCase())})
              </CustomText>
            </View>
            <CustomText color={Colors?.white}>
              {teamDetails?.memberCount || 0} {t("members")}
            </CustomText>
          </View>
          {teamDetails?.memberCount > 0 && (
            <Button
              isPrimary={false}
              style={{ minHeight: 30 }}
              title={t("viewAllMembers")}
              onPress={() =>
                router?.push({
                  pathname: "/screens/team/[id]",
                  params: {
                    id: mediatorId,
                    role: "mediator",
                    title: t("teamMembers"),
                    type: "details",
                  },
                })
              }
            />
          )}
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
    marginTop: 5,
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
