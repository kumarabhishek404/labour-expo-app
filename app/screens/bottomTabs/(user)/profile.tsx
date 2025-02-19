import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from "react-native";
// import { StatusBar } from "expo-status-bar";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import Atoms from "@/app/AtomStore";
import { useAtom, useAtomValue } from "jotai";
import ModalComponent from "@/components/commons/Modal";
import USER from "../../../api/user";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import AvatarComponent from "@/components/commons/Avatar";
import Button from "@/components/inputs/Button";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import WORKER from "../../../api/workers";
import TOAST from "@/app/hooks/toast";
import { MEDIATORTYPES, WORKERTYPES } from "@/constants";
import SkillSelector from "@/components/commons/SkillSelector";
import WorkInformation from "@/components/commons/WorkInformation";
import ServiceInformation from "@/components/commons/ServiceInformation";
import WallletInformation from "@/components/commons/WalletInformation";
import StatsCard from "@/components/commons/LikesStats";
import ProfileMenu from "@/components/commons/ProfileMenu";
import InactiveAccountMessage from "@/components/commons/InactiveAccountMessage";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import LOCAL_CONTEXT from "@/app/context/locale";
import PendingApprovalMessage from "@/components/commons/PendingApprovalAccountMessage";
import TeamAdminCard from "@/components/commons/TeamAdminCard";
import { t } from "@/utils/translationHelper";
import { isEmptyObject } from "@/constants/functions";
import EmailAddressField from "@/components/inputs/EmailAddress";
import ProfileNotification from "@/components/commons/CompletProfileNotify";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import ProfileTabs from "../../../../components/inputs/TabsSwitcher";
import { Portal, Provider } from "react-native-paper";

