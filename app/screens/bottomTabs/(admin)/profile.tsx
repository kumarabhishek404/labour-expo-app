import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
  // StatusBar,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import Atoms from "@/app/AtomStore";
import { useAtom, useAtomValue } from "jotai";
import ModalComponent from "@/components/commons/Modal";
import { useMutation } from "@tanstack/react-query";
import Loader from "@/components/commons/Loaders/Loader";
import AvatarComponent from "@/components/commons/Avatar";
import Button from "@/components/inputs/Button";
import UserInfoComponent from "@/components/commons/UserInfoBox";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import TOAST from "@/app/hooks/toast";
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
import { t } from "@/utils/translationHelper";
import USER from "@/app/api/user";
import REFRESH_USER from "@/app/hooks/useRefreshUser";

const AdminProfile = () => {
  LOCAL_CONTEXT?.useLocale();
  const isAccountInactive = useAtomValue(Atoms?.AccountStatusAtom);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [earnings, setEarnings] = useAtom(Atoms?.EarningAtom);
  const [spents, setSpents] = useAtom(Atoms?.SpentAtom);

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
      address: userDetails?.address,
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
    setValue("address", userDetails?.address);
  }, [isEditProfile]);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data
      );
      let user = response?.data?.data;
      setIsEditProfile(false);
      setUserDetails({
        ...userDetails,
        name: user?.name,
        address: user?.address,
      });
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
      setIsEditProfile(false);
    },
  });

  // const mutationUploadProfileImage = useMutation({
  //   mutationKey: ["uploadProfileImage"],
  //   mutationFn: (payload) => handleUploadAvatar(payload),
  //   onSuccess: (response) => {
  //     console.log("Response from profilePicture image uploading - ", response);
  //     setUserDetails({
  //       ...userDetails,
  //       profilePicture: response?.data,
  //     });
  //     setProfilePicture(response?.data);
  //   },
  //   onError: (err) => {
  //     console.log("Error while uploading profilePicture image - ", err);
  //   },
  // });

  const mutationRemoveProfileImage = useMutation({
    mutationKey: ["removeProfileImage"],
    mutationFn: () => handleRemoveProfileImage(),
    onSuccess: (response) => {},
    onError: (err) => {},
  });

  const mutationAddSkills = useMutation({
    mutationKey: ["addSkills"],
    mutationFn: (skills: Array<string>) =>
      USER?.updateSkills({ skills: skills }),
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

  const handleEditProfile = () => {
    setIsEditProfile(true);
  };

  // const handleUploadAvatar = async (profileImage: any) => {
  //   const formData: any = new FormData();
  //   const avatarFile = profileImage.split("/").pop();
  //   formData.append("profilePicture", {
  //     uri: profileImage,
  //     type: "image/jpeg",
  //     name: avatarFile,
  //   });
  //   return await USER?.uploadFile(formData);
  // };

  const handleRemoveProfileImage = () => {
    let tempUserDetails = { ...userDetails };
    tempUserDetails.profilePicture = "";
    return setUserDetails(tempUserDetails);
  };

  const modalContent = () => {
    return (
      <View style={styles.formContainer}>
        {/* <View style={{ marginBottom: 10 }}>
          <AvatarComponent
            isEditable={true}
            isLoading={mutationUploadProfileImage?.isPending}
            profileImage={profilePicture}
            onUpload={mutationUploadProfileImage?.mutate}
          />
        </View> */}
        <View style={{ flexDirection: "column", gap: 10 }}>
          <Controller
            control={control}
            name="name"
            defaultValue=""
            rules={{
              required: t("firstNameIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                label={t("name")}
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
        </View>
      </View>
    );
  };

  const onSubmit = (data: any) => {
    let payload = {
      _id: userDetails?._id,
      name: data?.name,
      address: data?.address,
    };
    mutationUpdateProfileInfo?.mutate(payload);
  };

  const handleChangeRole = async () => {
    router?.push("/screens/profile/changeRole");
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
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
        }}
      />

      <Loader
        loading={
          mutationUpdateProfileInfo?.isPending ||
          mutationAddSkills?.isPending ||
          isLoading
        }
      />
      <ScrollView style={styles.container}>
        <View style={styles.userInfoSection}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: 50,
            }}
          >
            <AvatarComponent
              isEditable={false}
              // isLoading={mutationUploadProfileImage?.isPending}
              profileImage={profilePicture}
              // onUpload={mutationUploadProfileImage?.mutate}
            />
            <View
              style={{
                flex: 1,
                marginHorizontal: 10,
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <CustomHeading>{userDetails?.name || "Name"}</CustomHeading>
              <CustomText style={styles.caption}>
                {userDetails?.role}
              </CustomText>
            </View>
          </View>
        </View>

        {(userDetails?.status === "SUSPENDED" ||
          userDetails?.status === "DISABLED") && <InactiveAccountMessage />}
        {userDetails?.status === "PENDING" && <PendingApprovalMessage />}
        <View
          style={[
            styles?.changeRoleWrapper,
            userDetails?.status !== "ACTIVE" && {
              pointerEvents: "none",
              opacity: 0.5,
            },
          ]}
        >
          {/* <Button
            disabled={false}
            style={styles?.mediatorButton}
            textStyle={styles?.mediatorButtonText}
            isPrimary={true}
            title="Change Role"
            onPress={handleChangeRole}
          /> */}

          <Button
            disabled={false}
            style={{ ...styles?.mediatorButton, width: "54%" }}
            textStyle={styles?.mediatorButtonText}
            isPrimary={true}
            title={t("refreshUser")}
            onPress={handleRefreshUser}
          />
          <Button
            style={{
              ...styles?.mediatorButton,
              width: "40%",
              backgroundColor: Colors?.black,
              borderColor: Colors?.black,
            }}
            textStyle={styles?.mediatorButtonText}
            isPrimary={true}
            title="Edit Profile"
            onPress={() => {
              return !isEditProfile && handleEditProfile();
            }}
          />
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

        <StatsCard />

        <UserInfoComponent user={userDetails} />

        <WallletInformation
          type="spents"
          wallet={userDetails?.spent}
          style={{ marginLeft: 20 }}
        />
        <ServiceInformation
          information={userDetails?.serviceDetails}
          style={{ marginLeft: 20 }}
        />

        <WallletInformation
          type="earnings"
          wallet={{ earnings }}
          style={{ marginLeft: 20 }}
        />
        <WorkInformation
          information={userDetails?.workDetails}
          style={{ marginLeft: 20 }}
        />

        <ProfileMenu disabled={userDetails?.status !== "ACTIVE"} />
      </ScrollView>
    </>
  );
};

export default AdminProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
  formContainer: {
    marginVertical: 20,
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
