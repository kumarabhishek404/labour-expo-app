import Counter from "@/components/inputs/Counter";
import Colors from "@/constants/Colors";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import TextInputComponent from "./TextInputWithIcon";
import { t } from "@/utils/translationHelper";
import { filterWorkerTypes } from "@/constants/functions";
import DropdownComponent from "@/components/inputs/Dropdown";
import PaperDropdown from "@/components/inputs/Dropdown";

interface WorkRequirmentProps {
  label?: string;
  name: string;
  watch: any;
  type: string;
  subType: string;
  requirements: any;
  setRequirements: any;
  errors: any;
  errorField: any;
}

const WorkRequirment = ({
  label,
  name,
  watch,
  type,
  subType,
  requirements,
  setRequirements,
  errors,
  errorField,
}: WorkRequirmentProps) => {
  const addRequirments = () => {
    let tempRequirements = [...requirements];
    tempRequirements[requirements?.length] = {
      name: "",
      count: 0,
      payPerDay: 0,
      food: false,
      shelter: false,
      pf: false,
      insurance: false,
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
    console.log("tempRequirments", tempRequirments[index]?.name);

    setRequirements(tempRequirments);
  };

  const handleRequirementCountChange = (index: number, count: string) => {
    let tempRequirments = [...requirements];
    tempRequirments[index].count = count;
    setRequirements(tempRequirments);
  };

  const handleRequirementPriceChange = (index: number, payPerDay: string) => {
    let tempRequirments = [...requirements];
    if (isNaN(parseInt(payPerDay))) {
      tempRequirments[index].payPerDay = payPerDay;
    } else {
      tempRequirments[index].payPerDay = parseInt(payPerDay);
    }
    setRequirements(tempRequirments);
  };

  return (
    <View style={styles.addRequirmentWrapper}>
      {/* {label && (
        <CustomHeading textAlign="left" color={Colors?.primary} baseFont={16} fontWeight="500">
          {label}
        </CustomHeading>
      )} */}
      {requirements &&
        requirements.length > 0 &&
        requirements?.map((requirement: any, index: number) => {
          return (
            <View style={{ width: "100%" }} key={index}>
              <View style={styles.addRequirment}>
                <View style={{ zIndex: 7 }}>
                  <PaperDropdown
                    selectedValue={requirement?.name}
                    onSelect={(name: any) =>
                      handleRequirementTypeChange(index, name)
                    }
                    translationEnabled
                    placeholder={
                      watch("subType")
                        ? "selectWorkRequirementType"
                        : "pleaseSelectWorkTypeAndSubTypeFirst"
                    }
                    options={filterWorkerTypes(type, subType) ?? []}
                    errors={errors}
                    search={false}
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
                        borderColol: Colors?.error,
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
          );
        })}
      <View style={errors?.[name] && styles?.addMore}>
        {errors?.[name] && (
          <CustomText
            textAlign="left"
            baseFont={10}
            color={Colors?.danger}
            style={{ width: "60%" }}
          >
            {errors?.[name]?.message || ""}
          </CustomText>
        )}
        <TouchableOpacity
          onPress={addRequirments}
          style={styles.addMoreWrapper}
        >
          <View style={styles.addMoreBox}>
            <Entypo color={Colors?.tertieryButtonText} name="plus" size={18} />
            <CustomHeading textAlign="left" color={Colors?.tertieryButtonText}>
              {t("addMore")}
            </CustomHeading>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkRequirment;

const styles = StyleSheet.create({
  addRequirmentWrapper: {
    width: "100%",
    gap: 5,
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
    // alignItems: "center",
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
