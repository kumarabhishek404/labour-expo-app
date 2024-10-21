import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import Button from "../inputs/Button";
import { router } from "expo-router";
import AvatarComponent from "./Avatar";
import { dateDifference } from "@/constants/functions";
import { openGoogleMaps } from "@/app/hooks/map";

const destination = {
  latitude: 40.758896,
  longitude: -73.98513,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Highlights = ({ service }: any) => {
  return (
    <View style={styles.highlightWrapper}>
      <View
        style={{
          flexDirection: "row",
          width: "32%",
        }}
      >
        <View style={styles.highlightIcon}>
          <Ionicons name="time" size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.highlightTxt}>Duration</Text>
          <Text style={styles.highlightTxtVal}>
            {service?.duration ||
              dateDifference(service?.startDate, service?.endDate)}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "32%",
        }}
      >
        <View style={styles.highlightIcon}>
          <FontAwesome name="users" size={18} color={Colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.highlightTxt}>Travelling</Text>
          <Text style={styles.highlightTxtVal}>Yes</Text>
        </View>
      </View>

      {service?.location && service?.location?.latitude && (
        <View
          style={{
            flexDirection: "column",
            width: "32%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.highlightIcon}>
              <FontAwesome5
                name="rupee-sign"
                size={18}
                color={Colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.highlightTxt}>Distance</Text>
              <Text style={styles.highlightTxtVal}>Just 2 Kms</Text>
            </View>
          </View>
          <Button
            isPrimary={false}
            title="Get Direction"
            onPress={() => openGoogleMaps(destination)}
            // icon={
            //   <FontAwesome
            //     name="users"
            //     size={12}
            //     color={Colors.primary}
            //   />
            // }
            style={{
              marginTop: 6,
              borderWidth: 1.5,
              paddingVertical: 3,
              paddingHorizontal: 6,
            }}
            textStyle={{
              fontWeight: "700",
              fontSize: 12,
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  highlightWrapper: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
  },
  highlightIcon: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 5,
    alignItems: "center",
    height: 30,
  },
  highlightTxt: {
    fontSize: 12,
    color: "#999",
  },
  highlightTxtVal: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
  },
  getDirectionText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 10,
    textAlign: "left",
  },
});

export default Highlights;
