import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";
import CustomHeading from "../commons/CustomHeading";
import CustomText from "../commons/CustomText";
import CustomDatePicker from "./CustomDatePicker";

interface DateFieldProps {
  title: string;
  name: string;
  type: string;
  date: any;
  setDate: any;
  errors: any;
}

const DateField: React.FC<DateFieldProps> = ({
  title,
  type,
  name,
  date,
  setDate,
  errors,
}: DateFieldProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  return (
    <View style={styles?.container}>
      <TouchableOpacity
        style={[styles?.dateField]}
        onPress={() => setShowDatePicker(true)}
      >
        <View style={styles.dateItem}>
          <CustomHeading baseFont={16} fontWeight="500">
            {title}
          </CustomHeading>
          <View style={styles?.calendar}>
            <CustomText baseFont={14} fontWeight="bold">
              {date ? moment(date).format("LL") : "dd/mm/yyyy"}
            </CustomText>
            <AntDesign name="calendar" size={24} color={Colors.secondary} />
          </View>
        </View>
        {showDatePicker && (
          <CustomDatePicker
            visible={true}
            selectedDate={date}
            type={type}
            onClose={() => setShowDatePicker(false)}
            onDateSelect={(date: any) => onDateChange(date)}
          />
        )}
      </TouchableOpacity>
      {errors?.[name] && (
        <CustomText
          textAlign="left"
          baseFont={10}
          color={Colors?.danger}
          style={{ marginTop: 5 }}
        >
          {errors?.[name]?.message || ""}
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
    height: 50,
    padding: 10,
    backgroundColor: Colors?.white,
    borderColor: Colors?.secondary,
    borderRadius: 8,
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
    alignItems: "center",
    gap: 5,
  },
});

export default DateField;
