import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import AvatarComponent from "./Avatar";

const EmployerCard = ({ service }: any) => {
  return (
    <View
      style={[
        styles.employerContainer,
        {
          marginVertical: 10,
          marginHorizontal: 10,
        },
      ]}
    >
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
            <Text style={[styles.title, { marginBottom: 10 }]}>Employer</Text>
            <Text style={{ fontSize: 13, fontWeight: "500" }}>
              <Text style={styles?.employerLabel}>Name : </Text>
              {service?.employer?.firstName} {service?.employer?.lastName}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "500" }}>
              <Text style={styles?.employerLabel}>Address : </Text>
              {service?.employer?.address}
            </Text>
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
            title="Whatsapp Message"
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
            profileImage={service?.employer?.profilePicture}
          />
          <Button
            isPrimary={true}
            title="View Details"
            onPress={() =>
              router.push(`/screens/employer/${service?.employer?._id}`)
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
    marginVertical: 10,
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
    fontSize: 12,
    color: "#615d5d",
    fontWeight: "600",
  },
});

export default EmployerCard;
