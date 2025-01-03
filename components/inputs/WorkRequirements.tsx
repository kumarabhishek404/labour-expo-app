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

interface WorkRequirmentProps {
  label?: string;
  name: string;
  type: string;
  subType: string;
  requirements: any;
  setRequirements: any;
  onBlur: any;
  errors: any;
  errorField: any;
}

const WorkRequirment = ({
  label,
  name,
  type,
  subType,
  requirements,
  setRequirements,
  onBlur,
  errors,
  errorField,
}: WorkRequirmentProps) => {
  console.log("type - ", type);
  console.log("subType - ", subType);
  console.log("options - - ", filterWorkerTypes(type, subType));
  
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
      {label && <CustomHeading textAlign="left">{label}</CustomHeading>}
      {requirements &&
        requirements.length > 0 &&
        requirements?.map((requirement: any, index: number) => {
          return (
            <View style={{ width: "100%" }} key={index}>
              <View style={styles.addRequirment}>
                <DropdownComponent
                  style={
                    errorField?.index === index &&
                    errorField?.name === "dropdown" &&
                    styles?.errorInput
                  }
                  value={requirement?.name}
                  setValue={(name: any) =>
                    handleRequirementTypeChange(index, name)
                  }
                  emptyPlaceholder={t("pleaseSelectWorkTypeAndSubTypeFirst")}
                  options={filterWorkerTypes(type, subType) ?? []}
                  icon={
                    <CustomHeading fontSize={20} color={Colors?.secondary}>
                      {index + 1}
                    </CustomHeading>
                  }
                />
                <View style={styles.counterContainer}>
                  <Counter
                    counter={requirement?.count}
                    setCounter={(count: any) =>
                      handleRequirementCountChange(index, count)
                    }
                    style={
                      errorField?.index === index &&
                      errorField?.name === "counter" &&
                      styles?.errorInput
                    }
                  />
                  <TextInputComponent
                    label=""
                    name="payPerDay"
                    value={requirement?.payPerDay.toString()}
                    placeholder={t("ratePerDay")}
                    type="numeric"
                    maxLength={4}
                    onChangeText={(payPerDay: string) => {
                      const tempPayPerDay = payPerDay;
                      handleRequirementPriceChange(index, payPerDay);
                    }}
                    style={styles.textInput}
                    containerStyle={[
                      { height: 44 },
                      errorField?.index === index &&
                        errorField?.name === "price" &&
                        styles?.errorInput,
                    ]}
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
                      onPress={() => removeRequirment(index)}
                    />
                  )}
                </View>
              </View>
            </View>
          );
        })}
      <View style={errors[name] && styles?.addMore}>
        {errors[name] && (
          <CustomText textAlign="left" fontSize={10} color={Colors?.danger}>
            {errors[name]?.message || ""}
          </CustomText>
        )}
        <TouchableOpacity
          onPress={addRequirments}
          style={styles.addMoreWrapper}
        >
          <View style={styles.addMoreBox}>
            <Entypo color={Colors?.white} name="plus" size={18} />
            <CustomHeading textAlign="left" color={Colors?.white}>
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
    alignItems: "center",
    marginBottom: 10,
  },
  counterContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
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
    backgroundColor: Colors.primary,
  },
  deleteIcon: {
    width: "40%",
  },
  textInput: {
    width: "48%",
    fontSize: 18,
    color: Colors?.primary,
    fontWeight: "600",
    padding: 0,
    margin: 0,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});
