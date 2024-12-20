import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  BackHandler,
  StatusBar,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import {
  AccountStatusAtom,
  EarningAtom,
  SpentAtom,
  UserAtom,
} from "../AtomStore/user";
import { useAtom, useAtomValue } from "jotai";
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
import StatsCard from "@/components/commons/LikesStats";
import ProfileMenu from "@/components/commons/ProfileMenu";
import InactiveAccountMessage from "@/components/commons/InactiveAccountMessage";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import { useLocale } from "../context/locale";
import PendingApprovalMessage from "@/components/commons/PendingApprovalAccountMessage";
import TeamAdminCard from "@/components/commons/TeamAdminCard";

const ProfileScreen = () => {
  useLocale();
  const isAccountInactive = useAtomValue(AccountStatusAtom);
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const [earnings, setEarnings] = useAtom(EarningAtom);
  const [spents, setSpents] = useAtom(SpentAtom);

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
      firstName: userDetails?.firstName,
      lastName: userDetails?.lastName,
      address: userDetails?.address,
    },
  });

  useEffect(() => {
    const backAction = () => {
      if (isAccountInactive) {
        toast.error(
          userDetails?.status === "SUSPENDED"
            ? "Profile Suspended"
            : "Approval Is Pending",
          `You can't go back until your profile is ${
            userDetails?.status === "SUSPENDED" ? "suspended" : "not approved"
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
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
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
              marginTop: 50,
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
                gap: 5,
              }}
            >
              <CustomHeading>
                {userDetails?.firstName || "Name"}{" "}
                {userDetails?.lastName || "Name"}
              </CustomHeading>
              <CustomText style={styles.caption}>
                {userDetails?.role}
              </CustomText>
            </View>
          </View>
        </View>

        {userDetails?.status === "SUSPENDED" && <InactiveAccountMessage />}
        {userDetails?.status === "PENDING" && <PendingApprovalMessage />}
        <View
          style={[
            styles?.changeRoleWrapper,
            (userDetails?.status === "SUSPENDED" ||
              userDetails?.status === "PENDING") && {
              pointerEvents: "none",
              opacity: 0.5,
            },
          ]}
        >
          <Button
            disabled={true}
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
              return !isEditProfile && handleEditProfile();
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

        <StatsCard />

        {userDetails?.role !== "EMPLOYER" && (
          <SkillSelector
            canAddSkills={
              userDetails?.status !== "SUSPENDED" &&
              userDetails?.status !== "PENDING"
            }
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

        {(userDetails?.role === "WORKER" ||
          userDetails?.role === "MEDIATOR") && (
          <>
            <WallletInformation
              type="earnings"
              wallet={{ earnings }}
              style={{ marginLeft: 20 }}
            />
            <WorkInformation
              information={userDetails}
              style={{ marginLeft: 20 }}
            />
          </>
        )}

        {userDetails?.employedBy && (
          <TeamAdminCard admin={userDetails?.employedBy} />
        )}

        <ProfileMenu
          disabled={
            userDetails?.status === "SUSPENDED" ||
            userDetails?.status === "PENDING"
          }
        />
      </ScrollView>
    </>
  );
};

export default ProfileScreen;

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
  formContainer: {
    marginTop: 20,
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
