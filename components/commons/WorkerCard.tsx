import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import AvatarComponent from "./Avatar";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";

const WorkerCard = ({ worker }: any) => {
  return (
    <View style={[styles.employerContainer]}>
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
            <CustomHeading textAlign="left">{t("worker")}</CustomHeading>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("name")} :{" "}
              </CustomText>
              {worker?.name}
            </CustomText>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("address")} :{" "}
              </CustomText>
              {worker?.address}
            </CustomText>
          </View>

          <Button
            isPrimary={false}
            title={t("callWorker")}
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
            title={t("messageEmployer")}
            onPress={() => {}}
            icon={
              <FontAwesome5 name="whatsapp" size={18} color={Colors.primary} />
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
            profileImage={worker?.profilePicture}
          />
          <Button
            isPrimary={true}
            title={t("viewDetails")}
            onPress={() =>
              router.push({
                pathname: "/screens/users/[id]",
                params: {
                  id: worker?._id,
                  role: "employers",
                  title: "employerDetails",
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
  employerContainer: {
    backgroundColor: "#e1e8e5",
    marginHorizontal: 10,
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
});

export default WorkerCard;
