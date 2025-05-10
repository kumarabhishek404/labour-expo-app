import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import AvatarComponent from "./Avatar";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import Loader from "./Loaders/Loader";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import ModalComponent from "./Modal";
import WORKER from "@/app/api/workers";
import { handleCall } from "@/constants/functions";
import Atoms from "@/app/AtomStore";
import { useAtomValue } from "jotai";

const TeamAdminCard = ({ admin }: any) => {
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [isModalVisible, setModalVisible] = useState(false);

  const mutationLeaveTeam = useMutation({
    mutationKey: ["leaveTeam"],
    mutationFn: (payload: any) => WORKER?.leftTeam(payload),
    onSuccess: (response) => {
      setModalVisible(false);
      TOAST?.success(t("leftTeamSuccessfully"));
      refreshUser();
    },
    onError: (error) => {
      setModalVisible(false);
      TOAST?.error(error?.message || "An error occurred while leaving team");
    },
  });

  const modalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading baseFont={34}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading baseFont={20}>
          {t("leaveThisTeamQuestion")}
        </CustomHeading>
        <CustomText baseFont={14}>{t("leaveThisTeamSubHeading")}</CustomText>
        <CustomText>{t("leaveThisTeamSubText")}</CustomText>
      </View>
    );
  };

  return (
    <View style={styles.teamAdminContainer}>
      <Loader loading={mutationLeaveTeam.isPending} />
      <ModalComponent
        visible={isModalVisible}
        title={t("leaveTeam")}
        onClose={() => setModalVisible(false)}
        content={modalContent}
        primaryButton={{
          title: t("leave"),
          action: () => mutationLeaveTeam.mutate({}),
          styles: {
            backgroundColor: Colors.primary,
            borderColor: Colors.primary,
          },
        }}
        secondaryButton={{
          title: t("cancel"),
          action: () => setModalVisible(false),
          styles: {
            paddingHorizontal: 10,
          },
        }}
      />
      <View
        style={[
          styles.card,
          {
            marginBottom: 0,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 6,
          },
        ]}
      >
        <View style={{ width: "60%", gap: 10 }}>
          <View style={{ gap: 2 }}>
            <CustomHeading textAlign="left">{t("teamAdmin")}</CustomHeading>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("name")} :{" "}
              </CustomText>
              {admin?.name}
            </CustomText>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("address")} :{" "}
              </CustomText>
              {admin?.address}
            </CustomText>
          </View>

          {userDetails?.status === "ACTIVE" && (
            <>
              <Button
                isPrimary={false}
                title={t("callTeamAdmin")}
                onPress={() => handleCall(admin?.mobile)}
                icon={
                  <FontAwesome5
                    name="phone-alt"
                    size={16}
                    color={Colors.primary}
                  />
                }
                style={{
                  minHeight: 35,
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                }}
                textStyle={{
                  marginLeft: 6,
                  fontSize: 12,
                }}
              />

              <Button
                isPrimary={false}
                title={t("leaveTeam")}
                onPress={() => setModalVisible(true)}
                icon={
                  <MaterialCommunityIcons
                    name="exit-run"
                    size={18}
                    color={Colors.primary}
                  />
                }
                style={{
                  minHeight: 35,
                  paddingVertical: 6,
                  paddingHorizontal: 6,
                }}
                textStyle={{
                  marginLeft: 6,
                  fontSize: 12,
                }}
              />
            </>
          )}
        </View>
        <View
          style={{
            width: "auto",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <AvatarComponent
            isEditable={false}
            profileImage={admin?.profilePicture}
            avatarWrapperStyle={{ width: 100, height: 100 }}
          />
          {userDetails?.status === "ACTIVE" && (
            <Button
              isPrimary={true}
              title={t("viewDetails")}
              onPress={() =>
                router.push({
                  pathname: "/screens/users/[id]",
                  params: {
                    id: admin?._id,
                    role: admin?.role,
                    title: "teamAdminDetails",
                    type: "details",
                  },
                })
              }
              icon={<AntDesign name="eye" size={18} color={Colors.white} />}
              style={{
                minHeight: 35,
                paddingVertical: 6,
                paddingHorizontal: 6,
              }}
              textStyle={{
                marginLeft: 6,
                fontSize: 12,
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  teamAdminContainer: {
    margin: 20,
    backgroundColor: "#e1e8e5",
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#e1e8e5",
    padding: 15,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors?.black,
    textTransform: "capitalize",
  },
  employerLabel: {
    color: "#615d5d",
    fontWeight: "600",
  },
  modalView: {
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#FFD700", // Yellow circle
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TeamAdminCard;
