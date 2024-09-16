import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View, Text } from "react-native";

const statesOfIndia = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",   
  
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",   
  
  ];
  
  const statesAsObjects = statesOfIndia.map((state) => ({
    label: state,
    value: state.replace(/\s+/g, '').toLowerCase()
  }));
  
  console.log(statesAsObjects);

const StateField = () => {
  const [selectedState, setSelectedState] = useState(statesOfIndia[0]);

  const handleStateChange = (itemValue:any) => {
    setSelectedState(itemValue);
    console.log("Selected State:", itemValue); // Handle selected state here
  };

  return (
    <View style={{ padding: 10 }}>
      <Picker
        selectedValue={selectedState}
        onValueChange={handleStateChange}
        mode="dropdown"
      >
        {statesOfIndia.map((state) => (
          <Picker.Item key={state} label={state} value={state} />
        ))}
      </Picker>
    </View>
  );
};

export default StateField;
