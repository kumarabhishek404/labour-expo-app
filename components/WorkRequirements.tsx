import Counter from "@/components/Counter";
import Dropdown from "@/components/Dropdown";
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

const WorkRequirment = ({ requirements, setRequirements }: any) => {
  const data = [
    { label: "Labour", value: "labour" },
    { label: "Bricklayer", value: "Bricklayer" },
    { label: "Stone Mason", value: "Stone Mason" },
    { label: "Mistri", value: "mistri" },
    { label: "Electrician", value: "electrician" },
  ];

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
    console.log("Item ---", index, totalRequired);
    let tempRequirments = [...requirements];
    tempRequirments[index].totalRequired = totalRequired;
    setRequirements(tempRequirments);
  };

  const handleRequirementPriceChange = (index: number, payPerDay: number) => {
    console.log("Item ---", index, payPerDay);
    let tempRequirments = [...requirements];
    tempRequirments[index].payPerDay = payPerDay;
    setRequirements(tempRequirments);
  };

  return (
    <View style={styles.addRequirmentWrapper}>
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
        }}
      >
        Work Requirments
      </Text>
      {requirements &&
        requirements.length > 0 &&
        requirements?.map((requirement: any, index: number) => {
          return (
            <View style={{ width: "100%" }} key={index}>
              <View style={styles.addRequirment}>
                <Dropdown
                  value={requirement?.name}
                  setValue={(name: any) =>
                    handleRequirementTypeChange(index, name)
                  }
                  options={data}
                />
                <View style={styles.counterContainer}>
                  <Counter
                    counter={requirement?.totalRequired}
                    setCounter={(totalRequired: any) =>
                      handleRequirementCountChange(index, totalRequired)
                    }
                  />
                  <View style={styles.priceField}>
                    <MaterialIcons
                      name={"currency-rupee"}
                      size={30}
                      color={Colors.secondary}
                    />
                    <TextInput
                      value={requirement?.payPerDay.toString()}
                      style={styles.textInput}
                      placeholder="Rate per day"
                      placeholderTextColor={Colors.secondary}
                      onChangeText={(payPerDay: string) => {
                        const tempPayPerDay = parseInt(payPerDay);
                        handleRequirementPriceChange(index, tempPayPerDay);
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
      {/* {requirements &&
        requirements?.map((requirment: any, index: number) => (
          <View style={{ width: "100%" }} key={index}>
            {requirment}
          </View>
        ))} */}
      <TouchableOpacity onPress={addRequirments} style={styles.addMoreWrapper}>
        <View style={styles.addMoreBox}>
          <Entypo style={styles.plusIcon} name="plus" size={18} />
          <Text style={styles.addMoreText}>Add More</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default WorkRequirment;

const styles = StyleSheet.create({
  addRequirmentWrapper: {
    width: "100%",
    marginVertical: 10,
  },
  addRequirment: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  counterContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginTop: 15,
  },
  addMoreWrapper: {
    // padding: 4,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    width: "26%",
    borderRadius: 4,
  },
  addMoreBox: {
    padding: 6,
    paddingRight: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 4,
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
    // color: Colors.,
  },
  priceField: {
    height: 53,
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
    paddingHorizontal: 10,
    // fontFamily: fonts.Light,
  },
});
