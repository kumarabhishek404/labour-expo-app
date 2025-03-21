// /app/language-selection/index.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LANGUAGE_KEY, LANGUAGES } from "@/constants";
import Colors from "@/constants/Colors";
import Button from "@/components/inputs/Button";
import CustomHeading from "@/components/commons/CustomHeading";
import LOCAL_CONTEXT from "@/app/context/locale";
import { useSetAtom } from "jotai";
import Atoms from "../AtomStore";

const LanguageSelectionScreen = () => {
  const setLocaleValue = useSetAtom(Atoms?.LocaleAtom);

  const { locale, setLocale } = LOCAL_CONTEXT.useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (selectedLanguage) {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLanguage);
      setLocale(selectedLanguage);
      setLocaleValue({
        language: selectedLanguage,
      });
      // router.push("/");
      router?.push("/screens/userTipForAppUse");
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeading baseFont={20}>कृपया अपनी भाषा चुनें</CustomHeading>
      <View style={styles.languageList}>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.value}
            style={[
              styles.languageOption,
              selectedLanguage === language.value && styles.selectedOption,
            ]}
            onPress={() => setSelectedLanguage(language.value)}
          >
            <CustomHeading
              style={[
                styles.languageText,
                selectedLanguage === language.value &&
                  styles.selectedLanguageText,
              ]}
            >
              {language.label}
            </CustomHeading>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.saveButton}>
        <Button isPrimary={true} title="सहेजें" onPress={handleSave} />
      </View>
    </View>
  );
};

export default LanguageSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  languageList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  languageOption: {
    width: "45%",
    padding: 15,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors?.tertieryButton,
  },
  languageText: {
    fontSize: 16,
    color: "#333",
  },
  selectedLanguageText: {
    color: Colors?.white,
  },
  saveButton: {
    marginTop: 30,
  },
});
