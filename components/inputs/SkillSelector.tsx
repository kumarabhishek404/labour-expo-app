import { t } from "@/utils/translationHelper";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";

const SkillSelector = () => {
  const [availableSkills, setAvailableSkills] = useState([
    "Labour",
    "Stone Mason",
    "Mistri",
    "Mason",
    "Carpenter",
    "Electrician",
    "Dhan Buwai",
    "Dhaan Pitai",
    "Aloo Buwai",
    "Bazara Katai",
  ]);
  const [selectedSkills, setSelectedSkills] = useState<
    { skill: string; price: string }[]
  >([]);

  const handleSkillSelect = (skill: string) => {
    if (selectedSkills.length >= 5) return; // Limit to 5 skills
    setSelectedSkills([...selectedSkills, { skill, price: "" }]);
    setAvailableSkills(availableSkills.filter((s) => s !== skill));
  };

  const handlePriceChange = (skill: string, price: string) => {
    setSelectedSkills((prev) =>
      prev.map((item) =>
        item.skill === skill ? { ...item, price: price } : item
      )
    );
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((item) => item.skill !== skill));
    setAvailableSkills([...availableSkills, skill]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>{t("selectAnySkills")}</Text>

      {/* Selected Skills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.selectedSkillsContainer}>
          {selectedSkills.map((item, index) => (
            <View key={index} style={styles.selectedSkill}>
              <Text style={styles.skillText}>{item.skill}</Text>
              <TextInput
                style={styles.inputField}
                keyboardType="numeric"
                placeholder="Price/Day"
                value={item.price}
                onChangeText={(text) => handlePriceChange(item.skill, text)}
              />
              <TouchableOpacity
                onPress={() => handleRemoveSkill(item.skill)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>✖</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Available Skills */}
      <FlatList
        data={availableSkills}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.availableSkillsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.skillButton}
            onPress={() => handleSkillSelect(item)}
          >
            <Text style={styles.skillButtonText}>+ {item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  selectedSkillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  selectedSkill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbeaea",
    borderWidth: 1,
    borderColor: "#f5a1a1",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f44336",
    marginRight: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 14,
    width: 80,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: "#f44336",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  availableSkillsRow: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  skillButton: {
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
    width: "30%",
  },
  skillButtonText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
});

export default SkillSelector;
