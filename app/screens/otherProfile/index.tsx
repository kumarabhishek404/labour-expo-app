import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
} from "react-native";
import {
  Entypo,
  Ionicons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { EarningAtom, UserAtom, WorkAtom } from "../../AtomStore/user";
import { useAtom } from "jotai";
import { updateUserById, uploadFile } from "../../api/user";
import AvatarComponent from "@/components/commons/Avatar";
import WorkInformation from "@/components/commons/WorkInformation";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [workDetails, setWorkDetails] = useAtom(WorkAtom);
  const [earnings, setEarnings] = useAtom(EarningAtom);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const [email, setEmail] = useState(userDetails?.email);

  const [profilePicture, setProfilePicture] = useState(userDetails?.profilePicture);
  const [firstName, setFirstName] = useState(userDetails?.firstName);
  const [lastName, setLastName] = useState(userDetails?.lastName);
  const [address, setAddress] = useState(userDetails?.address);
  const [numberValue, setNumberValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  // Create a reference to the ScrollView
  const scrollViewRef: any = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }, []);

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

  const handleEditProfile = () => {
    setIsEditProfile(true);
  };

  const handleChooseAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadAvatar = async () => {
    try {
      const formData: any = new FormData();
      // const imageUri: any = images;
      const avatarFile = profilePicture.split("/").pop();
      formData.append("profilePicture", {
        uri: profilePicture,
        type: "image/jpeg",
        name: avatarFile,
      });
      const response = await uploadFile(formData);
      console.log("Response from profilePicture image uploading - ", response);
    } catch (err: any) {
      console.log("Error while uploading profilePicture image - ", err);
    }
  };

  const modalContent = () => {
    return (
      <View ref={scrollViewRef} style={styles.formContainer}>
        <View style={styles.avatarContainer}>
          <AvatarComponent isEditable={false} profileImage={profilePicture} />
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
                borderRadius: 8,
                shadowColor: "#171717",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}
            >
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <AvatarComponent
              isEditable={false}
              profileImage={userDetails?.profilePicture ?? ""}
            />
            <View style={{ width: "72%", marginLeft: 20 }}>
              <Text
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
              </Text>
              <Text style={styles.caption}>{userDetails?.role || "User"}</Text>
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
            <Text>₹ {earnings?.work}</Text>
            <Text>Earnings</Text>
          </View>
          <View style={styles.infoBox}>
            <Text>₹ {earnings?.rewards}</Text>
            <Text>Rewards</Text>
          </View>
        </View>

        <WorkInformation information={userDetails} />

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
    // borderRadius: 8,,
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
