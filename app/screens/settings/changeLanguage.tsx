import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocale } from "@/app/context/locale";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import Animated, { SlideInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");
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
    router?.back();
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
          header: () => <CustomHeader title="Change Language" left="back" />,
        }}
      />
      <View style={styles.container}>
        <CustomHeading textAlign="left" fontSize={18}>
          Selected Language
        </CustomHeading>
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
              <CustomText fontSize={16}>{item?.name}</CustomText>
              <TouchableOpacity style={styles.radioSelected} />
            </View>
          )}
          keyExtractor={(item) => item.code}
        />

        <CustomHeading textAlign="left" fontSize={18}>
          Available Languages
        </CustomHeading>
        <FlatList
          data={availableLanguages}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => setSelectedLanguage(item.code)}
            >
              <CustomText fontSize={16}>{item.name}</CustomText>
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

        <Animated.View
          style={styles.saveButtonContainer}
          entering={SlideInDown.delay(200)}
        >
          <Button isPrimary={true} title="Save" onPress={handleSave} />
        </Animated.View>
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
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 30,
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
  },
  saveButton: {
    backgroundColor: Colors?.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
});
