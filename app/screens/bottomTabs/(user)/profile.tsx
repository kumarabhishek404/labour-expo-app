import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import Atoms, {
  initializeMobileAtom,
  mobileNumberAtom,
  updateMobileNumberAtom,
} from "@/app/AtomStore";
import { useAtom } from "jotai";
import ModalComponent from "@/components/commons/Modal";
import USER from "../../../api/user";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import AvatarComponent from "@/components/commons/Avatar";
import Button from "@/components/inputs/Button";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import TOAST from "@/app/hooks/toast";
import { WORKERTYPES } from "@/constants";
import SkillSelector from "@/components/commons/SkillSelector";
import WorkInformation from "@/components/commons/WorkInformation";
import ServiceInformation from "@/components/commons/ServiceInformation";
import StatsCard from "@/components/commons/LikesStats";
import ProfileMenu from "@/components/commons/ProfileMenu";
import InactiveAccountMessage from "@/components/commons/InactiveAccountMessage";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import LOCAL_CONTEXT from "@/app/context/locale";
import PendingApprovalMessage from "@/components/commons/PendingApprovalAccountMessage";
import TeamAdminCard from "@/components/commons/TeamAdminCard";
import { t } from "@/utils/translationHelper";
import EmailAddressField from "@/components/inputs/EmailAddress";
import ProfileNotification from "@/components/commons/CompletProfileNotify";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import ProfileTabs from "../../../../components/inputs/TabsSwitcher";
import AUTH from "@/app/api/auth";
import USE_LOGOUT from "@/app/hooks/useLogout";
import { getToken } from "@/utils/authStorage";
import { Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import ButtonComp from "@/components/inputs/Button";
import { Divider } from "react-native-paper";

const UserProfile = () => {
  LOCAL_CONTEXT?.useLocale();
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [selectedTab, setSelectedTab] = useState("profileInformation");
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profilePicture, setProfilePicture] = useState(
    userDetails?.profilePicture
  );
  const [loading, setLoading] = useState(false);
  const { logout } = USE_LOGOUT.useLogout();

  const [mobileNumber, setMobileNumber] = useAtom(mobileNumberAtom);
  const [, initializeMobile] = useAtom(initializeMobileAtom);
  const [, updateMobile] = useAtom(updateMobileNumberAtom);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempMobile, setTempMobile] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userDetails?.name,
      email: userDetails?.email?.value,
      address: userDetails?.address,
    },
  });

  const { refreshUser, isLoading } = REFRESH_USER.useRefreshUser();

  // useEffect(() => {
  //   const validateUserToken = async () => {
  //     try {
  //       setLoading(true);
  //       const token = await getToken();

  //       if (!token) {
  //         return logout();
  //       }

  //       const response = await AUTH.validateToken();

  //       if (response?.errorCode === "TOKEN_VALID") {
  //         console.log("Token is valid");
  //         refreshUser();
  //         setLoading(false);
  //       } else {
  //         logout(); // 🔥 logout immediately on invalid token
  //       }
  //     } catch (error) {
  //       console.error("Error validating token:", error);
  //       logout(); // 🔥 logout on any error also
  //     }
  //   };

  //   validateUserToken();
  // }, [logout]);

  useEffect(() => {
    const backAction = () => {
      if (userDetails?.status !== "ACTIVE") {
        TOAST?.error(
          `${
            userDetails?.status === "SUSPENDED" ||
            userDetails?.status === "DISABLED"
              ? t("profileSuspended")
              : t("approvalIsPending")
          }: ${t("youCantUntilYourProfileIs")} ${
            userDetails?.status === "SUSPENDED" ||
            userDetails?.status === "DISABLED"
              ? t("suspended")
              : t("notApproved")
          }.`
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [userDetails]);

  useEffect(() => {
    setValue("name", userDetails?.name);
    setValue("email", userDetails?.email?.value);
  }, [isEditProfile, userDetails]);

  useEffect(() => {
    initializeMobile();
  }, []);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data?.email
      );
      let user = response?.data?.data;
      setIsEditProfile(false);
      setProfilePicture(user?.profilePicture);
      setUserDetails({
        ...userDetails,
        name: user?.name,
        profilePicture: user?.profilePicture,
        email: {
          value: user?.email?.value,
          isVerified: false,
        },
      });
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
      setIsEditProfile(false);
    },
  });

  const mutationUpdateProfilePicture = useMutation({
    mutationKey: ["updateProfilePicture"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      let user = response?.data?.data;
      setProfilePicture(user?.profilePicture);
      setUserDetails({
        ...userDetails,
        profilePicture: user?.profilePicture,
      });
    },
  });

  const handleProfilePictureSubmit = async (profileImage: any) => {
    if (
      !profileImage ||
      typeof profileImage !== "string" ||
      profileImage.trim() === ""
    ) {
      TOAST?.error(t("pleaseSelectAProfilePicture"));
      return;
    }

    const formData: any = new FormData();
    const imageName = profileImage.split("/").pop();
    formData.append("profileImage", {
      uri:
        Platform.OS === "android"
          ? profileImage
          : profileImage.replace("file://", ""),
      type: "image/jpeg",
      name: imageName || "photo.jpg",
    });
    formData?.append("_id", userDetails?._id);

    mutationUpdateProfilePicture.mutate(formData);
  };

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skill: any) => USER?.updateSkills({ skill: skill }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails({
        ...userDetails,
        skills: user?.skills,
      });
      TOAST?.success(t("skillsAddedSuccessfully"));
      // console.log("Response while adding new skills in a worker - ", response);
    },
    onError: (err) => {
      console.error("error while adding new skills in a worker ", err);
    },
  });

  const mutationRemoveSkill = useMutation({
    mutationKey: ["removeSkills"],
    mutationFn: (skill: string) => USER?.removeSkill({ skillName: skill }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails({
        ...userDetails,
        skills: user?.skills,
      });
      TOAST?.success(t("skillRemovedSuccessfully"));
      console.log("Response while removing skill from the worker - ", response);
    },
    onError: (err) => {
      console.error("error while removing skill from the worker ", err);
    },
  });

  const handleEditProfile = () => {
    setIsEditProfile(true);
  };

  const modalContent = () => {
    return (
      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="name"
          defaultValue=""
          rules={{
            required: t("firstNameIsRequired"),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputComponent
              label="name"
              name="name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("enterYourFirstName")}
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
          name="email"
          defaultValue=""
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailAddressField
              name="email"
              email={value}
              setEmail={onChange}
              errors={errors}
              placeholder={t("enterYourEmailAddress")}
              icon={
                <Ionicons
                  name={"mail-outline"}
                  size={30}
                  color={Colors.secondary}
                  style={{ paddingVertical: 10, marginRight: 10 }}
                />
              }
            />
          )}
        />
      </View>
    );
  };

  const onSubmit = (data: any) => {
    let updatedFields: any = {
      _id: userDetails._id,
    };

    if (data?.name !== userDetails?.name) {
      updatedFields.name = data?.name;
    }

    if (data?.email !== userDetails?.email?.value) {
      updatedFields.email = data?.email;
    }

    if (Object.keys(updatedFields).length > 1) {
      mutationUpdateProfileInfo?.mutate(updatedFields);
    } else {
      TOAST?.error(t("makeChangesToSave"));
    }
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error("Error while refreshing user - ", error);
      TOAST?.error("Error while refreshing user");
    }
  };

  const loginModalContent = () => {
    return (
      <View style={{ padding: 0, marginBottom: 20, marginTop: 20 }}>
        <TextInputComponent
          label="mobileNumber"
          name="mobile"
          value={tempMobile}
          onChangeText={setTempMobile}
          placeholder="Enter 10-digit number"
          icon={
            <Ionicons
              style={{ marginRight: 10 }}
              name="call-outline"
              size={24}
              color={Colors.secondary}
            />
          }
        />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <CustomHeader title="kaarya" />,
        }}
      />
      <Loader
        loading={
          mutationUpdateProfileInfo?.isPending ||
          mutationAddSkills?.isPending ||
          mutationRemoveSkill?.isPending ||
          isLoading ||
          loading
        }
      />
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
              alignItems: "flex-end",
            }}
          >
            {!mobileNumber ? (
              <ButtonComp
                isPrimary={true}
                title="Login"
                onPress={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: Colors.primary,
                  paddingHorizontal: 20,
                }}
              />
            ) : (
              <CustomText
                color={Colors?.secondary}
                fontWeight="600"
                baseFont={24}
              >
                Hello, +91{mobileNumber}
              </CustomText>
            )}
          </View>
          <Divider />
          <ProfileMenu disabled={userDetails?.status !== "ACTIVE"} />
          <CustomText style={styles.copyright}>
            © 2024 KAARYA. All rights reserved.
          </CustomText>
        </ScrollView>
      </View>

      <ModalComponent
        title={t("login")}
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        content={loginModalContent}
        primaryButton={{
          title: t("login"),
          action: () => {
            if (tempMobile.length === 10) {
              updateMobile(tempMobile);
              setShowLoginModal(false);
              setTempMobile("");
              TOAST.success("Mobile number saved!");
            } else {
              TOAST.error("Please enter a valid mobile number.");
            }
          },
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setShowLoginModal(false),
        }}
      />
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors?.white,
    position: "relative",
    top: 0,
    paddingTop: 20,
  },
  changeRoleWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 15,
  },
  mediatorButton: {
    flex: 1,
    borderWidth: 2,
    backgroundColor: "#fa6400",
    borderColor: "#fa6400",
  },
  mediatorButtonText: {
    fontWeight: "500",
    fontSize: 16,
  },
  formContainer: {
    paddingVertical: 20,
    gap: 20,
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
  },

  skillsContainer: {
    padding: 12,
    marginHorizontal: 20,
    flexDirection: "column",
    marginBottom: 5,
    backgroundColor: Colors?.background,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
  disableButton: {
    pointerEvents: "none",
    opacity: 0.5,
    width: "45%",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "baseline",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: Colors.primary,
    // paddingVertical: 10,
    position: "fixed",
    top: 0,
    left: 0,
  },
  tab: {
    paddingVertical: 20,
    flex: 1,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.tertiery,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  activeTabText: {
    color: Colors.tertiery,
  },
  profileContent: {
    padding: 20,
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  otherContent: {
    padding: 20,
  },
  copyright: {
    marginVertical: 20,
    marginTop: 100,
  },
});
