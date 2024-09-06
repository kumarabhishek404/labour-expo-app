import React from "react";
import { View, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { useStateContext } from "../context/context";

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import Share from 'react-native-share';

// import files from '../assets/filesBase64';

const ProfileScreen = () => {
  const { state, dispatch }: any = useStateContext();
  const myCustomShare = async () => {
    // const shareOptions = {
    //   message: 'Order your next meal from FoodFinder App. I\'ve already ordered more than 10 meals on it.',
    //   url: files.appLogo,
    //   // urls: [files.image1, files.image2]
    // }
    // try {
    //   const ShareResponse = await Share.open(shareOptions);
    //   console.log(JSON.stringify(ShareResponse));
    // } catch(error) {
    //   console.log('Error => ', error);
    // }
  };

  const handleLogout = () => {
    console.log("Logout button pressed");
    dispatch({ type: "LOGOUT"});
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <Avatar.Image
            source={{
              uri: "https://xsgames.co/randomusers/avatar.php?g=female",
            }}
            size={80}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              Joe Jane
            </Title>
            <Caption style={styles.caption}>@joe_jane</Caption>
          </View>
        </View>
      </View>
      <View style={styles.userInfoTextWrapper}>
        <View style={styles.userInfoText}>
          <View style={[styles.row, styles.firstBox]}>
            <Text style={{ color: "#777777" }}>
              Balipur Shakarauli Etah Uttar Predesh, India
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: "#777777" }}>+91-6397308499</Text>
          </View>
          <View style={[styles.row, styles.lastBox]}>
            <Text style={{ color: "#777777" }}>abhishek@kaamdekho.com</Text>
          </View>
        </View>
      </View>

      <Text style={styles.workInfoHeading}>Wallet</Text>
      <View style={styles.infoBoxWrapper}>
        <View
          style={[
            styles.infoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>₹140.50</Title>
          <Caption>Earnings</Caption>
        </View>
        <View style={styles.infoBox}>
          <Title>₹50.50</Title>
          <Caption>Rewards</Caption>
        </View>
      </View>

      <Text style={styles.workInfoHeading}>Work Information</Text>
      <View style={styles.workInfoWrapper}>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>20</Title>
          <Caption>Tasks</Caption>
        </View>
        <View
          style={[
            styles.workInfoBox,
            {
              borderRightColor: "#dddddd",
              borderRightWidth: 1,
            },
          ]}
        >
          <Title>12</Title>
          <Caption>Completed</Caption>
        </View>
        <View style={styles.workInfoBox}>
          <Title>8</Title>
          <Caption>Pending</Caption>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <Link href="/favourite" asChild>
          <TouchableRipple>
            <View style={styles.menuItem}>
              <MaterialIcons
                name="space-dashboard"
                size={28}
                color={Colors.primary}
              />
              <Text style={styles.menuItemText}>Your Favorites</Text>
            </View>
          </TouchableRipple>
        </Link>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <MaterialIcons
              name="payment"
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.menuItemText}>Payment</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={myCustomShare}>
          <View style={styles.menuItem}>
            <MaterialIcons name="share" size={28} color={Colors.primary} />
            <Text style={styles.menuItemText}>Tell Your Friends</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <MaterialIcons
              name="support-agent"
              size={28}
              color={Colors.primary}
            />
            <Text style={styles.menuItemText}>Support</Text>
          </View>
        </TouchableRipple>
        <Link href="/settings" asChild>
          <TouchableRipple>
            <View style={styles.menuItem}>
              <Ionicons name="settings" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>
        </Link>
        <TouchableRipple onPress={handleLogout}>
            <View style={styles.menuItem}>
              <Ionicons name="settings" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  userInfoTextWrapper: {
    // width: '100%',
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  userInfoText: {
    // width: '90%',
    // borderRadius: 16,
    padding: 15,
    marginLeft: -20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  row: {
    padding: 12,
    backgroundColor: Colors.white,
    flexDirection: "row",
    marginBottom: 5,
  },
  firstBox: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
  lastBox: {
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  infoBoxWrapper: {
    marginTop: 10,
    marginBottom: 20,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  workInfoHeading: {
    color: Colors.primary,
    marginLeft: 30,
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 26,
  },
  workInfoWrapper: {
    marginTop: 10,
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    height: 100,
    display: "flex",
    flexDirection: "row",
  },
  workInfoBox: {
    width: "33%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#000000",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
