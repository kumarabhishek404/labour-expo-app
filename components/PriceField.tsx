import Colors from "@/constants/Colors";
import {
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";

const PriceField = (props: any) => {
  const [price, setPrice] = useState("0");
  const [requirements, setRequirements]: any = useState([
    {
      type: "Labour",
      price: "3",
    },
    {
      type: "Mistri",
      price: "",
    },
  ]);

  console.log("requirements[index]?.price---", requirements[2]?.price);

  const onChangePrice = (event: any, index: number) => {
    console.log("Index-", index, event.target.value);
    // let allRequirements = requirements
    setPrice(event.target.value);
  };

  return (
    <View style={styles.addPriceWrapper}>
      <Text
        style={{
          fontWeight: "bold",
          marginBottom: 4,
        }}
      >
        Price
      </Text>
      {requirements &&
        requirements?.map((requirment: any, index: number) => (
          <View key={index} style={styles.addPrice}>
            <Text style={styles.type}>{requirment?.type}</Text>
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
          </View>
        ))}
    </View>
  );
};

export default PriceField;

const styles = StyleSheet.create({
  addPriceWrapper: {
    marginVertical: 10,
    width: "100%",
  },
  addPrice: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  type: {
    fontSize: 18,
    marginVertical: 'auto',
    verticalAlign: 'middle'
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
