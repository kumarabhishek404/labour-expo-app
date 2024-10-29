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
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link, router, Stack } from "expo-router";
import {
  EarningAtom,
  ServiceAtom,
  SpentAtom,
  UserAtom,
  WorkAtom,
} from "../AtomStore/user";
import { useAtom } from "jotai";
import ModalComponent from "@/components/commons/Modal";
import { updateUserById, uploadFile } from "../api/user";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/commons/Loader";
import AvatarComponent from "@/components/commons/Avatar";
import Button from "@/components/inputs/Button";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import { addSkills } from "../api/workers";
import { toast } from "../hooks/toast";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import SkillSelector from "@/components/commons/SkillSelector";
import WorkInformation from "@/components/commons/WorkInformation";
import ServiceInformation from "@/components/commons/ServiceInformation";
import WallletInformation from "@/components/commons/WalletInformation";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [workDetails, setWorkDetails] = useAtom(WorkAtom);
  const [serviceDetails, setServiceDetails] = useAtom(ServiceAtom);
  const [earnings, setEarnings] = useAtom(EarningAtom);
  const [spents, setSpents] = useAtom(SpentAtom);

  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isDarkModeEnabled, setDarkModeEnabled] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    userDetails?.profilePicture
  );
  const [selectedSkills, setSelectedSkills] = useState([]);

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
      console.log("Response from profilePicture image uploading - ", response);
      setUserDetails({
        ...userDetails,
        profilePicture: response?.data,
      });
      setProfilePicture(response?.data);
    },
    onError: (err) => {
      console.log("Error while uploading profilePicture image - ", err);
    },
  });

  const mutationRemoveProfileImage = useMutation({
    mutationKey: ["removeProfileImage"],
    mutationFn: () => handleRemoveProfileImage(),
    onSuccess: (response) => {},
    onError: (err) => {},
  });

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skills: Array<string>) => addSkills({ skills: skills }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails({ ...userDetails, skills: user?.skills });
      setSelectedSkills([]);
      toast.success("Skills added successfully");
      console.log("Response while adding new skills in a worker - ", response);
    },
    onError: (err) => {
      console.error("error while adding new skills in a worker ", err);
    },
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
      profilePicture: "",
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
    setServiceDetails({
      total: "",
      completed: "",
      cancelled: "",
      upcoming: "",
    });
    setEarnings({
      work: "",
      rewards: "",
    });
    setSpents({
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
    formData.append("profilePicture", {
      uri: profileImage,
      type: "image/jpeg",
      name: avatarFile,
    });
    return await uploadFile(formData);
  };

  const handleRemoveProfileImage = () => {
    let tempUserDetails = { ...userDetails };
    tempUserDetails.profilePicture = "";
    return setUserDetails(tempUserDetails);
  };

  const modalContent = () => {
    return (
      <View style={styles.formContainer}>
        <View style={{ marginBottom: 10 }}>
          <AvatarComponent
            isEditable={true}
            isLoading={mutationUploadProfileImage?.isPending}
            profileImage={profilePicture}
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

  const handleAddSkills = () => {
    const skills = selectedSkills?.map((skill: any) => {
      return skill?.value;
    });
    mutationAddSkills?.mutate(skills);
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
      <Loader
        loading={
          mutationUpdateProfileInfo?.isPending || mutationAddSkills?.isPending
        }
      />
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
              profileImage={profilePicture}
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
              <Text style={styles.caption}>{userDetails?.role}</Text>
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

        {userDetails?.role !== "EMPLOYER" && (
          <SkillSelector
            canAddSkills={true}
            isShowLabel={true}
            style={styles?.skillsContainer}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            userSkills={userDetails?.skills}
            handleAddSkill={handleAddSkills}
            availableSkills={
              userDetails?.role === "WORKER" ? WORKERTYPES : MEDIATORTYPES
            }
          />
        )}

        <UserInfoComponent user={userDetails} />

        {userDetails?.role === "EMPLOYER" && (
          <>
            <WallletInformation
              type="spents"
              wallet={{ spents }}
              style={{ marginLeft: 20 }}
            />
            <ServiceInformation
              information={userDetails}
              style={{ marginLeft: 20 }}
            />
          </>
        )}

        {userDetails?.role === "WORKER" && userDetails?.role === "MEDIATOR" && (
          <>
            <WallletInformation
              type="earnings"
              wallet={{ earnings }}
              style={{ marginLeft: 20 }}
            />
            <WorkInformation information={userDetails} />
          </>
        )}

        <View style={styles.menuWrapper}>
          {userDetails?.role === "MEDIATOR" && (
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
          )}

          {userDetails?.role !== "EMPLOYER" && (
            <Link href="/screens/requests" asChild>
              <TouchableOpacity>
                <View style={styles.menuItem}>
                  <FontAwesome6
                    name="hands-praying"
                    size={28}
                    color={Colors.primary}
                  />
                  <Text style={styles.menuItemText}>Requests</Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}

          {userDetails?.role !== "EMPLOYER" ? (
            <Link
              href={{
                pathname: "/screens/service",
                params: { title: "Saved Services", type: "favourite" },
              }}
              asChild
            >
              <TouchableOpacity>
                <View style={styles.menuItem}>
                  <Fontisto name="persons" size={28} color={Colors.primary} />
                  <Text style={styles.menuItemText}>Saved Services</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ) : (
            <>
              <Link
                href={{
                  pathname: "/screens/worker",
                  params: { title: "Booked", type: "booked" },
                }}
                asChild
              >
                <TouchableOpacity>
                  <View style={styles.menuItem}>
                    <Fontisto name="persons" size={28} color={Colors.primary} />
                    <Text style={styles.menuItemText}>Booked</Text>
                  </View>
                </TouchableOpacity>
              </Link>
              {/* <Link
                href={{
                  pathname: "/screens/mediator",
                  params: { title: "Booked Mediators", type: "booked" },
                }}
                asChild
              >
                <TouchableOpacity>
                  <View style={styles.menuItem}>
                    <Fontisto name="persons" size={28} color={Colors.primary} />
                    <Text style={styles.menuItemText}>Booked Mediators</Text>
                  </View>
                </TouchableOpacity>
              </Link> */}
            </>
          )}

          <Link
            href={{
              pathname:
                userDetails?.role === "EMPLOYER"
                  ? "/screens/worker"
                  : "/screens/employer",
              params: {
                title:
                  userDetails?.role === "EMPLOYER"
                    ? "Favourite Workers"
                    : "Favourite Employers",
                type: "favourite",
              },
            }}
            asChild
          >
            <TouchableOpacity>
              <View style={styles.menuItem}>
                <FontAwesome6
                  name="people-group"
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

          {userDetails?.role !== "MEDIATOR" && (
            <Link
              href={{
                pathname: "/screens/mediator",
                params: { title: "Favourite Mediators", type: "favourite" },
              }}
              asChild
            >
              <TouchableOpacity>
                <View style={styles.menuItem}>
                  <Fontisto name="persons" size={28} color={Colors.primary} />
                  <Text style={styles.menuItemText}>
                    Your Favourite Mediators
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}

          {userDetails?.role === "MEDIATOR" && (
            <Link
              href={{
                pathname: "/screens/worker",
                params: { title: "Favourite Workers", type: "favourite" },
              }}
              asChild
            >
              <TouchableOpacity>
                <View style={styles.menuItem}>
                  <Fontisto name="persons" size={28} color={Colors.primary} />
                  <Text style={styles.menuItemText}>
                    Your Favourite Workers
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}

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
  skillsContainer: {
    padding: 12,
    marginHorizontal: 20,
    flexDirection: "column",
    marginBottom: 5,
    backgroundColor: "#ddd",
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});
