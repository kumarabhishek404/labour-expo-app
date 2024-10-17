import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Text,
} from "react-native";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import { EarningAtom, UserAtom, WorkAtom } from "../AtomStore/user";
import { useAtom } from "jotai";
import ModalComponent from "@/components/Modal";
import { updateUserById, uploadFile } from "../api/user";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import AvatarComponent from "@/components/Avatar";
import Button from "@/components/Button";
import UserInfoComponent from "@/components/UserInfoBox";
import TextInputComponent from "@/components/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [workDetails, setWorkDetails] = useAtom(WorkAtom);
  const [earnings, setEarnings] = useAtom(EarningAtom);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const [avatar, setAvatar] = useState(userDetails?.avatar);
  const [firstName, setFirstName] = useState(userDetails?.firstName);
  const [lastName, setLastName] = useState(userDetails?.lastName);
  const [address, setAddress] = useState(userDetails?.address);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      address: userDetails?.address,
    },
  });

  useEffect(() => {
    setValue("firstName", userDetails?.firstName);
    setValue("lastName", userDetails?.lastName);
    setValue("address", userDetails?.address);
  }, [isEditProfile]);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data
      );
      let user = response?.data?.data;
      setIsEditProfile(false);
      setUserDetails({
        ...userDetails,
        firstName: user?.firstName,
        lastName: user?.lastName,
        address: user?.address,
      });
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
      setIsEditProfile(false);
    },
  });

  const mutationUploadProfileImage = useMutation({
    mutationKey: ["uploadProfileImage"],
    mutationFn: (payload) => handleUploadAvatar(payload),
    onSuccess: (response) => {
      console.log("Response from avatar image uploading - ", response);
      setUserDetails({
        ...userDetails,
        avatar: response?.data,
      });
      setAvatar(response?.data);
    },
    onError: (err) => {
      console.log("Error while uploading avatar image - ", err);
    },
  });

  const mutationRemoveProfileImage = useMutation({
    mutationKey: ["removeProfileImage"],
    mutationFn: () => handleRemoveProfileImage(),
    onSuccess: (response) => {},
    onError: (err) => {},
  });

  const toggleNotificationSwitch = () =>
    setNotificationsEnabled((prevState) => !prevState);
  const toggleDarkModeSwitch = () =>
    setDarkModeEnabled((prevState) => !prevState);

  const handleLogout = () => {
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
    setIsEditProfile(true);
  };

  const handleUploadAvatar = async (profileImage: any) => {
    const formData: any = new FormData();
    const avatarFile = profileImage.split("/").pop();
    formData.append("avatar", {
      uri: profileImage,
      type: "image/jpeg",
      name: avatarFile,
    });
    return await uploadFile(formData);
  };

  const handleRemoveProfileImage = () => {
    let tempUserDetails = { ...userDetails };
    tempUserDetails.avatar = "";
    return setUserDetails(tempUserDetails);
  };

  const modalContent = () => {
    return (
      <View style={styles.formContainer}>
        <View style={{ marginBottom: 10 }}>
          <AvatarComponent
            isEditable={true}
            isLoading={mutationUploadProfileImage?.isPending}
            profileImage={avatar}
            onUpload={mutationUploadProfileImage?.mutate}
          />
        </View>

        <Controller
          control={control}
          name="firstName"
          defaultValue=""
          rules={{
            required: "First Name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label="First Name"
              name="firstName"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter your First Name"
              containerStyle={errors?.firstName && styles.errorInput}
              errors={errors}
              icon={
                <Ionicons
                  name="person"
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          defaultValue=""
          rules={{
            required: "First Name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label="Last Name"
              name="lastName"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter your Last Name"
              containerStyle={errors?.lastName && styles.errorInput}
              errors={errors}
              icon={
                <Ionicons
                  name="person"
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          defaultValue=""
          rules={{
            required: "Address is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label="Address"
              name="address"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Enter your Address"
              containerStyle={errors?.lastName && styles.errorInput}
              errors={errors}
              icon={
                <Entypo
                  name="location"
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, paddingRight: 10 }}
                />
              }
            />
          )}
        />
        {/* <View style={styles.inputContainer}>
          <Ionicons name="person" size={30} color={Colors.secondary} />
          <TextInput
            value={firstName}
            style={styles.textInput2}
            placeholder="First Name"
            placeholderTextColor={Colors.secondary}
            onChangeText={setFirstName}
          />
        </View> */}
        {/* <View style={styles.inputContainer}>
          <Ionicons name="person" size={30} color={Colors.secondary} />
          <TextInput
            value={lastName}
            style={styles.textInput2}
            placeholder="Last Name"
            placeholderTextColor={Colors.secondary}
            onChangeText={setLastName}
          />
        </View> */}
        {/* <View style={styles.inputContainer}>
          <Entypo name={"home"} size={30} color={Colors.secondary} />
          <TextInput
            value={address}
            style={styles.textInput2}
            placeholder="Address"
            placeholderTextColor={Colors.secondary}
            onChangeText={setAddress}
          />
        </View> */}
      </View>
    );
  };

  const onSubmit = (data: any) => {
    let payload = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      address: data?.address,
    };
    console.log("Payload---", payload);
    mutationUpdateProfileInfo?.mutate(payload);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <Loader loading={mutationUpdateProfileInfo?.isPending} />
      <ScrollView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <AvatarComponent
              isEditable={false}
              isLoading={mutationUploadProfileImage?.isPending}
              profileImage={avatar}
              onUpload={mutationUploadProfileImage?.mutate}
            />
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
              <Text style={styles.caption}>
                {userDetails?.role === "WORKER"
                  ? userDetails?.roleType === "ONE"
                    ? "WORKER"
                    : "MEDIATOR"
                  : userDetails?.role}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles?.changeRoleWrapper}>
          <Button
            style={styles?.mediatorButton}
            textStyle={styles?.mediatorButtonText}
            isPrimary={true}
            title="Change Role"
            onPress={() => router?.push("/screens/profile/changeRole")}
          />
          <Button
            style={{
              ...styles?.mediatorButton,
              backgroundColor: Colors?.black,
              borderColor: Colors?.black,
            }}
            textStyle={styles?.mediatorButtonText}
            isPrimary={true}
            title="Edit Profile"
            onPress={() => {
              !isEditProfile && handleEditProfile();
            }}
          />
          <ModalComponent
            visible={isEditProfile}
            onClose={() => setIsEditProfile(false)}
            content={modalContent}
            primaryButton={{
              action: handleSubmit(onSubmit),
            }}
            secondaryButton={{
              action: () => setIsEditProfile(false),
            }}
          />
        </View>

        <UserInfoComponent user={userDetails} />

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
            <Text>{workDetails?.total}</Text>
            <Text>Total Tasks</Text>
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
            <Text>{workDetails?.completed}</Text>
            <Text>Completed</Text>
          </View>
          <View style={styles.workInfoBox}>
            <Text>{workDetails?.upcoming}</Text>
            <Text>Pending</Text>
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <Link href="/screens/team" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <FontAwesome6
                  name="people-group"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Your Team</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/requests" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <FontAwesome6
                  name="hands-praying"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Request</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/favourite" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="space-dashboard"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>
                  Your Favourites{" "}
                  {userDetails?.role === "EMPLOYER" ? "Workers" : "Employers"}
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/favourite" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="space-dashboard"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>
                  Your Favourite Mediators
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/payments" asChild>
            <TouchableOpacity onPress={() => {}}>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="payment"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Payment</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/shareApp" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialIcons name="share" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Tell Your Friends</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/support" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="support-agent"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Support</Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* <Link href="/screens/settings" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Ionicons name="settings" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </Link> */}
          <Link href="/screens/settings/changeLanguage" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <Entypo name="language" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Change Language</Text>
              </View>
            </TouchableOpacity>
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

          <Link href="/screens/feedback" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialIcons
                  name="chat-bubble"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Feedback</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/privacyPolicy" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <FontAwesome6 name="lock" size={28} color={Colors.primary} />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/terms&Conditions" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <FontAwesome6
                  name="file-contract"
                  size={28}
                  color={Colors.primary}
                />
                <Text style={styles.menuItemText}>Terms and Conditions</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <Link href="/screens/profile/deleteProfile" asChild>
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <MaterialCommunityIcons
                  name="delete-forever"
                  size={28}
                  color={Colors.danger}
                />
                <Text style={[styles.menuItemText, { color: Colors?.danger }]}>
                  Delete Account
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.menuItem}>
              <MaterialIcons name="logout" size={28} color={Colors.danger} />
              <Text style={[styles.menuItemText, { color: Colors?.danger }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    marginTop: 60,
    // backgroundColor: Colors?.white
  },
  changeRoleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  caption: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    borderWidth: 1,
    borderColor: "#ddd",
    width: 130,
    padding: 6,
    borderRadius: 30,
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#d6ecdd",
  },
  mediatorButton: {
    width: "48%",
    borderWidth: 2,
    backgroundColor: "#fa6400",
    borderColor: "#fa6400",
    paddingVertical: 6,
    paddingHorizontal: 25,
    marginTop: 16,
  },
  mediatorButtonText: {
    fontWeight: "500",
    fontSize: 16,
  },
  row: {
    paddingTop: 0,
    backgroundColor: Colors.white,
    flexDirection: "row",
    marginBottom: 5,
  },
  firstBox: {
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
  },
  lastBox: {
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
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
    // padding: 10,
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
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
