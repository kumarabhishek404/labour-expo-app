import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import {
  Entypo,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import profileImage from "../../assets/person-placeholder.jpg";

const SelectedApplicants = ({ applicants }: any) => {
  return (
    <View style={styles.applicantContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.applicantHeader}>Selected Worker</Text>
        {/* <Button
          style={{
            paddingVertical: 2,
            paddingHorizontal: 8,
            marginLeft: 4,
            backgroundColor: Colors?.primary,
            borderColor: Colors?.primary,
          }}
          textStyle={{
            fontSize: 14,
          }}
          icon={
            <Entypo
              name="check"
              size={16}
              color="white"
              style={{ marginRight: 4 }}
            />
          }
          isPrimary={true}
          title="Complete Service"
          onPress={() => {}}
        /> */}
      </View>
      {applicants?.pages[0]?.data?.map((item: any, index: number) => {
        return (
          <View key={index} style={styles.productCard}>
            <Image
              source={
                item.profilePicture
                  ? { uri: item.profilePicture }
                  : profileImage
              }
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <View style={styles?.titleContainer}>
                <View style={{ gap: 2, marginBottom: 4 }}>
                  <Text style={styles.productTitle}>
                    {item.firstName} {item.lastName}
                  </Text>
                  <Text style={styles.caption}>
                    {item?.role === "WORKER" ? "WORKER" : "MEDIATOR"}
                  </Text>
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    <Button
                      style={{
                        paddingVertical: 3,
                        paddingHorizontal: 6,
                        marginLeft: 4,
                        backgroundColor: Colors?.primary,
                        borderColor: Colors?.primary,
                      }}
                      textStyle={{
                        fontSize: 14,
                      }}
                      icon={
                        <FontAwesome
                          name="phone"
                          size={16}
                          color="white"
                          style={{ marginRight: 6 }}
                        />
                      }
                      isPrimary={true}
                      title="Call"
                      onPress={() => {}}
                    />
                  </View>
                  <Button
                    style={{
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      marginLeft: 4,
                      backgroundColor: Colors?.danger,
                      borderColor: Colors?.danger,
                    }}
                    textStyle={{
                      fontSize: 14,
                    }}
                    icon={
                      <FontAwesome
                        name="remove"
                        size={14}
                        color="white"
                        style={{ marginRight: 4 }}
                      />
                    }
                    isPrimary={true}
                    title="Remove"
                    onPress={() => {}}
                  />
                </View>
              </View>

              <View style={styles.recommendationContainer}>
                <MaterialCommunityIcons
                  name="hammer-sickle"
                  size={16}
                  color="gray"
                />
                <Text style={styles.recommendationText}>
                  {item.skills.join(", ") || "Labour, Mistri, Plumber"}
                </Text>
              </View>
              <View style={styles.recommendationContainer}>
                <Ionicons name="location" size={16} color="gray" />
                <Text style={styles.recommendationText}>
                  {item.address || "Balipur, Shakarauli, Jalesar Etah"}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  applicantList: {
    display: "flex",
  },
  applicantContainer: {
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  applicantHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    borderColor: "gray",
    borderWidth: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 2,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  recommendationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationText: {
    marginLeft: 5,
    fontSize: 12,
    color: "gray",
    flex: 1,
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 100,
    padding: 2,
    borderRadius: 30,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#d6ecdd",
  },
});

export default SelectedApplicants;
