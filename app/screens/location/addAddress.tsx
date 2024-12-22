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
import DropdownComponent from "@/components/inputs/Dropdown";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import Button from "@/components/inputs/Button";
import { STETESOFINDIA } from "@/constants";
import { toast } from "@/app/hooks/toast";
import ModalComponent from "@/components/commons/Modal";
import { UserAtom } from "@/app/AtomStore/user";
import { useAtom } from "jotai";
import { Controller, useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";

const AddAddressModal = ({ visible, onClose, setAddress }: any) => {
  const [userDetails, setUserDetails] = useAtom(UserAtom);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      village: "",
      post: "",
      city: "",
      pinCode: "",
      state: "",
      country: "India",
    },
  });

  const onSubmit = (data: any) => {
    const address = `${data?.village}, ${data?.post} ${data?.city} ${data?.pinCode} ${data?.state} ${data?.country}`;

    if (userDetails?.serviceAddress?.includes(address)) {
      toast.error(t("addressAlreadyExists"));
      return;
    }

    setAddress({
      address,
      selected: true,
    });

    setUserDetails({
      ...userDetails,
      serviceAddress: [...(userDetails?.serviceAddress || []), address],
    });
    reset();
    onClose();
    toast.success(t("addressAddedSuccessfully"));
  };

  const modalContent = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="village"
            rules={{
              required: t("villageIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder={t("village")}
                onChangeText={onChange}
                label={t("village")}
                name="village"
                containerStyle={errors?.village && styles.errorInput}
                errors={errors}
                icon={
                  <Fontisto
                    name="holiday-village"
                    style={styles.icon}
                    size={22}
                    color={Colors.secondary}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="post"
            rules={{
              required: t("postIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder={t("post")}
                onChangeText={onChange}
                label={t("post")}
                name="post"
                containerStyle={errors?.post && styles.errorInput}
                errors={errors}
                icon={
                  <MaterialIcons
                    name="local-post-office"
                    style={styles.icon}
                    size={22}
                    color={Colors.secondary}
                  />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            rules={{
              required: t("cityIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder={t("city")}
                onChangeText={onChange}
                label={t("city")}
                name="city"
                containerStyle={errors?.city && styles.errorInput}
                errors={errors}
                icon={
                  <FontAwesome5
                    name="city"
                    style={styles.icon}
                    size={22}
                    color={Colors.secondary}
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
                options={STETESOFINDIA}
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
            name="country"
            rules={{
              required: t("countryIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder={t("country")}
                onChangeText={onChange}
                label={t("country")}
                name="country"
                containerStyle={errors?.country && styles.errorInput}
                errors={errors}
                icon={
                  <FontAwesome
                    name="flag"
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
    padding: 16,
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
