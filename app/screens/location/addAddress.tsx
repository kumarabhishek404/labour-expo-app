import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
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
import { ALL_INDIAN_VILLAGES } from "@/constants/india";
import { STATES, STETESOFINDIA } from "@/constants";
import SERVICE from "@/app/api/services";

const AddAddressDrawer = ({
  userId,
  visible,
  onClose,
  onAfterSuccess,
}: any) => {
  const setDrawerState: any = useSetAtom(Atoms?.BottomDrawerAtom);
  const [districts, setDistricts]: any = useState([]);
  const [subDistricts, setSubDistricts]: any = useState([]);
  const [villages, setVillages]: any = useState([]);
  const [isLoading, setIsLoading]: any = useState(false);
  const [userDetails, setUserDetails] = useAtom(Atoms?.UserAtom);
  const [allStateVillages, setAllStateVillages]: any = useState([]);
  const { watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      country: "India",
      state: "",
      district: "",
      subDistrict: "",
      village: "",
      pinCode: "",
    },
  });

  const selectedState = watch("state");
  const selectedDistrict = watch("district");
  const selectedSubDistrict = watch("subDistrict");

  console.log("userId --", userId);

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
      onClose();
      reset();
      TOAST?.success(t("addressAddedSuccessfully"));
      await onAfterSuccess();
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
      setIsLoading(false);
      // Extract districts, subDistricts, and villages from the API response
      setAllStateVillages(response);
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Error fetching state details:", error);
      TOAST?.error("Failed to fetch location details. Please try again later.");
    },
  });

  // API Trigger on State Selection
  useEffect(() => {
    if (selectedState) {
      setIsLoading(true);
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

  const onAddAddress = async (data: any) => {
    const address = `${data.village}, ${data.subDistrict}, ${data.district}, ${data.state}, ${data?.pinCode}`;
    if (userDetails?.savedAddresses?.includes(address)) {
      TOAST?.error(t("addressAlreadyExists"));
      return;
    }

    setUserDetails({
      ...userDetails,
      savedAddresses: [...(userDetails?.savedAddresses ?? []), address],
    });

    await mutationUpdateProfileInfo.mutate({
      address: address,
    });
  };

  const modalContent = () => (
    <View style={{ marginVertical: 20 }}>
      <Loader loading={mutationUpdateProfileInfo?.isPending} />
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
            (selectedSubDistrict && villages?.length === 0
              ? null
              : !watch("village")) || watch("pinCode")?.length !== 6,
        },
        secondaryButton: {
          title: "cancel",
          action: () => {
            onClose();
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
});

export default AddAddressDrawer;
