import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "@react-native-community/checkbox";
import CustomText from "./CustomText";

const FilterScreen = () => {
  const [startService, setStartService] = useState("one_month");
  const [labourTypes, setLabourTypes] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [subServiceType, setSubServiceType] = useState("");
  const [distance, setDistance] = useState("10km");
  const [rating, setRating] = useState(5);
  const [facilities, setFacilities] = useState({
    living: false,
    food: false,
    travelling: false,
    psi_pf: false,
  });
  const [duration, setDuration] = useState("less_5_days");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Filters</Text>

      {/* Start Service Within */}
      <View style={styles.section}>
        <Text style={styles.label}>Start Service Within</Text>
        <Picker
          selectedValue={startService}
          onValueChange={(value) => setStartService(value)}
        >
          <Picker.Item label="One Month" value="one_month" />
          <Picker.Item label="Six Months" value="six_months" />
          <Picker.Item label="One Year" value="one_year" />
          <Picker.Item label="After One Year" value="after_one_year" />
        </Picker>
      </View>

      {/* Distance */}
      <View style={styles.section}>
        <Text style={styles.label}>Distance</Text>
        <Picker
          selectedValue={distance}
          onValueChange={(value) => setDistance(value)}
        >
          <Picker.Item label="Within 10km" value="10km" />
          <Picker.Item label="Within 50km" value="50km" />
          <Picker.Item label="Within 100km" value="100km" />
          <Picker.Item label="More than 100km" value="more_100km" />
        </Picker>
      </View>

      {/* Rating */}
      <View style={styles.section}>
        <Text style={styles.label}>Rating</Text>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => setRating(num)}
            style={[styles.star, rating === num && styles.selectedStar]}
          >
            <Text>{num}⭐</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Facilities */}
      <View style={styles.section}>
        <Text style={styles.label}>Facilities</Text>
        {Object.keys(facilities).map((key) => (
          <View key={key} style={styles.checkboxContainer}>
            <CheckBox
              value={facilities[key]}
              onValueChange={(newValue) =>
                setFacilities({ ...facilities, [key]: newValue })
              }
            />
            <Text>{key.replace("_", " ")}</Text>
          </View>
        ))}
      </View>

      {/* Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>Duration</Text>
        <Picker
          selectedValue={duration}
          onValueChange={(value) => setDuration(value)}
        >
          <Picker.Item label="Less than 5 days" value="less_5_days" />
          <Picker.Item label="Less than 15 days" value="less_15_days" />
          <Picker.Item label="Less than one month" value="less_one_month" />
          <Picker.Item label="More than one month" value="more_one_month" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button}>
        <CustomText style={styles.buttonText}>Apply Filters</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: { padding: 20, backgroundColor: "#f5f5f5" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  star: { padding: 10, borderWidth: 1, borderRadius: 5, margin: 5 },
  selectedStar: { backgroundColor: "gold" },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
};

export default FilterScreen;
