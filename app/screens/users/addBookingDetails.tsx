import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { Controller, useForm } from "react-hook-form";
import { WORKTYPES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import { useMutation } from "@tanstack/react-query";
import TOAST from "@/app/hooks/toast";
import DateField from "@/components/inputs/DateField";
import { filterSubCategories, isEmptyObject } from "@/constants/functions";
import Duration from "@/components/inputs/Duration";
import Loader from "@/components/commons/Loaders/Loader";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import moment from "moment";
import NumberOfWorkers from "@/components/inputs/NumberOfWorkers";
import EMPLOYER from "@/app/api/employer";
import PaperDropdown from "@/components/inputs/Dropdown";
import Drawer from "@/components/commons/Drawer";
import CustomCheckbox from "@/components/commons/CustomCheckbox";
import { useSetAtom } from "jotai";
import Atoms from "@/app/AtomStore";

const AddBookingDetails = ({ control, setValue, errors, watch }: any) => {
  const [location, setLocation] = useState({});
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );
  // const [facilities, setFacilities] = useState({
  //   food: false,
  //   living: false,
  //   esi_pf: false,
  //   travelling: false,
  // });

  // Watch facilities state
  const facilities = watch("facilities");

  console.log("facilities", facilities);

  const handleCheckboxChange = (key: string) => {
    console.log("key", key, facilities);

    setValue("facilities", {
      ...facilities,
      [key]: !facilities?.[key], // Ensure key exists before toggling
    });
  };

  return (
    <>
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
              <PaperDropdown
                label="workType"
                name="type"
                selectedValue={value}
                onSelect={(selectedValue: any) => {
                  onChange(selectedValue);
                  setValue("subType", "");
                }}
                translationEnabled
                placeholder="selectWorkType"
                options={WORKTYPES}
                errors={errors}
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
              <PaperDropdown
                label="workSubType"
                name="subType"
                selectedValue={value}
                onSelect={onChange}
                placeholder={
                  watch("type")
                    ? "selectWorkSubType"
                    : "pleaseSelectWorkTypeFirst"
                }
                translationEnabled
                options={filterSubCategories(watch("type"))}
                errors={errors}
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

          <View style={styles.checkboxContainer}>
            <CustomCheckbox
              label={t("living")}
              isChecked={watch("facilities").living}
              onToggle={() => handleCheckboxChange("living")}
            />
            <CustomCheckbox
              label={t("food")}
              isChecked={watch("facilities").food}
              onToggle={() => handleCheckboxChange("food")}
            />
            <CustomCheckbox
              label={t("travelling")}
              isChecked={watch("facilities").travelling}
              onToggle={() => handleCheckboxChange("travelling")}
            />
            <CustomCheckbox
              label={t("esi_pf")}
              isChecked={watch("facilities").esi_pf}
              onToggle={() => handleCheckboxChange("esi_pf")}
            />
          </View>

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
                label="workDescription"
                name="description"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("enterWorkDescription")}
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
    </>
  );
};

export default AddBookingDetails;

const styles = StyleSheet.create({
  modalContent: {
    paddingVertical: 20,
    paddingBottom: 100,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 20,
  },
});
