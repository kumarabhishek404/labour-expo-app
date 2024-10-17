import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocale } from "@/app/context/locale";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface Language {
  code: string;
  name: string;
}

// Define available languages
const availableLanguages: Language[] = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "mr", name: "Marathi" },
  { code: "rj", name: "Rajasthani" },
];

export default function LanguageSelectionScreen() {
  const { locale, setLocale } = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);

  useEffect(() => {
    setSelectedLanguage(locale); // Pre-select the already selected language
  }, [locale]);

  const handleSave = async () => {
    setLocale(selectedLanguage);
    await AsyncStorage.setItem("selectedLanguage", selectedLanguage);
  };

  // Filter the list to have selected language on the top
  const languages = [
    {
      code: selectedLanguage,
      name:
        availableLanguages.find((lang) => lang.code === selectedLanguage)
          ?.name || "",
    },
    ...availableLanguages.filter((lang) => lang.code !== selectedLanguage),
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Change Language",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 8,
                padding: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  padding: 6,
                  borderRadius: 8,
                }}
              >
                <Feather name="arrow-left" size={20} />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Selected Language</Text>
        <FlatList
          data={[
            {
              code: selectedLanguage,
              name: availableLanguages.find(
                (lang) => lang.code === selectedLanguage
              )?.name,
            },
          ]}
          renderItem={({ item }) => (
            <View style={styles.languageItem}>
              <Text style={styles.languageName}>{item?.name}</Text>
              <TouchableOpacity style={styles.radioSelected} />
            </View>
          )}
          keyExtractor={(item) => item.code}
        />

        <Text style={styles.sectionTitle}>Available Languages</Text>
        <FlatList
          data={availableLanguages}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => setSelectedLanguage(item.code)}
            >
              <Text style={styles.languageName}>{item.name}</Text>
              <View
                style={
                  selectedLanguage === item.code
                    ? styles.radioSelected
                    : styles.radioUnselected
                }
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.code}
        />

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  languageName: {
    fontSize: 16,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors?.primary,
    backgroundColor: Colors?.primary,
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#999",
  },
  saveButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: Colors?.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
