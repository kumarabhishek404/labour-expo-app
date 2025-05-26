import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Button from "../inputs/Button";
import CustomText from "./CustomText";
import ModalComponent from "./Modal";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Atoms from "@/app/AtomStore";
import { useAtom, useSetAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import TextInputComponent from "../inputs/TextInputWithIcon";
import { Ionicons } from "@expo/vector-icons";
import EmailAddressField from "../inputs/EmailAddress";
import { t } from "@/utils/translationHelper";
import AddLocationAndAddress from "./AddLocationAndAddress";
import Gender from "../inputs/Gender";
import DateField from "../inputs/DateField";
import moment from "moment";
import { isEmptyObject } from "@/constants/functions";
import Loader from "./Loaders/Loader";
import REFRESH_USER from "@/app/hooks/useRefreshUser";

const ProfileNotification: React.FC = () => {
  const [isCompleteProfileModel, setIsCompleteProfileModel] = useState(false);
  const setDrawerState: any = useSetAtom(Atoms?.SideDrawerAtom);
  const [location, setLocation] = useState<any>({});
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );
  const { refreshUser, isLoading } = REFRESH_USER.useRefreshUser();

  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userDetails?.email?.value || "",
      address: userDetails?.address || "",
      location: userDetails?.location || {},
      dateOfBirth:
        userDetails?.dateOfBirth ||
        moment().subtract(18, "years").startOf("year"),
      gender: userDetails?.gender || "",
    },
  });

  useEffect(() => {
    setValue("email", userDetails?.email?.value);
    setValue("address", userDetails?.address);
    setValue("location", userDetails?.location);
    setValue(
      "dateOfBirth",
      userDetails?.dateOfBirth || moment().subtract(18, "years").startOf("year")
    );
    setValue("gender", userDetails?.gender);
  }, [isCompleteProfileModel, userDetails]);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["completeProfile"],
    mutationFn: (payload: any) =>
      USER?.updateUserById({
        _id: userDetails?._id,
        ...payload,
      }),
    onSuccess: (response) => {
      let user = response?.data?.data;
      refreshUser();
      setUserDetails({
        ...userDetails,
        email: user?.email?.value,
        address: user?.address,
        location: user?.location,
        dateOfBirth: user?.dateOfBirth,
        gender: user?.gender,
      });
      setDrawerState({ visible: false }); // Close the drawer after success
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
      setIsCompleteProfileModel(false);
    },
  });

  const onSubmitCompleteProfile = (data: any) => {
    let updatedFields: any = {};

    if (data.email && data.email !== userDetails?.email?.value) {
      updatedFields.email = data.email;
    }
    if (data.address && data.address !== userDetails?.address) {
      updatedFields.address = data.address;
    }
    if (data.dateOfBirth && data.dateOfBirth !== userDetails?.dateOfBirth) {
      updatedFields.dateOfBirth = moment(data.dateOfBirth).format("YYYY-MM-DD");
    }
    if (data.gender && data.gender !== userDetails?.gender) {
      updatedFields.gender = data.gender;
    }

    if (Object.keys(updatedFields).length > 0) {
      const payload = {
        _id: userDetails?._id,
        ...updatedFields,
      };

      console.log("Payload being sent:", payload);
      mutationUpdateProfileInfo.mutate(payload);
    }
  };

  const completeProfileModalContent = () => {
    return (
      <View style={styles.formContainer}>
        <View style={{ flexDirection: "column", gap: 25 }}>
          {!userDetails?.email?.value && (
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
          )}

          {!userDetails?.address && (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Controller
                control={control}
                name="address"
                defaultValue=""
                render={({ field: { onChange, onBlur, value } }) => (
                  <AddLocationAndAddress
                    label={t("address")}
                    name="address"
                    address={value}
                    setAddress={onChange}
                    location={location}
                    setLocation={setLocation}
                    selectedOption={selectedOption}
                    errors={errors}
                  />
                )}
              />
            </View>
          )}

          {!userDetails?.dateOfBirth && (
            <Controller
              control={control}
              name="dateOfBirth"
              defaultValue={moment().subtract(18, "years").startOf("year")}
              rules={{
                // required: t("dateOfBirthIsRequired"),
                validate: (value) => {
                  const selectedDate = moment(value);
                  const today = moment(new Date());
                  const eighteenYearsAgo = moment(new Date());
                  eighteenYearsAgo.set("year", today.year() - 18);

                  if (selectedDate > eighteenYearsAgo) {
                    return t("youMustBeAtLeast18YearsOld");
                  } else {
                    return true;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateField
                  title={t("dateOfBirth")}
                  name="dateOfBirth"
                  type="dateOfBirth"
                  date={moment(value)}
                  setDate={onChange}
                  errors={errors}
                />
              )}
            />
          )}

          {!userDetails?.gender && (
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, onBlur, value } }) => (
                <Gender
                  name="gender"
                  label={t("whatIsYourGender")}
                  options={[
                    { title: t("male"), value: "male", icon: "👩‍🦰" },
                    { title: t("female"), value: "female", icon: "👨" },
                    { title: t("other"), value: "other", icon: "✨" },
                  ]}
                  gender={value}
                  setGender={onChange}
                  errors={errors}
                />
              )}
            />
          )}
        </View>
      </View>
    );
  };

  const handleCompleteProfile = () => {
    setDrawerState({
      visible: true,
      title: "completeProfile",
      content: completeProfileModalContent,
      primaryButton: {
        title: "save",
        action: handleSubmit(onSubmitCompleteProfile),
      },
      secondaryButton: {
        title: "cancel",
        action: () => setDrawerState({ visible: false }),
      },
    });
  };

  return (
    <View style={styles.notificationContainer}>
      <Loader loading={mutationUpdateProfileInfo?.isPending || isLoading} />
      <CustomText
        textAlign="left"
        baseFont={16}
        color={Colors?.white}
        fontWeight="600"
        style={styles?.text}
      >
        {t("completeYourProfileToUnlockAllFeatures")}
      </CustomText>
      <Button
        isPrimary={true}
        title={t("completeProfile")}
        onPress={handleCompleteProfile}
        style={styles.completeButton}
        textStyle={{ fontSize: 18 }}
      />

      <ModalComponent
        visible={isCompleteProfileModel}
        title={t("completeProfile")}
        onClose={() => setIsCompleteProfileModel(false)}
        content={completeProfileModalContent}
        primaryButton={{
          action: handleSubmit(onSubmitCompleteProfile),
        }}
        secondaryButton={{
          action: () => setIsCompleteProfileModel(false),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: Colors.tertiery,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    borderRadius: 8,
  },
  text: {
    flex: 1,
  },
  completeButton: {
    width: "40%",
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  formContainer: {
    paddingVertical: 20,
  },
});

export default ProfileNotification;
