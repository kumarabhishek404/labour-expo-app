import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import moment from "moment";

const { width } = Dimensions.get("window");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomDatePicker = ({ visible, onClose, onDateSelect }: any) => {
  const currentYear = moment().year();
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedDay, setSelectedDay] = useState(moment().date() - 1);
  const [selectedYear, setSelectedYear] = useState(0);
  const [years, setYears] = useState([]);

  useEffect(() => {
    const generatedYears: any = Array.from(
      { length: 101 },
      (_, i) => currentYear - 50 + i
    );
    setYears(generatedYears);
    setSelectedYear(
      generatedYears.findIndex((year: any) => year === currentYear)
    );
  }, []);

  const daysInMonth = (month: any, year: any) =>
    moment(`${year}-${month + 1}`, "YYYY-MM").daysInMonth();

  const handleConfirm = () => {
    const selectedDate = moment()
      .year(years[selectedYear])
      .month(selectedMonth)
      .date(selectedDay + 1);
    onDateSelect(selectedDate.format("YYYY-MM-DD"));
    onClose();
  };

  const renderPicker = (
    data: any,
    selectedIndex: any,
    setSelectedIndex: any
  ) => (
    <FlatList
      data={data}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerStyle={styles.pickerList}
      snapToInterval={40}
      initialScrollIndex={selectedIndex} // Ensures the selected item is in view
      getItemLayout={(_, index) => ({
        length: 40,
        offset: 40 * index,
        index,
      })}
      style={styles.pickerFlatList}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => setSelectedIndex(index)}
          style={[
            styles.pickerItem,
            index === selectedIndex && styles.pickerItemSelected,
          ]}
        >
          <Text
            style={[
              styles.pickerItemText,
              index === selectedIndex && styles.pickerItemTextSelected,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.pickerContainer}>
          <Text style={styles.headerText}>
            {months[selectedMonth]} {selectedDay + 1}, {years[selectedYear]}
          </Text>
          {/* Instructional Text and Arrows */}
          <Text style={styles.instructions}>
            Scroll up or down to select a value. Tap on the value to choose it.
          </Text>
          <Text style={styles.arrowText}>↑ Scroll ↑</Text>

          <View style={styles.pickerRow}>
            {renderPicker(months, selectedMonth, setSelectedMonth)}
            {renderPicker(
              Array.from(
                { length: daysInMonth(selectedMonth, years[selectedYear]) },
                (_, i) => `${i + 1}`
              ),
              selectedDay,
              setSelectedDay
            )}
            {renderPicker(
              years.map((year) => `${year}`),
              selectedYear,
              setSelectedYear
            )}
          </View>
          <Text style={styles.arrowText}>↓ Scroll ↓</Text>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Set Date</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "90%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
  },
  arrowText: {
    fontSize: 18,
    color: "#999",
    fontWeight: "bold",
  },
  pickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pickerFlatList: {
    height: 120,
    width: width * 0.25,
  },
  pickerList: {
    alignItems: "center",
  },
  pickerItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemSelected: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pickerItemText: {
    fontSize: 16,
    color: "#757575",
  },
  pickerItemTextSelected: {
    fontWeight: "bold",
    color: "#000",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#F44336",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomDatePicker;
