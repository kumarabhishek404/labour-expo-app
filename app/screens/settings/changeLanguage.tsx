import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import LOCAL_CONTEXT from "@/app/context/locale";
import Colors from "@/constants/Colors";
import { router, Stack } from "expo-router";
import CustomHeader from "@/components/commons/Header";
import CustomHeading from "@/components/commons/CustomHeading";
import CustomText from "@/components/commons/CustomText";
import Button from "@/components/inputs/Button";
import Animated, { SlideInDown } from "react-native-reanimated";
import { LANGUAGE_KEY, LANGUAGES } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import USER from "@/app/api/user";
import { useAtomValue } from "jotai";
import Atoms from "@/app/AtomStore";

export default function LanguageSelectionScreen() {
  const { locale, setLocale } = LOCAL_CONTEXT.useLocale();
  const userDetails = useAtomValue(Atoms?.UserAtom);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(locale);

  console.log("locale--", locale);

  const mutationUpdateProfileInfo = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (payload: any) => USER?.updateUserById(payload),
    onSuccess: (response) => {
      console.log(
        "Response while updating the profile - ",
        response?.data?.data?.email
      );
    },
    onError: (err) => {
      console.error("error while updating the profile ", err);
    },
  });

  useEffect(() => {
    setSelectedLanguage(locale);
  }, [locale]);

  const handleSave = async () => {
    console.log(" selectedLanguage- ", selectedLanguage);

    setLocale(selectedLanguage);
    await AsyncStorage.setItem(LANGUAGE_KEY, selectedLanguage);
    if (userDetails?._id) {
      mutationUpdateProfileInfo?.mutate({
        _id: userDetails?._id,
        locale: { language: selectedLanguage },
      });
    }
    router?.back();
  };

  // Filter the list to have selected language on the top
  const languages = [
    {
      value: selectedLanguage,
      label:
        LANGUAGES.find((lang) => lang.value === selectedLanguage)?.label || "",
    },
    ...LANGUAGES.filter((lang) => lang.value !== selectedLanguage),
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title="changeLanguage"
              left="back"
              right="notification"
            />
          ),
        }}
      />
      <View style={styles.container}>
        <CustomHeading textAlign="left" baseFont={22}>
          चुनी गई भाषा
        </CustomHeading>
        <FlatList
          style={{ marginBottom: 30 }}
          data={[
            {
              value: selectedLanguage,
              label: LANGUAGES.find((lang) => lang?.value === selectedLanguage)
                ?.label,
            },
          ]}
          renderItem={({ item }) => (
            <View style={styles.languageItem}>
              <CustomText baseFont={18}>{item?.label}</CustomText>
              <View style={styles.boxSelected}>
                {selectedLanguage === item?.value && (
                  <Entypo name="check" size={20} color="white" />
                )}
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.value}
        />

        <CustomHeading textAlign="left" baseFont={20}>
          उपलब्ध भाषाएँ
        </CustomHeading>
        <FlatList
          data={LANGUAGES}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.languageItem}
              onPress={() => setSelectedLanguage(item?.value)}
            >
              <CustomText baseFont={22}>{item.label}</CustomText>
              <View
                style={
                  selectedLanguage === item?.value
                    ? styles.boxSelected
                    : styles.boxUnselected
                }
              >
                {selectedLanguage === item?.value && (
                  <Entypo name="check" size={20} color="white" />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?.value}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 62,
    backgroundColor: Colors?.fourth,
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
    borderRadius: 30,
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
  boxUnselected: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  boxSelected: {
    width: 24,
    height: 24,
    backgroundColor: "#007BFF",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
