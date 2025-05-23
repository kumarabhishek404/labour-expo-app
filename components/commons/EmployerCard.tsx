import Colors from "@/constants/Colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import CustomHeading from "./CustomHeading";
import CustomText from "./CustomText";
import { t } from "@/utils/translationHelper";
import ProfilePicture from "./ProfilePicture";

const EmployerCard = ({ employer }: any) => {
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
        <View
          style={{ width: "60%", gap: 10, justifyContent: "space-between" }}
        >
          <View style={{ gap: 2 }}>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("name")} :{" "}
              </CustomText>
              {employer?.name}
            </CustomText>
            <CustomText textAlign="left">
              <CustomText style={styles?.employerLabel}>
                {t("address")} :{" "}
              </CustomText>
              {employer?.address}
            </CustomText>
          </View>

          <View style={{ gap: 10 }}>
            <Button
              isPrimary={false}
              title={t("employerDetails")}
              onPress={() =>
                router.push({
                  pathname: "/screens/users/[id]",
                  params: {
                    id: employer?._id,
                    role: "employers",
                    title: "employerDetails",
                    type: "details",
                  },
                })
              }
              icon={<AntDesign name="eye" size={18} color={Colors.primary} />}
              style={{
                minHeight: 30,
                paddingVertical: 6,
              }}
              textStyle={{
                marginLeft: 6,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: "auto",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 10,
          }}
        >
          <ProfilePicture
            uri={employer?.profilePicture}
            style={{ width: 90, height: 90, marginLeft: 10 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  employerContainer: {
    marginVertical: 10,
    borderRadius: 8,
  },
  card: {
    backgroundColor: Colors?.white,
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

export default EmployerCard;
