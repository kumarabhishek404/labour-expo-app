import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
// import Slider from '@react-native-community/slider'; // For distance range slider
import DateTimePicker from "@react-native-community/datetimepicker"; // For date picker

const FilterModal = ({ isVisible, onClose, onApply, onClear }: any) => {
  const [distance, setDistance] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedWorkers, setSelectedWorkers]: any = useState([]);
  const [pricePerDay, setPricePerDay] = useState("");

  const workers = ["Labour", "Plumber", "Helper", "Tractor Driver"];

  // Toggle selected workers
  const toggleWorkerSelection = (worker: string) => {
    if (selectedWorkers.includes(worker)) {
      setSelectedWorkers(
        selectedWorkers.filter((item: string) => item !== worker)
      );
    } else {
      setSelectedWorkers([...selectedWorkers, worker]);
    }
  };

  const handleClear = () => {
    setDistance(10);
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedWorkers([]);
    setPricePerDay("");
    onClear(); // trigger external clear logic
  };

  const handleApply = () => {
    const filters = {
      distance,
      startDate,
      endDate,
      selectedWorkers,
      pricePerDay,
    };
    onApply(filters); // pass filters to apply logic
  };

  // Animation state and setup
  const [modalY] = useState(new Animated.Value(1000)); // Modal starts off the screen

  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalY, {
        toValue: 0, // Modal comes up to the top
        duration: 500, // Animation duration
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.modalBackground}>
        <TouchableOpacity style={styles.closeOverlay} onPress={onClose} />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: modalY }] },
          ]}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>FILTER</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {/* Distance Slider */}
            <View style={styles.filterSection}>
              <Text style={styles.label}>Distance: {distance} km</Text>
              {/* <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={50}
                                step={1}
                                value={distance}
                                onValueChange={(value) => setDistance(value)}
                                minimumTrackTintColor="#4F8EF7"
                                maximumTrackTintColor="#ccc"
                            /> */}
            </View>

            {/* Date Range */}
            <View style={styles.filterSection}>
              <Text style={styles.label}>Start Date</Text>
              {/* <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(event, date) => date && setStartDate(date)}
                            /> */}

              <Text style={styles.label}>End Date</Text>
              {/* <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(event, date) => date && setEndDate(date)}
                            /> */}
            </View>

            {/* Worker Selection */}
            <View style={styles.filterSection}>
              <Text style={styles.label}>Workers</Text>
              {workers.map((worker) => (
                <TouchableOpacity
                  key={worker}
                  style={styles.workerItem}
                  onPress={() => toggleWorkerSelection(worker)}
                >
                  <Text>{worker}</Text>
                  <View
                    style={
                      selectedWorkers.includes(worker)
                        ? styles.checkboxSelected
                        : styles.checkbox
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Per Day */}
            <View style={styles.filterSection}>
              <Text style={styles.label}>Price Per Day</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Price"
                keyboardType="numeric"
                value={pricePerDay}
                onChangeText={(text) => setPricePerDay(text)}
              />
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Background dimming
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4F8EF7",
  },
  closeIcon: {
    fontSize: 20,
    color: "#4F8EF7",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  filterSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: {
    width: "100%",
  },
  workerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 4,
  },
  checkboxSelected: {
    width: 20,
    height: 20,
    backgroundColor: "#4F8EF7",
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4F8EF7",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  closeOverlay: {
    flex: 1,
    backgroundColor: "transparent", // Close on clicking outside
  },
});

export default FilterModal;
