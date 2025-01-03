import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import ModalComponent from "@/components/commons/Modal";
import { Controller, useForm } from "react-hook-form";
import DropdownComponent from "@/components/inputs/Dropdown";
import { WORKTYPES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/app/hooks/toast";
import { addBookingRequest } from "@/app/api/booking";
import DateField from "@/components/inputs/DateField";
import { isEmptyObject } from "@/constants/functions";
import Duration from "@/components/inputs/Duration";
import Loader from "@/components/commons/Loader";

interface AddBookingDetailsProps {
  refetch: any;
  id: any;
  isAddBookingModal: any;
  setIsAddBookingModal: any;
}

const AddBookingDetails = ({
  refetch,
  id,
  isAddBookingModal,
  setIsAddBookingModal,
}: AddBookingDetailsProps) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      address: "",
      location: {},
      startDate: new Date(),
      duration: 0,
    },
  });
  const [location, setLocation] = useState({});
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const mutationAddBookingRequest = useMutation({
    mutationKey: ["addBookingRequest", { id }],
    mutationFn: (payload: any) =>
      addBookingRequest({ workerID: id, ...payload }),
    onSuccess: (response) => {
      refetch();
      toast.success(t("workerBookedSuccessfully"));
      setIsAddBookingModal(false);
    },
  });

  const addBookingModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <View style={{ flexDirection: "column", gap: 20 }}>
          <Controller
            control={control}
            name="title"
            defaultValue=""
            rules={{
              required: t("workTitleIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="title"
                label={t("workType")}
                value={value}
                setValue={onChange}
                placeholder={t("selectWorkType")}
                emptyPlaceholder={t("pleaseSelectWorkTypeFirst")}
                options={WORKTYPES}
                errors={errors}
                containerStyle={errors?.title && styles.errorInput}
                search={false}
                icon={
                  <Ionicons
                    name={"mail-outline"}
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
            name="startDate"
            defaultValue={new Date()}
            rules={{
              required: t("startDateIsRequired"),
              validate: (value) => {
                if (new Date(value) < new Date()) {
                  return t("startDateNotEarlierThanToday");
                } else {
                  return true;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DateField
                title={t("startDate")}
                name="startDate"
                date={value}
                setDate={onChange}
                onBlur={onBlur}
                errors={errors}
              />
            )}
          />

          <Controller
            control={control}
            name="duration"
            defaultValue={0}
            rules={{
              required: t("durationIsRequired"),
              validate: (value) => {
                if (value <= 0) {
                  return t("durationMustBeGreaterThanZero");
                } else {
                  return true;
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Duration
                duration={value}
                setDuration={onChange}
                errors={errors}
                name="duration"
              />
            )}
          />
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Controller
              control={control}
              name="address"
              defaultValue=""
              rules={{
                required: t("addressIsRequired"),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AddLocationAndAddress
                  label={t("address")}
                  name="address"
                  address={value}
                  setAddress={onChange}
                  onBlur={onBlur}
                  location={location}
                  setLocation={setLocation}
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  errors={errors}
                  style={{ marginTop: 10 }}
                />
              )}
            />
          </View>
        </View>
      </View>
    );
  };

  const handleSubmitBooking = (data: any) => {
    console.log("handleSubmitBooking", data);
    mutationAddBookingRequest?.mutate(data);
  };

  return (
    <>
      <Loader loading={mutationAddBookingRequest?.isPending} />
      <ModalComponent
        title={t("addBookingDetails")}
        visible={isAddBookingModal}
        content={addBookingModalContent}
        onClose={() => setIsAddBookingModal(false)}
        primaryButton={{
          disabled: false,
          title: t("addBookingDetails"),
          styles: {
            backgroundColor: "red",
            borderColor: "red",
          },
          action: handleSubmit(handleSubmitBooking),
        }}
        secondaryButton={{
          title: t("cancel"),
          styles: "",
          action: () => setIsAddBookingModal(false),
        }}
      />
    </>
  );
};

export default AddBookingDetails;

const styles = StyleSheet.create({
  modalContent: {
    marginTop: 10,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
