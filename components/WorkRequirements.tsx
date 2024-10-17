import Counter from "@/components/Counter";
import Dropdown from "@/components/Dropdown";
import { WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import {
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

interface WorkRequirmentProps {
  name: string;
  requirements: any;
  setRequirements: any;
  onBlur: any;
  errors: any;
  errorField: any;
}

const WorkRequirment = ({
  name,
  requirements,
  setRequirements,
  onBlur,
  errors,
  errorField,
}: WorkRequirmentProps) => {
  const addRequirments = () => {
    let tempRequirements = [...requirements];
    tempRequirements[requirements?.length] = {
      name: "",
      totalRequired: 0,
      payPerDay: 0,
      foodProvided: false,
      shelterProvider: false,
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

  const handleRequirementCountChange = (
    index: number,
    totalRequired: string
  ) => {
    let tempRequirments = [...requirements];
    tempRequirments[index].totalRequired = totalRequired;
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
      <Text style={styles?.label}>Work Requirments</Text>
      {requirements &&
        requirements.length > 0 &&
        requirements?.map((requirement: any, index: number) => {
          return (
            <View style={{ width: "100%" }} key={index}>
              <View style={styles.addRequirment}>
                <Dropdown
                  style={
                    errorField?.index === index &&
                    errorField?.name === "dropdown" &&
                    styles?.errorInput
                  }
                  value={requirement?.name}
                  setValue={(name: any) =>
                    handleRequirementTypeChange(index, name)
                  }
                  options={WORKERTYPES}
                  icon={
                    <Text style={styles.requirementCountText}>{index + 1}</Text>
                  }
                />
                <View style={styles.counterContainer}>
                  <Counter
                    counter={requirement?.totalRequired}
                    setCounter={(totalRequired: any) =>
                      handleRequirementCountChange(index, totalRequired)
                    }
                    style={
                      errorField?.index === index &&
                      errorField?.name === "counter" &&
                      styles?.errorInput
                    }
                  />
                  <View
                    style={[
                      styles.priceField,
                      errorField?.index === index &&
                        errorField?.name === "price" &&
                        styles?.errorInput,
                    ]}
                  >
                    <MaterialIcons
                      name={"currency-rupee"}
                      size={20}
                      color={Colors.secondary}
                    />
                    <TextInput
                      value={requirement?.payPerDay.toString()}
                      style={styles.textInput}
                      placeholder="Rate per day"
                      placeholderTextColor={Colors.secondary}
                      keyboardType="numeric"
                      maxLength={4}
                      onChangeText={(payPerDay: string) => {
                        const tempPayPerDay = payPerDay;
                        handleRequirementPriceChange(index, payPerDay);
                      }}
                    />
                  </View>
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
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        {errors[name] ? (
          <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
        ) : (
          <Text></Text>
        )}
        <TouchableOpacity
          onPress={addRequirments}
          style={styles.addMoreWrapper}
        >
          <View style={styles.addMoreBox}>
            <Entypo style={styles.plusIcon} name="plus" size={18} />
            <Text style={styles.addMoreText}>Add More</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkRequirment;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  addRequirmentWrapper: {
    width: "100%",
    marginVertical: 10,
  },
  addRequirment: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
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
  addMoreWrapper: {
    alignSelf: "flex-end",
  },
  addMoreBox: {
    padding: 6,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  addMoreText: {
    fontWeight: "600",
    color: Colors.white,
  },
  plusIcon: {
    color: Colors.white,
  },
  deleteIcon: {
    width: "40%",
  },
  priceField: {
    height: 44,
    width: "50%",
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 18,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    flex: 1,
    color: "red",
    fontSize: 12,
    marginRight: 16,
  },
  requirementCountText: {
    flex: 1,
    color: Colors?.secondary,
    fontWeight: "700",
    fontSize: 24,
    marginRight: 16,
    marginTop: -6,
  },
});
