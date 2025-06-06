import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import Colors from "@/constants/Colors";
import { t } from "@/utils/translationHelper";
import { Controller } from "react-hook-form";
import { WORKTYPES } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import AddLocationAndAddress from "@/components/commons/AddLocationAndAddress";
import DateField from "@/components/inputs/DateField";
import { filterSubCategories, isEmptyObject } from "@/constants/functions";
import Duration from "@/components/inputs/Duration";
import TextAreaInputComponent from "@/components/inputs/TextArea";
import moment from "moment";
import NumberOfWorkers from "@/components/inputs/NumberOfWorkers";
import CustomCheckbox from "@/components/commons/CustomCheckbox";
import CustomHeading from "@/components/commons/CustomHeading";
import { getDynamicWorkerType } from "@/utils/i18n";
import RadioSelector from "@/components/inputs/RadioButton";

const AddBookingDetails = ({
  control,
  setValue,
  errors,
  watch,
  workerSkills,
}: any) => {
  const [location, setLocation] = useState({});
  const [selectedOption, setSelectedOption] = useState(
    !isEmptyObject(location) ? "currentLocation" : "address"
  );

  const facilities = watch("facilities");

  // 🧠 useMemo to optimize dynamic skill transformation
  const dynamicWorkerSkills = useMemo(() => {
    return (
      workerSkills?.map((requirement: any) => ({
        ...requirement,
        label: getDynamicWorkerType(requirement?.skill, requirement?.count),
      })) || []
    );
  }, [workerSkills]);

  const handleCheckboxChange = (key: string) => {
    setValue("facilities", {
      ...facilities,
      [key]: !facilities?.[key],
    });
  };
  console.log("dynamicWorkerSkills--", dynamicWorkerSkills);

  return (
    <View style={styles?.container}>
      <Controller
        control={control}
        name="appliedSkill"
        defaultValue=""
        rules={{
          required: t("skillIsRequired"),
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <RadioSelector
            name="appliedSkill"
            label={t("selectRequestedSkillToBook")}
            onChange={onChange}
            value={value}
            errors={errors}
            options={dynamicWorkerSkills}
            keyExtractor={(item) => item.skill} // how to identify item
            renderOption={(item) =>
              `${item.label} - ${
                item.pricePerDay
                  ? `₹${item.pricePerDay} / ${t("perDay")}`
                  : t("notAdded")
              }`
            }
            translationEnabled={false}
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
        <CustomHeading
          baseFont={18}
          textAlign="left"
          color={Colors?.inputLabel}
          fontWeight="600"
        >
          {t("facilities")}
        </CustomHeading>
        <View style={styles?.checkboxes}>
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
              location={location}
              setLocation={setLocation}
              selectedOption={selectedOption}
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
  );
};

export default AddBookingDetails;

const styles = StyleSheet.create({
  container: { flexDirection: "column", gap: 20 },
  checkboxContainer: {
    flexDirection: "column",
    gap: 15,
  },
  checkboxes: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
});
