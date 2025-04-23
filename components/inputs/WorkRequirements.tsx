import Counter from "@/components/inputs/Counter";
import Colors from "@/constants/Colors";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import TextInputComponent from "./TextInputWithIcon";
import { t } from "@/utils/translationHelper";
import { filterWorkerTypes } from "@/constants/functions";
import PaperDropdown from "@/components/inputs/Dropdown";
import CustomCheckbox from "../commons/CustomCheckbox";
import { getDynamicWorkerType } from "@/utils/i18n";

interface WorkRequirmentProps {
  label?: string;
  name: string;
  watch: any;
  type: string;
  subType: string;
  requirements: any;
  setRequirements: any;
  facilities: any;
  setFacilities: any;
  errors: any;
  errorField: any;
}

const WorkRequirment = ({
  name,
  watch,
  type,
  subType,
  requirements,
  setRequirements,
  facilities,
  setFacilities,
  errors,
  errorField,
}: WorkRequirmentProps) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const updatedRequirements = requirements.map((req: any) => ({
      ...req,
      ...facilities,
    }));
    setRequirements(updatedRequirements);
  }, [facilities]);

  // const [prevValues, setPrevValues] = useState({ type, subType });

  // useEffect(() => {
  //   if (prevValues.type !== type || prevValues.subType !== subType) {
  //     // Reset facilities
  //     setFacilities({
  //       living: false,
  //       food: false,
  //       travelling: false,
  //       esi_pf: false,
  //     });

  //     // Reset requirements
  //     setRequirements([
  //       {
  //         name: "",
  //         count: 0,
  //         payPerDay: 0,
  //         living: false,
  //         food: false,
  //         travelling: false,
  //         esi_pf: false,
  //       },
  //     ]);

  //     // Change key to force re-render
  //     setKey((prevKey) => prevKey + 1);

  //     // Update previous values
  //     setPrevValues({ type, subType });
  //   }
  // }, [type, subType]);

  const getFilteredWorkerTypes = (index: number) => {
    const selectedNames = requirements
      .filter((_: any, i: any) => i !== index)
      .map((req: any) => req.name);

    return filterWorkerTypes(type, subType)?.filter(
      (option: any) => !selectedNames.includes(option.value)
    );
  };

  const handleCheckboxChange = (key: string) => {
    setFacilities((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const addRequirments = () => {
    let tempRequirements = [...requirements];
    tempRequirements[requirements?.length] = {
      name: "",
      count: 0,
      payPerDay: 0,
      ...facilities,
    };
    setRequirements(tempRequirements);
  };

  const removeRequirment = (indexParam: number) => {
    let allRequirements = [...requirements];
    if (allRequirements && allRequirements?.length > 1) {
      allRequirements.splice(indexParam, 1);
    }
    setRequirements(allRequirements);
  };

  const handleRequirementTypeChange = (index: number, name: string) => {
    let tempRequirments = [...requirements];
    tempRequirments[index].name = name;
    setRequirements(tempRequirments);
  };

  const handleRequirementCountChange = (index: number, count: string) => {
    let tempRequirments = [...requirements];
    tempRequirments[index].count = count;
    setRequirements(tempRequirments);
  };

  const handleRequirementPriceChange = (index: number, payPerDay: string) => {
    let tempRequirments = [...requirements];
    tempRequirments[index].payPerDay = isNaN(parseInt(payPerDay))
      ? payPerDay
      : parseInt(payPerDay);
    setRequirements(tempRequirments);
  };

  return (
    <View key={key} style={styles.addRequirmentWrapper}>
      {/* Common Checkboxes */}
      <View style={styles.checkboxContainer}>
        <CustomCheckbox
          label={t("living")}
          isChecked={facilities.living}
          onToggle={() => handleCheckboxChange("living")}
        />
        <CustomCheckbox
          label={t("food")}
          isChecked={facilities.food}
          onToggle={() => handleCheckboxChange("food")}
        />
        <CustomCheckbox
          label={t("travelling")}
          isChecked={facilities.travelling}
          onToggle={() => handleCheckboxChange("travelling")}
        />
        <CustomCheckbox
          label={t("esi_pf")}
          isChecked={facilities.esi_pf}
          onToggle={() => handleCheckboxChange("esi_pf")}
        />
      </View>

      {requirements &&
        requirements.length > 0 &&
        requirements?.map((requirement: any, index: number) => (
          <View
            style={[
              styles.requirementCard,
              requirements?.length > index + 1 && styles?.bottomBorder,
            ]}
            key={index}
          >
            <View style={styles.addRequirment}>
              <View style={{ zIndex: 7 }}>
                <PaperDropdown
                  selectedValue={
                    requirement?.name
                      ? getDynamicWorkerType(requirement?.name, 1)
                      : ""
                  }
                  onSelect={(name: any) =>
                    handleRequirementTypeChange(index, name)
                  }
                  placeholder={
                    subType
                      ? t("selectWorkRequirementType")
                      : t("pleaseSelectWorkTypeAndSubTypeFirst")
                  }
                  options={getFilteredWorkerTypes(index) ?? []}
                  errors={errors}
                  icon={
                    <CustomHeading baseFont={20} color={Colors?.secondary}>
                      {index + 1}
                    </CustomHeading>
                  }
                />
              </View>
              <View style={styles.counterContainer}>
                <Counter
                  label={"count"}
                  counter={requirement?.count}
                  setCounter={(count: any) =>
                    handleRequirementCountChange(index, count)
                  }
                  style={
                    errorField?.index === index &&
                    errorField?.name === "counter" && {
                      borderColor: Colors?.error,
                    }
                  }
                />
                <TextInputComponent
                  label="rupessPerDay"
                  name="payPerDay"
                  value={requirement?.payPerDay.toString()}
                  placeholder={t("ratePerDay")}
                  type="number"
                  maxLength={4}
                  onChangeText={(payPerDay: string) => {
                    handleRequirementPriceChange(index, payPerDay);
                  }}
                  style={styles.textInput}
                  inputStyle={{ height: 38 }}
                  icon={
                    <MaterialIcons
                      name={"currency-rupee"}
                      size={20}
                      color={Colors.secondary}
                    />
                  }
                />
                {requirements && requirements?.length > 1 && (
                  <MaterialCommunityIcons
                    style={styles.deleteIcon}
                    name="delete"
                    size={40}
                    color={Colors?.tertiery}
                    onPress={() => removeRequirment(index)}
                  />
                )}
              </View>
            </View>
          </View>
        ))}

      <View style={errors?.[name] && styles?.addMore}>
        {errors?.[name] && (
          <CustomText
            textAlign="left"
            baseFont={14}
            color={Colors?.danger}
            style={{ width: "60%" }}
          >
            {errors?.[name]?.message || ""}
          </CustomText>
        )}
        {filterWorkerTypes(type, subType)?.length !== requirements.length && (
          <TouchableOpacity
            onPress={addRequirments}
            style={styles.addMoreWrapper}
          >
            <View style={styles.addMoreBox}>
              <Entypo
                color={Colors?.tertieryButtonText}
                name="plus"
                size={18}
              />
              <CustomHeading
                textAlign="left"
                color={Colors?.tertieryButtonText}
              >
                {t("addMore")}
              </CustomHeading>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WorkRequirment;

const styles = StyleSheet.create({
  addRequirmentWrapper: {
    width: "100%",
    gap: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 20,
  },
  requirementCard: {
    width: "100%",
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors?.disabled,
    paddingBottom: 15,
    marginBottom: 15,
  },
  addRequirment: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  counterContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
    zIndex: 6,
  },
  addMore: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  addMoreWrapper: {
    alignSelf: "flex-end",
  },
  addMoreBox: {
    padding: 6,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors?.tertieryButtonText,
    backgroundColor: Colors.tertieryButton,
  },
  deleteIcon: {
    width: "40%",
    alignSelf: "flex-end",
  },
  textInput: {
    width: "48%",
    fontSize: 18,
    color: Colors?.primary,
    fontWeight: "600",
    padding: 0,
    margin: 0,
  },
});
