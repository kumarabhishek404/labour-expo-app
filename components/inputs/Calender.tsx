import React, { useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors, { darkGreen } from "@/constants/Colors";

const DateField = ({ startDate, setStartDate, endDate, setEndDate }: any) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onStartDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onEndDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateWrapper}>
        <TouchableOpacity style={styles?.dateField} onPress={() => setShowStartDatePicker(true)}>
          <AntDesign name="calendar" size={30} color={Colors.secondary} />
          <View style={styles.dateItem}>
            <Text style={styles.itemText}>Start Date</Text>
            {startDate ? (
              <Text>{`${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`}</Text>
            ) : (
              <Text>dd/mm/yyyy</Text>
            )}
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={startDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <AntDesign name="calendar" size={30} color={Colors.secondary} />
          <View style={styles.dateItem}>
            <Text style={styles.itemText}>End Date</Text>
            {endDate ? (
              <Text>{`${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`}</Text>
            ) : (
              <Text>dd/mm/yyyy</Text>
            )}
          </View>
          {showEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={endDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onEndDateChange}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateField;

const styles = StyleSheet.create({
  container: {
    // height: 53,
    // borderWidth: 1,
    // borderColor: Colors.secondary,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    marginBottom: 20,
  },
  dateWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: "auto",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dateField: {
    display: 'flex',
    flexDirection: "row",
    gap: 10,
    alignItems: 'center',
  },
  dateItem: {
    width: 140,
    display: "flex",
    flexDirection: "row",
    gap: 8,
    // borderColor: "red",
    // borderWidth: 1,
  },
  itemText: {
    color: darkGreen,
  },
});
