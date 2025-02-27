import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import moment from "moment";
import Button from "./Button";
import { t } from "@/utils/translationHelper";
import Colors from "@/constants/Colors";

const CustomDatePicker = ({
  visible,
  onClose,
  selectedDate,
  onDateSelect,
  type,
}: any) => {
  const currentYear = moment().year();
  const startYear = currentYear - 17 - 50;
  const years =
    type === "serviceDate"
      ? [currentYear, currentYear + 1]
      : Array.from({ length: 50 }, (_, i) => startYear + i).reverse();
  const months = moment.months();

  const scrollViewRefYearFirst: any = useRef(null);
  const scrollViewRefYearSecond: any = useRef(null);
  const scrollViewRefMonthFirst: any = useRef(null);
  const scrollViewRefMonthSecond: any = useRef(null);

  // Split months into two rows for horizontal scrolling
  const firstRowMonths = months.slice(0, 6); // First row (January - June)
  const secondRowMonths = months.slice(6, 12); // Second row (July - December)

  const firstRowYears = type === "serviceDate" ? years : years.slice(0, 25);
  const secondRowYears = years.slice(25, 50);

  const scrollToIndex = (scrollViewRef: any, index: number) => {
    if (scrollViewRef.current) {
      const itemWidth = 50; // Width of each item in pixels (adjust as needed)
      const offset = index * itemWidth; // Calculate the offset for the index
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  };

  useEffect(() => {
    if (selectedDate?.month() > 5) {
      scrollToIndex(scrollViewRefMonthSecond, selectedDate?.month() - 7);
    } else {
      scrollToIndex(scrollViewRefMonthFirst, selectedDate?.month() - 1);
    }
    if (years?.indexOf(selectedDate?.year()) > 26) {
      scrollToIndex(
        scrollViewRefYearSecond,
        years?.indexOf(selectedDate?.year()) - 25
      );
    } else {
      scrollToIndex(
        scrollViewRefYearFirst,
        years?.indexOf(selectedDate?.year()) - 1
      );
    }
  }, []);

  const handleSelect = (type: any, value: any) => {
    let updatedDate = selectedDate?.clone();
    if (type === "day") updatedDate = updatedDate.date(value);
    if (type === "month") {
      if (value > 5) {
        scrollToIndex(scrollViewRefMonthSecond, value - 7);
      } else {
        scrollToIndex(scrollViewRefMonthFirst, value - 1);
      }
      updatedDate = updatedDate.month(value);
    }
    if (type === "year") {
      if (value > 25) {
        scrollToIndex(scrollViewRefYearSecond, value - 26);
      } else {
        scrollToIndex(scrollViewRefYearFirst, value - 1);
      }
      const selectedYear = years[value]; // Get the year from the years array
      updatedDate = updatedDate.year(selectedYear); // Set the year using the selectedYear
    }
    onDateSelect(updatedDate);
  };

  const handleConfirm = () => {
    onDateSelect(selectedDate?.format("YYYY-MM-DD"));
    onClose();
  };

  const renderColumn = (
    data: any,
    selectedValue: any,
    type: any,
    isScrollable = false
  ) => {
    return (
      <ScrollView
        horizontal={isScrollable}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={isScrollable ? styles.scrollContainer : null}
      >
        <View
          style={[
            styles.column,
            type === "month" && styles.monthsContainer, // Custom styles for months
          ]}
        >
          {data.map((item: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(type, item)}
              style={[
                styles.item,
                type === "year" &&
                  selectedValue === item &&
                  styles.itemSelected,
                type !== "year" &&
                  selectedValue === index &&
                  styles.itemSelected,
              ]}
            >
              <Text
                style={[
                  styles.itemText,
                  type === "year" &&
                    selectedValue === item &&
                    styles.itemTextSelected,
                  type !== "year" &&
                    selectedValue === index &&
                    styles.itemTextSelected,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.selectedDateText}>
            {selectedDate?.format("DD MMMM YYYY")}
          </Text>

          <View style={styles.pickerColumn}>
            <Text style={styles.label}>{t('years')}</Text>
            <ScrollView
              horizontal
              ref={scrollViewRefYearFirst}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.monthsRow}>
                {firstRowYears.map((year, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect("year", index)}
                    style={[
                      styles.item,
                      selectedDate?.year() === years[index] &&
                        styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedDate?.year() === years[index] &&
                          styles.itemTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            {type === "dateOfBirth" && (
              <ScrollView
                horizontal
                ref={scrollViewRefYearSecond}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              >
                <View style={styles.monthsRow}>
                  {secondRowYears.map((year, index) => (
                    <TouchableOpacity
                      key={index + 25} // Offset the second row
                      onPress={() => handleSelect("year", index + 25)}
                      style={[
                        styles.item,
                        selectedDate?.year() === years[index + 25] &&
                          styles.itemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          selectedDate?.year() === years[index + 25] &&
                            styles.itemTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <Text style={styles.label}>{t('month')}</Text>
            <ScrollView
              horizontal
              ref={scrollViewRefMonthFirst}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.monthsRow}>
                {firstRowMonths.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelect("month", index)}
                    style={[
                      styles.item,
                      selectedDate?.month() === index && styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedDate?.month() === index &&
                          styles.itemTextSelected,
                      ]}
                    >
                      {t(month)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <ScrollView
              horizontal
              ref={scrollViewRefMonthSecond}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <View style={styles.monthsRow}>
                {secondRowMonths.map((month, index) => (
                  <TouchableOpacity
                    key={index + 6} // Offset the second row
                    onPress={() => handleSelect("month", index + 6)}
                    style={[
                      styles.item,
                      selectedDate?.month() === index + 6 &&
                        styles.itemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        selectedDate?.month() === index + 6 &&
                          styles.itemTextSelected,
                      ]}
                    >
                      {t(month)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Days */}
            <Text style={styles.label}>{t("days")}</Text>
            {renderColumn(
              Array.from(
                { length: selectedDate?.daysInMonth() },
                (_, i) => i + 1
              ),
              selectedDate?.date() - 1,
              "day"
            )}
          </View>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 10,
              paddingHorizontal: 10,
              gap: 10,
            }}
          >
            <Button
              isPrimary={false}
              title={t("cancel")}
              onPress={onClose}
              style={styles.cancelButton}
            />
            <Button
              isPrimary={true}
              title={t("setDate")}
              onPress={handleConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    width: "90%",
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
    alignSelf: "flex-start",
    // marginLeft: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  monthsWrapper: {
    width: "100%",
    alignItems: "center",
  },
  monthsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  column: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    alignItems: "center", // Ensure the items in the column are aligned
    // marginBottom: 10, // Add some space between the column and other elements
  },
  monthsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Ensure months are spaced out properly
    width: "100%",
    // marginBottom: 10, // Space after months to separate from other elements
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    marginBottom: 8, // Space between items in the columns
  },
  itemSelected: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#757575",
  },
  itemTextSelected: {
    fontWeight: "bold",
    color: "#FFF",
  },
  cancelButton: {
    width: "34%",
  },
  cancelButtonText: {
    color: Colors?.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  pickerColumn: {
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CustomDatePicker;
