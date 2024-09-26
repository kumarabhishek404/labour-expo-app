import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from "react-native-paper";
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { Link, router, Stack, useFocusEffect } from "expo-router";
import { EarningAtom, UserAtom, WorkAtom } from "../AtomStore/user";
import { useAtom, useAtomValue } from "jotai";
import ModalComponent from "@/components/Modal";
import { updateUserById, uploadFile } from "../api/user";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [workDetails, setWorkDetails] = useAtom(WorkAtom);
  const [earnings, setEarnings] = useAtom(EarningAtom);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const [email, setEmail] = useState(userDetails?.email);

  const [avatar, setAvatar] = useState(userDetails?.avatar);
  const [firstName, setFirstName] = useState(userDetails?.firstName);
  const [lastName, setLastName] = useState(userDetails?.lastName);
  const [address, setAddress] = useState(userDetails?.address);
  const [numberValue, setNumberValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    setFirstName(userDetails?.firstName);
    setLastName(userDetails?.lastName);
    setAddress(userDetails?.address);
  }, [isEditProfile]);

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

  const toggleNotificationSwitch = () =>
    setNotificationsEnabled((prevState) => !prevState);
  const toggleDarkModeSwitch = () =>
    setDarkModeEnabled((prevState) => !prevState);

  const handleLogout = () => {
    console.log("Logout button pressed");
    setUserDetails({
      isAuth: false,
      _id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      likedJobs: "",
      likedEmployees: "",
      email: "",
      address: "",
      avatar: "",
      role: "",
      token: "",
      serviceAddress: [],
    });
    setWorkDetails({
      total: "",
      completed: "",
      cancelled: "",
      upcoming: "",
    });
    setEarnings({
      work: "",
      rewards: "",
    });
    router.navigate("/screens/auth/login");
  };

  const handleEditProfile = () => {
    console.log("Edit profile");
    setIsEditProfile(true);
  };

  const handleSaveProfile = async () => {
    console.log("Input Value:", firstName, lastName, address);
    let payload = {
      firstName: firstName,
      middleName: "Amruta",
      lastName: lastName,
      address: address,
      mobileNumber: "1234567890",
      alternateMobileNumber: "1223456",
      email: "abhishek@gmail.com",
      alternateEmail: "officialsujitmemane@gmail.com",
      role: "User",
    };
    try {
      const responseNew = await handleUploadAvatar();
      const response = await updateUserById(payload);
      console.log("response after user update  ---", response?.data);
      let user = response?.data;
      setIsEditProfile(false);
      setUserDetails({
        ...userDetails,
        firstName: user?.firstName,
        lastName: user?.lastName,
      });
    } catch (err) {
      setIsEditProfile(false);
      console.log("error while updating user info ", err);
    }
  };

  const handleChooseAvatar = async () => {
    console.log("Handling Image upload");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const formData: any = new FormData();
      // const imageUri: any = images;
      console.log("avatar", avatar);

      const avatarFile = avatar.split("/").pop();
      formData.append("avatar", {
        uri: avatar,
        type: "image/jpeg",
        name: avatarFile,
      });
      const response = await uploadFile(formData);
      console.log("Response from avatar image uploading - ", response);
    } catch (err: any) {
      console.log("Error while uploading avatar image - ", err);
    }
  };

  const modalContent = () => {
    return (
      <View style={styles.formContainer}>
        <View style={styles.avatarContainer}>
          {/* <Ionicons name="person" size={30} color={Colors.secondary} /> */}
          <Avatar.Image
            source={{
              uri: avatar,
            }}
            size={80}
          />
          <TouchableOpacity onPress={handleChooseAvatar}>
            <Text style={styles?.avatarText}>Choose Profile Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={30} color={Colors.secondary} />
          <TextInput
            value={firstName}
            style={styles.textInput2}
            placeholder="First Name"
            placeholderTextColor={Colors.secondary}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={30} color={Colors.secondary} />
          <TextInput
            value={lastName}
            style={styles.textInput2}
            placeholder="Last Name"
            placeholderTextColor={Colors.secondary}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Entypo name={"home"} size={30} color={Colors.secondary} />
          <TextInput
            value={address}
            style={styles.textInput2}
            placeholder="Address"
            placeholderTextColor={Colors.secondary}
            onChangeText={setAddress}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerTitle: "Profile",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                !isEditProfile && handleEditProfile();
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
                Edit Profile
                <ModalComponent
                  visible={isEditProfile}
                  onClose={() => setIsEditProfile(false)}
                  content={modalContent}
                  primaryAction={handleSaveProfile}
                  // buttonText={"Edit Profile"}
                />
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
                uri: userDetails?.avatar,
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
                  },
                ]}
              >
                {userDetails?.firstName || "Name"}{" "}
                {userDetails?.lastName || "Name"}
              </Title>
              <Caption style={styles.caption}>
                {userDetails?.role || "User"}
              </Caption>
            </View>
          </View>
        </View>
        <View style={styles.userInfoTextWrapper}>
          <View style={styles.userInfoBox}>
            <View style={[styles.row, styles.firstBox]}>
              <Text style={styles.userInfoText}>
                {userDetails?.address || ""}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.userInfoText}>
                {userDetails?.mobileNumber || "1234567890"}
              </Text>
            </View>
            <View style={[styles.row, styles.lastBox]}>
              <Text style={styles.userInfoText}>{userDetails?.email}</Text>
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
            <Title>₹ {earnings?.work}</Title>
            <Caption>Earnings</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title>₹ {earnings?.rewards}</Title>
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
            <Title>{workDetails?.total}</Title>
            <Caption>Total Tasks</Caption>
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
            <Title>{workDetails?.completed}</Title>
            <Caption>Completed</Caption>
          </View>
          <View style={styles.workInfoBox}>
            <Title>{workDetails?.upcoming}</Title>
            <Caption>Pending</Caption>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <Link href="/screens/favourite" asChild>
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

          <Link href="/screens/support" asChild>
            <TouchableRipple>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="support-agent"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Support</Text>
              </View>
            </TouchableRipple>
          </Link>

          <Link href="/screens/settings" asChild>
            <TouchableRipple>
              <View style={styles.menuItem}>
                <Ionicons name="settings" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
            </TouchableRipple>
          </Link>
          <Link href="/screens/settings/changeLanguage" asChild>
            <TouchableRipple>
              <View style={styles.menuItem}>
                <Entypo name="language" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Change Language</Text>
              </View>
            </TouchableRipple>
          </Link>
          <TouchableOpacity>
            <View style={styles.settingsItem}>
              <View style={styles.menuItem}>
                <Ionicons
                  name="notifications"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Notification</Text>
              </View>
              <Switch
                thumbColor={Colors?.primary}
                trackColor={{
                  false: Colors?.secondary,
                  true: Colors?.secondary,
                }}
                value={isNotificationsEnabled}
                onValueChange={toggleNotificationSwitch}
                style={styles.switch}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.settingsItem}>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="dark-mode"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Dark Mode</Text>
              </View>
              <Switch
                thumbColor={Colors?.primary}
                trackColor={{
                  false: Colors?.secondary,
                  true: Colors?.secondary,
                }}
                value={isDarkModeEnabled}
                onValueChange={toggleDarkModeSwitch}
                style={styles.switch}
              />
            </View>
          </TouchableOpacity>

          <TouchableRipple onPress={handleLogout}>
            <View style={styles.menuItem}>
              <MaterialIcons name="chat-bubble" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Feedback</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleLogout}>
            <View style={styles.menuItem}>
              <FontAwesome6 name="lock" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleLogout}>
            <View style={styles.menuItem}>
              <FontAwesome6 name="file-contract" size={28} color={Colors.primary} />
              <Text style={styles.menuItemText}>Terms and Conditions</Text>
            </View>
          </TouchableRipple>

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
  userInfoBox: {
    // width: '90%',
    // borderRadius: 16,
    padding: 15,
    marginLeft: -20,
  },
  userInfoText: {
    color: "#777777",
    padding: 12,
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
    marginBottom: 6,
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

  formContainer: {
    marginTop: 20,
    padding: 10,
  },
  avatarContainer: {
    // height: 53,
    // borderWidth: 1,
    // borderColor: Colors.secondary,
    // borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 8,
    // padding: 10,
    marginBottom: 20,
  },
  avatarText: {
    color: Colors?.primary,
    marginLeft: 20,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 26,
  },
  inputContainer: {
    height: 53,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  textInput2: {
    flex: 1,
    paddingHorizontal: 10,
    // fontFamily: fonts.Light,
  },
  settingsItem: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: 15,
    paddingRight: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  switch: {
    color: Colors?.primary,
    tintColor: Colors?.primary,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
