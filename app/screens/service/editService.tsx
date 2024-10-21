import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TextInputComponent from "@/components/inputs/TextInputWithIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";
import Colors, { darkGreen } from "@/constants/Colors";
import moment from "moment";

interface WorkInfoProps {
  title: string;
  setTitle: any;
  description: string;
  setDescription: any;
  startDate: Date;
  showStartDatePicker: boolean;
  setShowStartDatePicker: any;
  onStartDateChange: any;
  endDate: Date;
  showEndDatePicker: boolean;
  setShowEndDatePicker: any;
  onEndDateChange: any;
}

const EditService: React.FC<WorkInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  startDate,
  showStartDatePicker,
  setShowStartDatePicker,
  onStartDateChange,
  endDate,
  showEndDatePicker,
  setShowEndDatePicker,
  onEndDateChange,
}: WorkInfoProps) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles?.formContainer}>
        <TextInputComponent
          label="Work Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter Work Title"
        />
        <TextInputComponent
          label="Work Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter Work Description"
        />

        {/* <TouchableOpacity
          style={styles?.dateField}
          onPress={() => setShowStartDatePicker(true)}
        >
          <View style={styles.dateItem}>
            <Text style={styles.itemText}>Start Date</Text>
            <View style={styles?.calendar}>
              <Text>{startDate ? startDate.toString() : "dd/mm/yyyy"}</Text>
              <AntDesign name="calendar" size={20} color={Colors.secondary} />
            </View>
          </View>
          {showStartDatePicker && (
            <DateTimePicker
              testID="startDatePicker"
              value={new Date(startDate) || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onStartDateChange}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles?.dateField}
          onPress={() => setShowEndDatePicker(true)}
        >
          <View style={styles.dateItem}>
            <Text style={styles.itemText}>End Date</Text>
            <View style={styles?.calendar}>
              <Text>{endDate ? endDate.toString() : "dd/mm/yyyy"}</Text>
              <AntDesign name="calendar" size={20} color={Colors.secondary} />
            </View>
          </View>
          {showEndDatePicker && (
            <DateTimePicker
              testID="endDatePicker"
              value={new Date(endDate) || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onEndDateChange}
            />
          )}
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingTop: 10,
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    // paddingHorizontal: 10,
  },
  headerText: {
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    // padding: 20,
  },
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
    marginVertical: 16,
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
});

export default EditService;
