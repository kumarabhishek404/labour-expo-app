import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Loader from "@/components/commons/Loaders/Loader";
import { useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import { fetchCurrentLocation } from "@/constants/functions";

const AddAddressWithLocation = ({
  userId,
  visible,
  onClose,
  onAfterSuccess,
}: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [locationAddress, setLocationAddress] = useState(null);
  const [inputAddress, setInputAddress]: any = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [tempAddress, setTempAddress] = useState(inputAddress);
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: { address: "" },
  });

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: (payload: any) =>
      USER?.updateUserById({ _id: userId, ...payload }),
    onSuccess: async () => {
      TOAST?.success(t("addressAddedSuccessfully"));
      onClose();
      await onAfterSuccess();
    },
    onError: (err) => console.error("Error updating address", err),
  });

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    let { location, address }: any = await fetchCurrentLocation();
    setIsFetchingLocation(false);

    if (address) {
      setLocationAddress(address);
      setValue("address", address);
      setInputAddress(address);
    } else {
      TOAST?.error("Something went wrong while fetching location.");
    }
  };

  const onAddAddress = (data: any) => {
    mutationUpdateProfileInfo.mutate({ address: data.address });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveAddress = () => {
    if (inputAddress.trim() !== "") {
      setLocationAddress(inputAddress);
      setIsEditing(false);
    } else {
      TOAST?.error("Address cannot be empty.");
    }
  };

  useEffect(() => {
    if (visible) {
      setDrawerState({
        visible: true,
        title: "addAddress",
        content: modalContent,
        primaryButton: {
          title: "saveAddress",
          action: handleSubmit(onAddAddress),
          disabled: !watch("address"),
        },
        secondaryButton: { title: "cancel", action: onClose },
      });
    }
  }, [visible, locationAddress, isEditing, inputAddress]);

  const modalContent = () => (
    <View style={{ marginVertical: 20 }}>
      <Loader loading={mutationUpdateProfileInfo?.isPending} />
      <TouchableOpacity
        style={styles.fetchButton}
        onPress={fetchLocation}
        disabled={isFetchingLocation}
      >
        {isFetchingLocation && (
          <ActivityIndicator
            size="small"
            color="white"
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={styles.fetchButtonText}>
          {t("pleaseFetchCurrentLocation")}
        </Text>
      </TouchableOpacity>
      {locationAddress && !isEditing ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{locationAddress}</Text>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.editButton}>{t("edit")}</Text>
          </TouchableOpacity>
        </View>
      ) : isEditing ? (
        <View>
          <TextInputComponent
            placeholder=""
            name="address"
            label="address"
            value={tempAddress}
            onChangeText={(value: any) => setTempAddress(value)}
            onBlur={() => setInputAddress(tempAddress)} // Update main state only on blur
          />
          <TouchableOpacity
            style={[
              styles.saveButton,
              inputAddress.trim() === "" && { opacity: 0.5 },
            ]}
            onPress={handleSaveAddress}
            disabled={inputAddress.trim() === ""}
          >
            <Text style={styles.saveButtonText}>{t("save")}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return <Loader loading={mutationUpdateProfileInfo?.isPending} />;
};

const styles = StyleSheet.create({
  fetchButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fetchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addressContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressText: {
    flex: 1,
  },
  editButton: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddAddressWithLocation;
