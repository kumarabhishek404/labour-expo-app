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

const WorkRequirment = (props: any) => {
  const [requirements, setRequirements]: any = useState([]);

  const requirementField = (index:number) => (
    <View style={styles.addRequirment}>
      <Dropdown />
      <View style={styles.counterContainer}>
        <Counter />
        <View style={styles.priceField}>
          <MaterialIcons
            name={"currency-rupee"}
            size={30}
            color={Colors.secondary}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Rate per day"
            placeholderTextColor={Colors.secondary}
          />
        </View>
        <MaterialCommunityIcons
          style={styles.deleteIcon}
          name="delete"
          size={40}
          onPress={() => removeRequirment(index)}
        />
      </View>
    </View>
  );

  useEffect(() => {
    setRequirements([requirementField(0)]);
  }, []);

  const addRequirments = () => {
    let allRequirements = [...requirements, requirementField(requirements?.length + 1)];
    setRequirements(allRequirements);
  };

  const removeRequirment = (indexParam: number) => {
    console.log("requirements?.length---", requirements);
    console.log("requirements?.length--2-", requirements?.length);
    
    let allRequirements = [...requirements];
    if(requirements?.length > 1) {

      // allRequirements = requirements?.filter((image: any, index: number) => {
      //   if (index === indexParam) return;
      //   else return image;
      // });
    }
    // setRequirements(allRequirements);
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
        requirements?.map((requirment: any, index: number) => (
          <View style={{ width: "100%" }} key={index}>
            {requirment}
          </View>
        ))}
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
    marginTop: 15
  },
  addMoreWrapper: {
    padding: 4,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
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
