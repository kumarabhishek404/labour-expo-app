import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors, { darkGreen } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

interface DateFieldProps {
  title: string;
  name: string;
  date: Date;
  setDate: any;
  onBlur: any;
  errors: any;
}

const DateField: React.FC<DateFieldProps> = ({
  title,
  name,
  date,
  setDate,
  onBlur,
  errors,
}: DateFieldProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  return (
    <View style={styles?.container}>
      <TouchableOpacity
        style={[styles?.dateField, errors[name] && styles?.errorInput]}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.dateItem}>
          <Text style={styles.itemText}>{title}</Text>
          <View style={styles?.calendar}>
            <Text>{date ? moment(date).format("LL") : "dd/mm/yyyy"}</Text>
            <AntDesign name="calendar" size={20} color={Colors.secondary} />
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            testID="startDatePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </TouchableOpacity>
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message || ""}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dateField: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    height: 53,
    padding: 10,
    borderColor: Colors?.secondary,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  calendar: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  itemText: {
    color: darkGreen,
    fontWeight: "400",
    fontSize: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});

export default DateField;
