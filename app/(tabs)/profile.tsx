import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import { UserAtom } from "../AtomStore/user";
import { useAtom, useAtomValue } from "jotai";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [email, setEmail] = useState(userDetails?.email);
  const [address, setAddress] = useState(userDetails?.address);
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
    setUserDetails({
      isAuth: false,
    });
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
    setIsEditProfile(true);
  };

  const handleSaveProfile = () => {
    setIsEditProfile(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Profile",
          // headerTintColor: Colors.white,
          // headerStyle: {
          //   backgroundColor: Colors.primary,
          // },
          // headerLeft: () => (
          //   <TouchableOpacity
          //     onPress={() => router.back()}
          //     style={{
          //       marginLeft: 20,
          //       backgroundColor: Colors.white,
          //       padding: 6,
          //       borderRadius: 6,
          //       shadowColor: "#171717",
          //       shadowOffset: { width: 2, height: 4 },
          //       shadowOpacity: 0.2,
          //       shadowRadius: 3,
          //     }}
          //   >
          //     <Feather name="arrow-left" size={20} />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                isEditProfile ? handleSaveProfile() : handleEditProfile();
              }}
              style={{
                marginRight: 20,
                backgroundColor: Colors.white,
                padding: 6,
                borderRadius: 6,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {isEditProfile ? "Save" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Avatar.Image
              source={{
                uri: userDetails?.profile,
              }}
              size={80}
            />
            <View style={{ width: "72%", marginLeft: 20 }}>
              <Title
                style={[
                  styles.title,
                  {
                    width: "100%",
                    marginTop: 15,
                    marginBottom: 5,
                    borderColor: "blue",
                    borderWidth: 1,
                  },
                ]}
              >
                {isEditProfile ? (
                  <View style={{}}>
                    <TextInput
                      // value={email || ""}
                      style={styles.textInput1}
                      placeholder="Email"
                      placeholderTextColor={Colors.secondary}
                      // onChangeText={setEmail}
                    />
                  </View>
                ) : (
                  <>
                    {userDetails?.firstName || "Name"}{" "}
                    {userDetails?.lastName || "Name"}
                  </>
                )}
              </Title>
              <Caption style={styles.caption}>
                {userDetails?.role || "User"}
              </Caption>
            </View>
          </View>
        </View>
        <View style={styles.userInfoTextWrapper}>
          <View style={styles.userInfoText}>
            <View style={[styles.row, styles.firstBox]}>
              {isEditProfile ? (
                <TextInput
                  value={address || ""}
                  style={styles.textInput}
                  placeholder="Address"
                  placeholderTextColor={Colors.secondary}
                  onChangeText={setAddress}
                />
              ) : (
                <Text style={{ color: "#777777", padding: 12 }}>
                  {userDetails?.address || ""}
                </Text>
              )}
            </View>
            <View style={styles.row}>
              <Text style={{ color: "#777777", padding: 12 }}>
                {userDetails?.mobileNumber || "1234567890"}
              </Text>
            </View>
            <View style={[styles.row, styles.lastBox]}>
              {isEditProfile ? (
                <TextInput
                  value={email || ""}
                  style={styles.textInput}
                  placeholder="Email"
                  placeholderTextColor={Colors.secondary}
                  onChangeText={setEmail}
                />
              ) : (
                <Text style={{ color: "#777777", padding: 12 }}>
                  {userDetails?.email || "dummy@gmail.com"}
                </Text>
              )}
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
              <MaterialIcons name="payment" size={28} color={Colors.primary} />
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
              <MaterialIcons name="logout" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </>
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
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    padding: 7.8,
    borderRadius: 8,
    // fontFamily: fonts.Light,
  },
  textInput1: {
    width: 60,
    // flex: 1,
    fontSize: 15,
    paddingHorizontal: 10,
    padding: 6,
    borderRadius: 8,
    borderColor: "red",
    borderWidth: 1,
    marginBottom: 6
    // fontFamily: fonts.Light,
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
    paddingTop: 0,
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