const UserProfile = () => {
  LOCAL_CONTEXT?.useLocale();
  const isAccountInactive = useAtomValue(Atoms?.AccountStatusAtom);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [earnings, setEarnings] = useAtom(Atoms?.EarningAtom);
  const [selectedTab, setSelectedTab] = useState("Profile Information");

  const [isEditProfile, setIsEditProfile] = useState(false);

  const [profilePicture, setProfilePicture] = useState(
    userDetails?.profilePicture
  );
  const [selectedSkills, setSelectedSkills] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userDetails?.name,
      email: userDetails?.email?.value,
    },
  });

  const { refreshUser, isLoading } = REFRESH_USER.useRefreshUser();

  useEffect(() => {
    const backAction = () => {
      if (isAccountInactive) {
        TOAST?.showToast?.error(
          userDetails?.status === "SUSPENDED" ||
            userDetails?.status === "DISABLED"
            ? "Profile Suspended"
            : "Approval Is Pending",
          `You can't go back until your profile is ${
            userDetails?.status === "SUSPENDED" ||
            userDetails?.status === "DISABLED"
              ? "suspended"
              : "not approved"
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
  }, [isAccountInactive]);

  useEffect(() => {
    setValue("name", userDetails?.name);
    setValue("email", userDetails?.email?.value);
  }, [isEditProfile, userDetails]);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data?.email
      );
      let user = response?.data?.data;
      console.log("user--", user);

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
      TOAST?.showToast?.error(t("pleaseSelectAProfilePicture"));
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

    console.log("Forrr---", formData);

    await mutationUpdateProfilePicture.mutate(formData);
  };

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skill: any) => USER?.updateSkills({ skill: skill }),
    onSuccess: (response) => {
      let user = response?.data;
      setUserDetails({ ...userDetails, skills: user?.skills });
      setSelectedSkills([]);
      TOAST?.showToast?.success(t("skillsAddedSuccessfully"));
      console.log("Response while adding new skills in a worker - ", response);
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
      setUserDetails({ ...userDetails, skills: user?.skills });
      setSelectedSkills([]);
      TOAST?.showToast?.success(t("skillRemovedSuccessfully"));
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
        <AvatarComponent
          isEditable={true}
          isLoading={mutationUpdateProfilePicture?.isPending}
          profileImage={profilePicture}
          onUpload={handleProfilePictureSubmit}
        />
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
          // rules={{
          //   required: t("emailAddressIsRequired"),
          //   pattern: {
          //     value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
          //     message: t("enterAValidEmailAddress"),
          //   },
          // }}
          render={({ field: { onChange, onBlur, value } }) => (
            <EmailAddressField
              name="email"
              email={value}
              setEmail={onChange}
              onBlur={onBlur}
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
    let payload = {
      _id: userDetails?._id,
      name: data?.name,
      email: data?.email,
    };
    mutationUpdateProfileInfo?.mutate(payload);
  };

  const handleRefreshUser = async () => {
    try {
      await refreshUser();
    } catch (error) {
      console.error("Error while refreshing user - ", error);
      TOAST?.showToast?.error("Error while refreshing user");
    }
  };

  return (
    <>
      <Loader
        loading={
          mutationUpdateProfileInfo?.isPending ||
          mutationAddSkills?.isPending ||
          mutationRemoveSkill?.isPending ||
          isLoading
        }
      />
      <View style={styles.container}>
        <ProfileTabs
          tabPositions={{
            "Profile Information": 0,
            "Other Information": 1,
          }}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {selectedTab === "Profile Information" ? (
          <ScrollView>
            <View style={styles.userInfoSection}>
              <AvatarComponent
                isLoading={mutationUpdateProfilePicture?.isPending}
                isEditable={false}
                profileImage={profilePicture}
              />
              <CustomHeading baseFont={22} style={{ marginTop: 10 }}>
                {userDetails?.name || "Name"}
              </CustomHeading>
            </View>

            {(!userDetails?.email?.value ||
              !userDetails?.address ||
              !userDetails?.dateOfBirth ||
              !userDetails?.gender) && <ProfileNotification />}

            {(userDetails?.status === "SUSPENDED" ||
              userDetails?.status === "DISABLED") && <InactiveAccountMessage />}

            {userDetails?.status === "PENDING" && <PendingApprovalMessage />}

            <View style={styles?.changeRoleWrapper}>
              <Button
                disabled={false}
                style={{ ...styles?.mediatorButton }}
                textStyle={styles?.mediatorButtonText}
                isPrimary={true}
                title={t("refreshUser")}
                onPress={handleRefreshUser}
              />
              <View style={[{ justifyContent: "flex-end" }, { width: "45%" }]}>
                <Button
                  textStyle={styles?.mediatorButtonText}
                  isPrimary={true}
                  title={t("editProfile")}
                  onPress={() => !isEditProfile && handleEditProfile()}
                  style={{ flex: 1 }}
                />
              </View>
              <ModalComponent
                visible={isEditProfile}
                title={t("editProfile")}
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

            {userDetails?.employedBy && (
              <TeamAdminCard admin={userDetails?.employedBy} />
            )}

            <StatsCard />

            <SkillSelector
              canAddSkills={true}
              isShowLabel={true}
              style={styles?.skillsContainer}
              userSkills={userDetails?.skills}
              handleAddSkill={mutationAddSkills?.mutate}
              handleRemoveSkill={mutationRemoveSkill?.mutate}
              availableSkills={WORKERTYPES}
            />

            <UserInfoComponent user={userDetails} />

            <WallletInformation
              type="earnings"
              wallet={{ earnings }}
              style={{ marginLeft: 20 }}
            />

            <WallletInformation
              type="spents"
              wallet={userDetails?.spent}
              style={{ marginLeft: 20 }}
            />

            <WorkInformation
              information={userDetails?.workDetails}
              style={{ marginLeft: 20 }}
            />

            <View style={{ paddingTop: 20 }}>
              <ServiceInformation
                information={userDetails?.serviceDetails}
                style={{ marginLeft: 20 }}
              />
            </View>

            <CustomText style={styles.copyright}>
              © 2024 KAAM DEKHO. All rights reserved.
            </CustomText>
          </ScrollView>
        ) : (
          <ScrollView>
            <ProfileMenu disabled={userDetails?.status !== "ACTIVE"} />
            <CustomText style={styles.copyright}>
              © 2024 KAAM DEKHO. All rights reserved.
            </CustomText>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors?.fourth,
    position: "relative",
    top: 0,
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
  },
});
