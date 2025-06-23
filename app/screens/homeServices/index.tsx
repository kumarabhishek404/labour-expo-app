import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BottomSheet from "./bottomPopup";
import ElectricianSubServices from "./electric";
import PlumberServices from "./plumber";
import CustomText from "@/components/commons/CustomText";
import { t } from "@/utils/translationHelper";

// Categories with emoji icons and search keywords
const categories = [
  {
    label: "electrician",
    icon: "💡",
    keywords: ["wiring", "fan", "light", "switch", "repair", "electrician"],
  },
  {
    label: "plumber",
    icon: "🚰",
    keywords: ["pipe", "leak", "toilet", "tap", "bathroom", "plumber"],
  },
];

const HomeServices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSheet, setShowSheet] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return categories;

    return categories.filter((cat) => {
      const inLabel = cat.label.toLowerCase().includes(query);
      const inKeywords = cat.keywords.some((word) =>
        word.toLowerCase().includes(query)
      );
      return inLabel || inKeywords;
    });
  }, [searchQuery]);

  const handleCardPress = (label: string) => {
    setSelectedCategory(label);
    setShowSheet(true);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t("homeRepairServices")}</Text>
      <Text style={styles.subtitle}>
        {t("chooseServiceCategoryExploreDetails")}
      </Text>

      <TextInput
        placeholder={t("searchPlaceholder")}
        style={styles.searchBar}
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.grid}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handleCardPress(item.label)}
            >
              <Text style={styles.emoji}>{item.icon}</Text>
              <CustomText style={styles.label}>{t(item?.label)}</CustomText>
            </TouchableOpacity>
          ))
        ) : (
          <CustomText style={styles.noResultText}>
            {t("noMatchingServices")}
          </CustomText>
        )}
      </View>

      <BottomSheet visible={showSheet} onClose={() => setShowSheet(false)}>
        {selectedCategory === "electrician" && (
          <ElectricianSubServices setShowSheet={setShowSheet} />
        )}
        {selectedCategory === "plumber" && (
          <PlumberServices setShowSheet={setShowSheet} />
        )}
      </BottomSheet>
    </ScrollView>
  );
};

export default HomeServices;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1e1e1e",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  searchBar: {
    height: 45,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#000",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    width: "47%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
  },
  noResultText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    width: "100%",
  },
});
