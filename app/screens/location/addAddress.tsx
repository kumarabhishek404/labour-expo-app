import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
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
import Loader from "@/components/commons/Loaders/Loader";
import { ALL_INDIAN_VILLAGES } from "@/constants/india";
import DropdownWithMenu from "@/components/inputs/DropdownWithMenu";
// import DropdownWithMenu from "@/components/inputs/dropdownWithMenu";

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
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [districts, setDistricts]: any = useState([]);
  const [subDistricts, setSubDistricts]: any = useState([]);
  const [villages, setVillages]: any = useState([]);

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedSubDistrict = watch("subDistrict");

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

  useEffect(() => {
    if (selectedState) {
      const foundDistricts =
        ALL_INDIAN_VILLAGES.find(
          (item) => item.state === selectedState
        )?.districts.map((item) => ({
          label: item.district,
          value: item.district,
        })) || [];
      setDistricts(foundDistricts);
      setValue("district", ""); // Reset dependent dropdowns
      setValue("subDistrict", "");
      setValue("village", "");
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      const foundSubDistricts =
        ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
          ?.districts.find((item) => item.district === selectedDistrict)
          ?.subDistricts.map((item) => ({
            label: item.subDistrict,
            value: item.subDistrict,
          })) || [];
      setSubDistricts(foundSubDistricts);
      setValue("subDistrict", ""); // Reset subDistrict and village
      setValue("village", "");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSubDistrict) {
      const foundVillages: any =
        ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
          ?.districts.find((item) => item.district === selectedDistrict)
          ?.subDistricts.find(
            (item) => item.subDistrict === selectedSubDistrict
          )
          ?.villages.map((item) => ({
            label: item,
            value: item,
          })) || [];
      setVillages(foundVillages);
      setValue("village", ""); // Reset village when sub-district changes
    }
  }, [selectedSubDistrict]);

  const states = ALL_INDIAN_VILLAGES.map((item) => ({
    label: item.state,
    value: item.state,
  }));

  // const districts =
  //   selectedState &&
  //   ALL_INDIAN_VILLAGES.find(
  //     (item) => item.state === selectedState
  //   )?.districts.map((item) => ({
  //     label: item.district,
  //     value: item.district,
  //   }));

  // const subDistricts =
  //   selectedDistrict &&
  //   ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
  //     ?.districts.find((item) => item.district === selectedDistrict)
  //     ?.subDistricts.map((item) => ({
  //       label: item.subDistrict,
  //       value: item.subDistrict,
  //     }));

  // const villages =
  //   selectedSubDistrict &&
  //   ALL_INDIAN_VILLAGES.find((item) => item.state === selectedState)
  //     ?.districts.find((item) => item.district === selectedDistrict)
  //     ?.subDistricts.find((item) => item.subDistrict === selectedSubDistrict)
  //     ?.villages.map((item) => ({
  //       label: item,
  //       value: item,
  //     }));

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
        _id: userDetails?._id,
        savedAddresses: address,
      });
    }
    reset();
    onClose();
    TOAST?.showToast?.success(t("addressAddedSuccessfully"));
  };

  const modalContent = () => {
    return (
      <ScrollView
        style={styles?.container}
        showsVerticalScrollIndicator={false}
      >
        <Loader loading={mutationUpdateProfileInfo?.isPending} />
        <View style={styles.formContainer}>
          <View style={{ zIndex: 9 }}>
            <Controller
              control={control}
              name="state"
              rules={{
                required: t("stateIsRequired"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownWithMenu
                  id="state"
                  label={t("state")}
                  options={states}
                  selectedValue={value}
                  onSelect={(value: any) => onChange(value)}
                  containerStyle={errors?.state && styles.errorInput}
                  placeholder={t("selectState")}
                  errors={errors}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
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
          </View>

          <View style={{ zIndex: 8 }}>
            <Controller
              control={control}
              name="district"
              rules={{
                required: t("districtIsRequired"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownWithMenu
                  id="district"
                  label={t("district")}
                  options={districts || []}
                  selectedValue={value}
                  onSelect={(value: any) => onChange(value)}
                  errors={errors}
                  containerStyle={errors?.district && styles.errorInput}
                  placeholder={
                    selectedState
                      ? t("selectDistrict")
                      : t("pleaseSelectStateFirst")
                  }
                  searchEnabled={false}
                  disabled={!selectedState}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
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
          </View>
          <View style={{ zIndex: 7 }}>
            <Controller
              control={control}
              name="subDistrict"
              rules={{
                required: t("subDistrictIsRequired"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownWithMenu
                  id="subDistrict"
                  label={t("subDistrict")}
                  placeholder={
                    selectedDistrict
                      ? t("selectSubDistrict")
                      : t("pleaseSelectDistrictFirst")
                  }
                  disabled={!selectedDistrict}
                  errors={errors}
                  containerStyle={errors?.subDistrict && styles.errorInput}
                  searchEnabled={false}
                  options={subDistricts || []}
                  icon={
                    <FontAwesome6
                      style={styles.icon}
                      color="black"
                      name="map-location"
                      size={20}
                    />
                  }
                  selectedValue={value}
                  onSelect={(value: any) => onChange(value)}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                />
              )}
            />
          </View>

          <View style={{ zIndex: 6 }}>
            <Controller
              control={control}
              name="village"
              rules={{
                required: t("villageIsRequired"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DropdownWithMenu
                  id="village"
                  label={t("village")}
                  placeholder={
                    selectedSubDistrict
                      ? t("selectVillage")
                      : t("pleaseSelectSubDistrictFirst")
                  }
                  disabled={!selectedSubDistrict}
                  errors={errors}
                  containerStyle={errors?.village && styles.errorInput}
                  searchEnabled={false}
                  options={villages || []}
                  icon={
                    <FontAwesome6
                      style={styles.icon}
                      color="black"
                      name="map-location"
                      size={20}
                    />
                  }
                  selectedValue={value}
                  onSelect={(value: any) => onChange(value)}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                />
              )}
            />
          </View>
          <View style={{ zIndex: 5 }}>
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
  container: {
    paddingVertical: 20,
  },
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
