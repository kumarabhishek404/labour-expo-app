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
      toast.error("Address already exists");
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
    toast.success("Address added successfully");
  };

  const modalContent = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="village"
            rules={{
              required: "Village is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder="Village"
                onChangeText={onChange}
                label="Village"
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
              required: "Post is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder="Post"
                onChangeText={onChange}
                label="Post"
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
              required: "City is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder="City"
                onChangeText={onChange}
                label="City"
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
              required: "Pin Code is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder="Pin Code"
                onChangeText={onChange}
                label="Pin Code"
                name="pinCode"
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
              required: "State is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                label="State"
                value={value}
                setValue={onChange}
                placeholder="Select State"
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
              required: "Country is required",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputComponent
                value={value}
                style={styles.textInput}
                placeholder="Country"
                onChangeText={onChange}
                label="Country"
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

          {/* <TextInputComponent
            value={post}
            style={styles.textInput}
            placeholder="Post"
            onChangeText={setPost}
            label="Post"
            name="post"
            icon={
              <MaterialIcons
                name="local-post-office"
                style={styles.icon}
                size={28}
                color={Colors.secondary}
              />
            }
          />
          <TextInputComponent
            value={city}
            style={styles.textInput}
            placeholder="City"
            onChangeText={setCity}
            label="City"
            name="city"
            icon={
              <FontAwesome5
                name="city"
                style={styles.icon}
                size={20}
                color={Colors.secondary}
              />
            }
          />
          <TextInputComponent
            value={pinCode}
            style={styles.textInput}
            placeholder="Pin Code"
            onChangeText={setPinCode}
            label="Pin Code"
            name="pinCode"
            icon={
              <Feather
                name="map-pin"
                style={styles.icon}
                size={22}
                color={Colors.secondary}
              />
            }
          />

          <DropdownComponent
            label="State"
            value={state}
            setValue={(state: any) => setState(state)}
            placeholder="Select State"
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
          <TextInputComponent
            value={country}
            style={styles.textInput}
            placeholder="Country"
            onChangeText={() => {}}
            label="Country"
            name="country"
            icon={
              <FontAwesome
                name="flag"
                style={styles.icon}
                size={22}
                color={Colors.secondary}
              />
            }
          /> */}
        </View>
      </ScrollView>
    );
  };

  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      title="Add Address"
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
