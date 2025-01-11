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
import { filterSubCategories, isEmptyObject } from "@/constants/functions";
import Duration from "@/components/inputs/Duration";
import Loader from "@/components/commons/Loader";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import moment from "moment";
import NumberOfWorkers from "@/components/inputs/NumberOfWorkers";

interface AddBookingDetailsProps {
  refetch: any;
  id: any;
  role: any;
  isAddBookingModal: any;
  setIsAddBookingModal: any;
}

const AddBookingDetails = ({
  refetch,
  id,
  role,
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
      type: "",
      subType: "",
      address: "",
      location: {},
      startDate: new Date(),
      duration: 0,
      noOfWorkers: 0,
      description: "",
    },
  });
  const [location, setLocation] = useState({});
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const mutationAddBookingRequest = useMutation({
    mutationKey: ["addBookingRequest"],
    mutationFn: (payload: any) => addBookingRequest(payload),
    onSuccess: (response) => {
      refetch();
      toast.success(t("bookRequestSentSuccessfully"));
      setIsAddBookingModal(false);
    },
  });

  const addBookingModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <View style={{ flexDirection: "column", gap: 20 }}>
          <Controller
            control={control}
            name="type"
            defaultValue=""
            rules={{
              required: t("workTypeIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="type"
                label={t("workType")}
                value={value}
                setValue={onChange}
                placeholder={t("selectWorkType")}
                emptyPlaceholder={t("pleaseSelectWorkTypeFirst")}
                options={WORKTYPES}
                errors={errors}
                containerStyle={errors?.type && styles.errorInput}
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
            name="subType"
            defaultValue=""
            rules={{
              required: t("workSubTypeIsRequired"),
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DropdownComponent
                name="subType"
                label={t("workSubType")}
                value={value}
                setValue={onChange}
                placeholder={
                  watch("type")
                    ? t("selectWorkSubType")
                    : t("pleaseSelectWorkTypeFirst")
                }
                // emptyPlaceholder={t("pleaseSelectWorkTypeFirst")}
                options={filterSubCategories(watch("type"))}
                errors={errors}
                containerStyle={errors?.subType && styles.errorInput}
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
                if (moment(value) < moment(new Date())) {
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
                type="serviceDate"
                date={moment(value)}
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

          {role === "MEDIATOR" && (
            <Controller
              control={control}
              name="noOfWorkers"
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
                <NumberOfWorkers
                  noOfWorkers={value}
                  setNoOfWorkers={onChange}
                  errors={errors}
                  name="noOfWorkers"
                />
              )}
            />
          )}

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

          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <TextAreaInputComponent
                label={t("workDescription")}
                name="description"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Enter work description"
                containerStyle={errors?.description && styles.errorInput}
                errors={errors}
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
        </View>
      </View>
    );
  };

  const handleSubmitBooking = async (data: any) => {
    console.log("handleSubmitBooking", data);

    if (
      !data?.type ||
      !data?.subType ||
      !data?.address ||
      !data?.startDate ||
      !data?.duration
    ) {
      throw new Error("Required fields are missing");
    }

    const formData: any = new FormData();

    if (role === "MEDIATOR") {
      formData.append("requiredNumberOfWorkers", data?.noOfWorkers);
    }

    formData.append("userId", id);
    formData.append("type", data?.type);
    formData.append("subType", data?.subType);
    formData.append("duration", data?.duration);
    formData.append("description", data?.description);
    formData.append("address", data?.address);
    formData.append("location", JSON.stringify(data?.location || {}));
    formData.append("startDate", moment(data?.startDate).format("YYYY-MM-DD"));

    console.log("form Data --", formData);

    const response: any = await mutationAddBookingRequest?.mutate(formData);
    return response?.data;
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
