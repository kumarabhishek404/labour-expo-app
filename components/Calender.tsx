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
import { darkGreen } from "@/constants/Colors";

const DateField = () => {
  const [startDate, setStartDate]: any = useState();
  const [endDate, setEndDate]: any = useState();
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
    // <View
    //   style={{
    //     width: '78%',
    //     display: "flex",
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     borderColor: 'red',
    //     borderWidth: 1
    //   }}
    // >
    //   <View style={{ marginBottom: 20 }}>
    //     <Text style={styles.dateTitle}>Start Date</Text>
    //     {/* <Button
    //       title="Select Start Date"
    //       onPress={() => setShowStartDatePicker(true)}
    //     /> */}
    //     {showStartDatePicker && (
    //       <DateTimePicker
    //         testID="startDatePicker"
    //         value={startDate}
    //         mode="date"
    //         is24Hour={true}
    //         display="default"
    //         onChange={onStartDateChange}
    //       />
    //     )}
    //     <Text>{`Start Date: ${startDate.toLocaleDateString()}`}</Text>
    //   </View>
    //   <View>
    //     <Text style={styles.dateTitle}>End Date</Text>
    //     {/* <Button
    //     //   title="Select End Date"
    //     //   onPress={() => setShowEndDatePicker(true)}
    //     >
    //        Select End Date </Button> */}

    //     {showEndDatePicker && (
    //       <DateTimePicker
    //         testID="endDatePicker"
    //         value={endDate}
    //         mode="date"
    //         is24Hour={true}
    //         display="default"
    //         onChange={onEndDateChange}
    //       />
    //     )}
    //     <Text>{`End Date: ${endDate.toLocaleDateString()}`}</Text>
    //   </View>
    // </View>
    <View style={styles.container}>
      <AntDesign style={styles.calenderIcon} name="calendar" size={18} />
      <View style={styles.dateWrapper}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
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
    width: "78%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    padding: 10,
    backgroundColor: "rgb(220,220, 220)",
    borderRadius: 4,
    marginVertical: 10,
  },
  dateWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  calenderIcon: {
    width: 30,
    // borderColor: "red",
    // borderWidth: 1,
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
