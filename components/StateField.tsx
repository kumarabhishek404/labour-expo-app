import { STETESOFINDIA } from "@/constants";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { View, Text } from "react-native";

const StateField = () => {
  const [selectedState, setSelectedState] = useState(STETESOFINDIA[0]);

  const handleStateChange = (itemValue: any) => {
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
        {STETESOFINDIA.map((state) => (
          <Picker.Item
            key={state?.value}
            label={state?.label}
            value={state?.value}
          />
        ))}
      </Picker>
    </View>
  );
};

export default StateField;
