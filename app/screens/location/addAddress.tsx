import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
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
import ButtonComp from "@/components/inputs/Button";
import { Checkbox } from "react-native-paper";
import ProfileTabs from "@/components/inputs/TabsSwitcher";
import CustomText from "@/components/commons/CustomText";

const AddAddressDrawer = ({
  userId,
  visible,
  isMainAddress,
  onClose,
  type,
  setAddress,
}: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const { refreshUser } = REFRESH_USER.useRefreshUser();
  const [selectedTab, setSelectedTab] = useState(
    type === "primary" ? "savedAddresses" : "addNewAddress"
  );
  const [districts, setDistricts]: any = useState([]);
  const [subDistricts, setSubDistricts]: any = useState([]);
  const [villages, setVillages]: any = useState([]);
  const [additionalDetails, setAdditionalDetails]: any = useState("");
  const [pinCode, setPinCode]: any = useState("");
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [allStateVillages, setAllStateVillages]: any = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationAddress, setLocationAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    userDetails?.address || ""
  );

  const { watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      country: "India",
      state: "",
      district: "",
      subDistrict: "",
      village: "",
      pinCode: "",
      additionalDetails: "",
      location: {},
    },
  });

  const states = STATES.map((item) => ({
    label: item,
    value: item,
  }));

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
      // setValue("pinCode", "");
      // setValue("additionalDetails", "");
      setPinCode("");
      setAdditionalDetails("");
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
      // setValue("pinCode", "");
      // setValue("additionalDetails", "");
      setPinCode("");
      setAdditionalDetails("");
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
      // setValue("pinCode", "");
      // setValue("additionalDetails", "");
      setPinCode("");
      setAdditionalDetails("");
    }
  }, [selectedSubDistrict, allStateVillages]);

  const onAddAddress = async (data: any) => {
    const address =
      selectedTab === "savedAddresses"
        ? selectedAddress
        : isEditing
        ? `${additionalDetails} ${data.village}, ${data.subDistrict}, ${data.district}, ${data.state}, ${pinCode}`
        : locationAddress;

    console.log("Addres---", address, selectedTab);

    const isAddressAlreadySaved = userDetails?.savedAddresses?.some(
      (savedAddress: string) =>
        JSON.stringify(savedAddress) === JSON.stringify(address)
    );

    const finalSavedAddress = isAddressAlreadySaved
      ? userDetails?.savedAddresses
      : [...(userDetails?.savedAddresses ?? []), address];

    setSelectedAddress(address);

    if (type === "secondary") setAddress({ address: address });

    setUserDetails((prev: any) => ({
      ...prev,
      ...(isMainAddress
        ? {
            address, // If main address, update the address field
            savedAddresses: finalSavedAddress, // Add to savedAddresses if not present
          }
        : {
            savedAddresses: finalSavedAddress, // Add to savedAddresses if not present
          }),
    }));

    if (isMainAddress)
      mutationUpdateProfileInfo.mutate(
        isAddressAlreadySaved
          ? { address, location: watch("location") }
          : { address, savedAddresses: address, location: watch("location") }
      );
    else if (!isAddressAlreadySaved)
      mutationUpdateProfileInfo.mutate({ savedAddresses: address });
    else return;
  };

  const handleSelectAddress = (address: string) => {
    setSelectedAddress(address);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const fetchStateDetailsMutation = useMutation({
    mutationKey: ["fetchStateDetails"],
    mutationFn: (payload: any) => SERVICE?.fetchAllVillages(payload),
    onSuccess: (response: any) => {
      setAllStateVillages(response);
    },
    onError: (err) => {
      setDistricts([]);
      setValue("state", "");
    },
  });

  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    let { location, address, addressObject }: any =
      await fetchCurrentLocation();
    if (address) {
      setLocationAddress(address);
      setValue("location", location);
      setValue("state", addressObject?.region);
      setValue("pinCode", addressObject?.postalCode);
    } else {
      TOAST?.error("Something went wrong while fetching location.");
    }
    setIsFetchingLocation(false);
  };

  const renderSavedAddresses = () => (
    <View style={{ marginTop: 20 }}>
      {userDetails?.savedAddresses &&
      userDetails?.savedAddresses?.length > 0 ? (
        <>
          {userDetails?.savedAddresses?.map((address: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.addressItem}
              onPress={() => handleSelectAddress(address)}
            >
              <Checkbox
                status={selectedAddress === address ? "checked" : "unchecked"}
                onPress={() => handleSelectAddress(address)}
              />
              <Text style={styles.addressText}>{address}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View>
          <CustomText>{t("notFoundAnySavedAddress")}</CustomText>
        </View>
      )}
    </View>
  );

  const renderAddNewAddress = () => (
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
          <TouchableOpacity onPress={() => setIsEditing(false)}>
            <CustomText
              textAlign="right"
              fontWeight="600"
              baseFont={18}
              color={Colors?.link}
            >
              {t("fetchCurrentLocation")}
            </CustomText>
          </TouchableOpacity>
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
            name="additionalDetails"
            label="additionalDetails"
            placeholder={t("enterAdditionalDetails")}
            style={styles.textInput}
            value={additionalDetails}
            onChangeText={(value: any) => {
              console.log("Additional Details", value);

              setAdditionalDetails(value);
              // setValue("additionalDetails", value);
            }}
            icon={
              <FontAwesome6
                name="house-chimney-crack"
                style={styles.icon}
                size={22}
                color={Colors.secondary}
              />
            }
          />
          <TextInputComponent
            name="pinCode"
            label="pinCode"
            placeholder={t("pinCode")}
            type="number"
            style={styles.textInput}
            value={pinCode}
            onChangeText={(value: any) => {
              // Allow only numbers and enforce exactly 6 digits
              if (/^\d{0,6}$/.test(value)) {
                // setValue("pinCode", value);
                setPinCode(value);
              }
            }}
            icon={
              <FontAwesome
                name="map-marker"
                style={styles.icon}
                size={28}
                color={Colors.secondary}
              />
            }
          />
        </View>
      ) : null}
    </View>
  );

  const modalContent = () => (
    <View>
      {type === "primary" && (
        <ProfileTabs
          tabs={["savedAddresses", "addNewAddress"]}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          containerStyle={{ backgroundColor: Colors?.background }}
          textStyle={{ color: Colors?.primary }}
          indicator={{ backgroundColor: Colors?.primary }}
        />
      )}
      {type === "secondary" || selectedTab === "addNewAddress"
        ? renderAddNewAddress()
        : renderSavedAddresses()}
    </View>
  );

  useEffect(() => {
    if (visible) {
      setDrawerState({
        visible: true,
        title: "addAddress",
        content: modalContent,
        primaryButton: {
          title: "saveAddress",
          action: handleSubmit(onAddAddress),
          disabled:
            (selectedTab === "savedAddresses" &&
              userDetails?.savedAddresses?.length === 0) ||
            (selectedTab === "addNewAddress" &&
              isEditing &&
              (!watch("state") ||
                !watch("district") ||
                !watch("subDistrict") ||
                !watch("village") ||
                pinCode?.length < 6)) ||
            (selectedTab === "addNewAddress" && !isEditing && !locationAddress),
          // (!selectedAddress && !isEditing),
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
    selectedTab,
    selectedAddress,
    locationAddress,
    isEditing,
    selectedState,
    districts,
    selectedDistrict,
    subDistricts,
    selectedSubDistrict,
    villages,
    watch("village"),
    pinCode,
    additionalDetails,
    isFetchingLocation,
    fetchStateDetailsMutation?.isPending,
    mutationUpdateProfileInfo?.isPending,
    userDetails,
  ]);

  return <Loader loading={mutationUpdateProfileInfo?.isPending} />;
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 10,
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 5,
  },
  inactiveTab: {
    color: "gray",
  },
  addManuallyText: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  editButton: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  addressText: {
    flex: 1,
  },
  addressContainer: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});

export default AddAddressDrawer;
