import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from "react-native";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import PaperDropdown from "@/components/inputs/Dropdown";
import { useAtom, useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";
import TOAST from "@/app/hooks/toast";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import Loader from "@/components/commons/Loaders/Loader";
import { useForm } from "react-hook-form";
import { t } from "@/utils/translationHelper";
import { STATES } from "@/constants";
import SERVICE from "@/app/api/services";
import { fetchCurrentLocation } from "@/constants/functions";
import REFRESH_USER from "@/app/hooks/useRefreshUser";
import CustomText from "@/components/commons/CustomText";
import ButtonComp from "@/components/inputs/Button";

const AddAddressDrawer = ({ userId, visible, isMainAddress, onClose }: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [districts, setDistricts]: any = useState([]);
  const [subDistricts, setSubDistricts]: any = useState([]);
  const [villages, setVillages]: any = useState([]);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [allStateVillages, setAllStateVillages]: any = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationAddress, setLocationAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      country: "India",
      state: "",
      district: "",
      subDistrict: "",
      village: "",
      pinCode: "",
      location: {},
    },
  });

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedSubDistrict = watch("subDistrict");

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: (payload: any) =>
      USER?.updateUserById({
        _id: userId,
        ...payload,
      }),
    onSuccess: async (response) => {
      setDrawerState({
        visible: false,
        title: "",
        content: () => null,
        primaryButton: null,
        secondaryButton: null,
      });
      await refreshUser();
      onClose();
      reset();
      setIsEditing(false);
      setLocationAddress("");
      TOAST?.success(t("addressAddedSuccessfully"));
      console.log("Address updated successfully", response?.data?.data);
    },
    onError: (err) => {
      console.error("Error updating address", err);
    },
  });

  const fetchStateDetailsMutation = useMutation({
    mutationKey: ["fetchStateDetails"],
    mutationFn: (payload: any) => SERVICE?.fetchAllVillages(payload),
    onSuccess: (response: any) => {
      setAllStateVillages(response);
    },
  });

  // API Trigger on State Selection
  useEffect(() => {
    if (selectedState) {
      setDistricts([]);
      setSubDistricts([]);
      setVillages([]);
      fetchStateDetailsMutation.mutate({ stateName: selectedState });
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState) {
      const foundDistricts =
        allStateVillages?.districts?.map((item: any) => ({
          label: item.district,
          value: item.district,
        })) || [];

      setDistricts(foundDistricts);
      setSubDistricts([]);
      setVillages([]);

      setValue("district", "");
      setValue("subDistrict", "");
      setValue("village", "");
      setValue("pinCode", "");
    }
  }, [selectedState, allStateVillages]);

  useEffect(() => {
    if (selectedDistrict) {
      const foundSubDistricts =
        allStateVillages?.districts
          ?.find((item: any) => item?.district === selectedDistrict)
          ?.subDistricts?.map((item: any) => ({
            label: item.subDistrict,
            value: item.subDistrict,
          })) || [];

      setSubDistricts(foundSubDistricts);
      setVillages([]); // Reset villages

      setValue("subDistrict", "");
      setValue("village", "");
      setValue("pinCode", "");
    }
  }, [selectedDistrict, allStateVillages]);

  useEffect(() => {
    if (selectedSubDistrict) {
      const foundVillages =
        allStateVillages?.districts
          ?.find((item: any) => item?.district === selectedDistrict)
          ?.subDistricts?.find(
            (item: any) => item.subDistrict === selectedSubDistrict
          )
          ?.villages?.map((item: any) => ({
            label: item,
            value: item,
          })) || [];

      setVillages(foundVillages);
      setValue("village", "");
      setValue("pinCode", "");
    }
  }, [selectedSubDistrict, allStateVillages]);

  const states = STATES.map((item) => ({
    label: item,
    value: item,
  }));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onAddAddress = async (data: any) => {
    const address = isEditing
      ? `${data.village}, ${data.subDistrict}, ${data.district}, ${data.state}, ${data?.pinCode}`
      : locationAddress;
    if (
      userDetails?.savedAddresses?.some(
        (savedAddress: string) =>
          JSON.stringify(savedAddress) === JSON.stringify(address)
      )
    ) {
      TOAST?.error(t("addressAlreadyExists"));
      return;
    }

    setUserDetails({
      ...userDetails,
      ...(isMainAddress
        ? { address } // If main address, update the address field
        : {
            savedAddresses: [...(userDetails?.savedAddresses ?? []), address],
          }),
    });

    mutationUpdateProfileInfo.mutate(
      isMainAddress
        ? { address } // If main address, send in the "address" field
        : { savedAddresses: address } // Else, send in "savedAddresses"
    );
  };

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    let { location, address, addressObject }: any =
      await fetchCurrentLocation();

    if (address) {
      setLocationAddress(address);
      setValue("location", location);
      setValue("state", addressObject?.region);
      setValue("pinCode", addressObject?.postalCode);
      setIsFetchingLocation(false);
    } else {
      TOAST?.error("Something went wrong while fetching location.");
      setIsFetchingLocation(false);
    }
  };

  const modalContent = () => (
    <View style={{ marginTop: 20 }}>
      {!isEditing && (
        <>
          <ButtonComp
            isPrimary
            title={t("pleaseFetchCurrentLocation")}
            onPress={fetchLocation}
            loading={isFetchingLocation}
            disabled={isFetchingLocation}
          />

          <TouchableOpacity
            style={styles?.addManuallyText}
            onPress={handleEdit}
          >
            <Text style={styles.editButton}>{t("addAddressManually")}</Text>
          </TouchableOpacity>
        </>
      )}
      {locationAddress && !isEditing ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{locationAddress}</Text>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.editButton}>{t("edit")}</Text>
          </TouchableOpacity>
        </View>
      ) : isEditing ? (
        <View style={styles.formContainer}>
          <PaperDropdown
            name="state"
            label="state"
            options={states}
            selectedValue={selectedState}
            onSelect={(value: any) => setValue("state", value)}
            placeholder={t("selectState")}
            searchEnabled
            icon={
              <FontAwesome6
                style={styles.icon}
                color="black"
                name="map-location"
                size={20}
              />
            }
          />
          <PaperDropdown
            name="district"
            label="district"
            options={districts}
            selectedValue={selectedDistrict}
            onSelect={(value: any) => setValue("district", value)}
            placeholder={t("selectDistrict")}
            searchEnabled
            icon={
              <FontAwesome6
                style={styles.icon}
                color="black"
                name="map-location"
                size={20}
              />
            }
            disabled={!selectedState}
            isLoading={fetchStateDetailsMutation?.isPending}
          />
          <PaperDropdown
            name="subDistrict"
            label="subDistrict"
            options={subDistricts}
            selectedValue={selectedSubDistrict}
            onSelect={(value: any) => setValue("subDistrict", value)}
            placeholder={t("selectSubDistrict")}
            searchEnabled
            icon={
              <FontAwesome6
                style={styles.icon}
                color="black"
                name="map-location"
                size={20}
              />
            }
            disabled={!selectedDistrict}
          />
          {selectedSubDistrict && villages?.length === 0 ? null : (
            <PaperDropdown
              name="village"
              label="village"
              options={villages}
              selectedValue={watch("village")}
              onSelect={(value: any) => setValue("village", value)}
              placeholder={t("selectVillage")}
              searchEnabled
              icon={
                <FontAwesome6
                  style={styles.icon}
                  color="black"
                  name="map-location"
                  size={20}
                />
              }
              disabled={!selectedSubDistrict}
            />
          )}
          <TextInputComponent
            name="pinCode"
            label="pinCode"
            placeholder={t("pinCode")}
            type="number"
            style={styles.textInput}
            value={watch("pinCode")}
            onChangeText={(value: any) => {
              // Allow only numbers and enforce exactly 6 digits
              if (/^\d{0,6}$/.test(value)) {
                setValue("pinCode", value);
              }
            }}
            icon={
              <Feather
                name="map-pin"
                style={styles.icon}
                size={22}
                color={Colors.secondary}
              />
            }
          />
        </View>
      ) : null}
    </View>
  );

  useEffect(() => {
    if (visible) {
      setDrawerState({
        visible: true,
        title: "addAddress",
        content: modalContent,
        primaryButton: {
          title: "addAddress",
          action: handleSubmit(onAddAddress),
          disabled:
            (!locationAddress && !isEditing) ||
            (selectedSubDistrict && villages?.length === 0
              ? null
              : isEditing && !watch("village")) ||
            (isEditing && watch("pinCode")?.length !== 6),
        },
        secondaryButton: {
          title: "cancel",
          action: () => {
            onClose();
            setIsEditing(false);
            setDrawerState({ visible: false });
          },
        },
      });
    }
  }, [
    visible,
    selectedState,
    districts,
    selectedDistrict,
    subDistricts,
    selectedSubDistrict,
    villages,
    watch("village"),
    watch("pinCode"),
    locationAddress,
    isEditing,
    isFetchingLocation,
  ]);

  return <Loader loading={mutationUpdateProfileInfo?.isPending} />;
};

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
  fetchButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fetchButtonText: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
  },
  addManuallyText: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  addressContainer: {
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

export default AddAddressDrawer;
