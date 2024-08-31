import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

const Dropdown = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  return (
    <View style={styles.container}>
      <Picker
        style={styles.picker}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
      >
        <Picker.Item label="Labour" value="labour" />
        <Picker.Item label="Mistri" value="mistri" />
      </Picker>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width: "50%",
    height: 56,
    // borderColor: 'red',
    // borderWidth: 1
  },
  picker: {
    backgroundColor: "rgb(220,220, 220)",
    borderRadius: 4,
    // marginVertical: 10,
  },
});
