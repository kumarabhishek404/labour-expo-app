import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";

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
          <CustomHeading>{title}</CustomHeading>
          <View style={styles?.calendar}>
            <CustomText fontSize={14} fontWeight="bold">
              {date ? moment(date).format("LL") : "dd/mm/yyyy"}
            </CustomText>
            <AntDesign name="calendar" size={24} color={Colors.secondary} />
          </View>
        </View>
        {showDatePicker && (
          <DateTimePicker
            testID="startDatePicker"
            value={date || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}
      </TouchableOpacity>
      {errors[name] && (
        <CustomText
          textAlign="left"
          fontSize={10}
          color={Colors?.danger}
          style={{ marginTop: 5 }}
        >
          {errors[name]?.message || ""}
        </CustomText>
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
    borderRadius: 8
  },
  dateItem: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendar: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default DateField;
