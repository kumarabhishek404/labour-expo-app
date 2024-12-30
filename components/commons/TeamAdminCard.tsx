import Colors from "@/constants/Colors";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router, useFocusEffect } from "expo-router";
import AvatarComponent from "./Avatar";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { leaveTeam } from "@/app/api/user";
import { toast } from "@/app/hooks/toast";
import Loader from "./Loader";
import { useRefreshUser } from "@/app/hooks/useRefreshUser";
import { useAtom } from "jotai";
import { UserAtom } from "@/app/AtomStore/user";
import ModalComponent from "./Modal";
import { getUserById } from "@/app/api/user";

const TeamAdminCard = ({ admin }: any) => {
  const [userDetails] = useAtom(UserAtom);
  const { refreshUser } = useRefreshUser();
  const [isModalVisible, setModalVisible] = useState(false);
  const [adminDetails, setAdminDetails] = useState<any>(null);

  const {
    isLoading,
    data: response,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["adminDetails", admin],
    queryFn: () => getUserById(admin),
    retry: 0,
    enabled: !!admin,
  });

  const mutationLeaveTeam = useMutation({
    mutationKey: ["leaveTeam"],
    mutationFn: () => leaveTeam(),
    onSuccess: (response) => {
      setModalVisible(false);
      toast.success(t("leftTeamSuccessfully"));
      refreshUser();
    },
    onError: (error) => {
      setModalVisible(false);
      toast.error(error?.message || "An error occurred while leaving team");
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = setAdminDetails(response?.data);
      return () => unsubscribe;
    }, [response])
  );

  console.log("admin", adminDetails, response);

  const modalContent = () => {
    return (
      <View style={styles.modalView}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <CustomHeading fontSize={34}>?</CustomHeading>
          </View>
        </View>
        <CustomHeading fontSize={20}>
          {t("leaveThisTeamQuestion")}
        </CustomHeading>
        <CustomText fontSize={14}>{t("leaveThisTeamSubHeading")}</CustomText>
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
          action: () => mutationLeaveTeam.mutate(),
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
              {adminDetails?.firstName} {adminDetails?.lastName}
            </CustomText>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("address")} :{" "}
              </CustomText>
              {adminDetails?.address}
            </CustomText>
          </View>

          <Button
            isPrimary={false}
            title="Dial Phone"
            onPress={() => {}}
            icon={
              <FontAwesome5 name="phone-alt" size={16} color={Colors.primary} />
            }
            style={{
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
            title="Leave Team"
            onPress={() => setModalVisible(true)}
            icon={
              <MaterialCommunityIcons
                name="exit-run"
                size={18}
                color={Colors.primary}
              />
            }
            style={{
              paddingVertical: 6,
              paddingHorizontal: 6,
            }}
            textStyle={{
              marginLeft: 6,
              fontSize: 12,
            }}
          />
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
            profileImage={adminDetails?.profilePicture}
          />
          <Button
            isPrimary={true}
            title={t("viewDetails")}
            onPress={() =>
              router.push({
                pathname: "/screens/users/[id]",
                params: {
                  id: adminDetails?._id,
                  role: adminDetails?.role,
                  title: t("teamAdminDetails"),
                  type: "details",
                },
              })
            }
            icon={<AntDesign name="eye" size={18} color={Colors.white} />}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 6,
            }}
            textStyle={{
              marginLeft: 6,
              fontSize: 12,
            }}
          />
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
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
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
