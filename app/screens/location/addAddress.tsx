import { ScrollView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Button from "@/components/inputs/Button";
import { STETESOFINDIA } from "@/constants";
import TOAST from "@/app/hooks/toast";
import ModalComponent from "@/components/commons/Modal";
import Atoms from "@/app/AtomStore";
import { useAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Loader from "@/components/commons/Loader";
import { ALL_INDIAN_VILLAGES } from "@/constants/india";
import DropdownComponent from "./dropdown";

const AddAddressModal = ({ visible, onClose, setAddress }: any) => {
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: "India",
      state: "",
      district: "",
      subDistrict: "",
      village: "",
      pinCode: "",
    },
  });

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data
      );
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
    },
  });

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedSubDistrict = watch("subDistrict");

  const states = ALL_INDIAN_VILLAGES.map((item) => ({
    label: item.state,
    value: item.state,
  }));

  const districts =
    selectedState &&
    ALL_INDIAN_VILLAGES.find(
      (item) => item.state === selectedState
    )?.districts.map((item) => ({
      label: item.district,
      value: item.district,
    }));

  const subDistricts =
    selectedDistrict &&
    ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
      ?.districts.find((item) => item.district === selectedDistrict)
      ?.subDistricts.map((item) => ({
        label: item.subDistrict,
        value: item.subDistrict,
      }));

  const villages =
    selectedSubDistrict &&
    ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
      ?.districts.find((item) => item.district === selectedDistrict)
      ?.subDistricts.find((item) => item.subDistrict === selectedSubDistrict)
      ?.villages.map((item) => ({
        label: item,
        value: item,
      }));

  const onSubmit = async (data: any) => {
    const address = `${data.village}, ${data.subDistrict}, ${data.district}, ${data.state}, ${data?.pinCode}`;

    if (userDetails?.savedAddresses?.includes(address)) {
      TOAST?.showToast?.error(t("addressAlreadyExists"));
      return;
    }

    setAddress({
      address,
      selected: true,
    });

    setUserDetails({
      ...userDetails,
      savedAddresses: [...(userDetails?.savedAddresses ?? []), address],
    });

    if (userDetails?.isAuth) {
      await mutationUpdateProfileInfo.mutate({
        savedAddresses: address,
      });
    }
    reset();
    onClose();
    TOAST?.showToast?.success(t("addressAddedSuccessfully"));
  };

  const modalContent = () => {
    return (
      <ScrollView style={{paddingVertical: 20}} showsVerticalScrollIndicator={false}>
        <Loader loading={mutationUpdateProfileInfo?.isPending} />
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="state"
            rules={{
              required: t("stateIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="state"
                label={t("state")}
                value={value}
                setValue={onChange}
                placeholder={t("selectState")}
                errors={errors}
                containerStyle={errors?.state && styles.errorInput}
                search={false}
                options={states || []}
                icon={
                  <FontAwesome6
                    style={styles.icon}
                    color="black"
                    name="map-location"
                    size={20}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="district"
            rules={{
              required: t("districtIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="district"
                label={t("district")}
                value={value}
                setValue={onChange}
                placeholder={
                  selectedState
                    ? t("selectDistrict")
                    : t("pleaseSelectStateFirst")
                }
                disabled={!selectedState}
                errors={errors}
                containerStyle={errors?.district && styles.errorInput}
                search={false}
                options={districts || []}
                icon={
                  <FontAwesome6
                    style={styles.icon}
                    color="black"
                    name="map-location"
                    size={20}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="subDistrict"
            rules={{
              required: t("subDistrictIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="subDistrict"
                label={t("subDistrict")}
                value={value}
                setValue={onChange}
                placeholder={
                  selectedDistrict
                    ? t("selectSubDistrict")
                    : t("pleaseSelectDistrictFirst")
                }
                disabled={!selectedDistrict}
                errors={errors}
                containerStyle={errors?.subDistrict && styles.errorInput}
                search={false}
                options={subDistricts || []}
                icon={
                  <FontAwesome6
                    style={styles.icon}
                    color="black"
                    name="map-location"
                    size={20}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="village"
            rules={{
              required: t("villageIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="village"
                label={t("village")}
                value={value}
                setValue={onChange}
                placeholder={
                  selectedSubDistrict
                    ? t("selectVillage")
                    : t("pleaseSelectSubDistrictFirst")
                }
                disabled={!selectedSubDistrict}
                errors={errors}
                containerStyle={errors?.village && styles.errorInput}
                search={false}
                options={villages || []}
                icon={
                  <FontAwesome6
                    style={styles.icon}
                    color="black"
                    name="map-location"
                    size={20}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="pinCode"
            rules={{
              required: t("pinCodeIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder={t("pinCode")}
                onChangeText={onChange}
                label={t("pinCode")}
                maxLength={6}
                name="pinCode"
                type="number"
                containerStyle={errors?.pinCode && styles.errorInput}
                errors={errors}
                icon={
                  <Feather
                    name="map-pin"
                    style={styles.icon}
                    size={22}
                    color={Colors.secondary}
                  />
                }
              />
            )}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title={t("addAddress")}
      content={modalContent}
      primaryButton={{
        action: handleSubmit(onSubmit),
      }}
      secondaryButton={{
        action: onClose,
      }}
    />
  );
};

export default AddAddressModal;

const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
  },
  textInput: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
    color: Colors.secondary,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
