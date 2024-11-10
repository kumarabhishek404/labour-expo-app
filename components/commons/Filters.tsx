import {  WORKERTYPES } from "@/constants";
import Colors from "@/constants/Colors";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import MultiSelectCheckboxes from "../inputs/MultiSelectCheckboxes";
import TextInputComponent from "../inputs/TextInputWithIcon";
import { Controller, useForm } from "react-hook-form";
import DateField from "../inputs/DateField";
import Button from "../inputs/Button";
import RangeSlider from "../inputs/RangeSlider";
import SelectableTags from "../inputs/SingleSelectedTag";
import CustomHeading from "./CustomHeading";

interface FiltersProps {
  filterVisible: boolean;
  setFilterVisible: any;
  onApply: any;
}

const Filters = ({
  filterVisible,
  setFilterVisible,
  onApply,
}: FiltersProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [distance, setDistance] = useState(10);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedWorkers, setSelectedWorkers]: any = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [pricePerDay, setPricePerDay] = useState("");

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

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
    reset()
    // onClear(); // trigger external clear logic
  };

  const handleApply = (data: any) => {
    console.log("Data --", data);

    const filters = {
      distance,
      startDate,
      endDate,
      selectedWorkers,
      pricePerDay,
    };

    console.log("filters --", filters);

    // onApply(filters); // pass filters to apply logic
  };

  return (
    <Modal
      visible={filterVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setFilterVisible(false)}
    >
      <KeyboardAvoidingView
        behavior="height"
        style={styles.filterModalContainer}
      >
        <View style={styles.filerScreen}>
          <View style={styles.filterHeader}>
            <CustomHeading textAlign="left">Filters</CustomHeading>
            <TouchableOpacity onPress={() => setFilterVisible(false)}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ paddingBottom: 100 }}
          >
            <Controller
              control={control}
              name="distance"
              defaultValue={""}
              //   rules={{
              //     required: false,
              //     // validate: (value) => {
              //     //   if (new Date(value) < new Date()) {
              //     //     return "Start date cannot be earlier than today";
              //     //   } else if (new Date(value) > new Date(watch("endDate"))) {
              //     //     return "Start date cannot be later than End date";
              //     //   } else {
              //     //     return true;
              //     //   }
              //     // },
              //   }}
              render={({ field: { onChange, onBlur, value } }) => (
                <SelectableTags
                  label="Distance"
                  name="distance"
                  selectedTag={value}
                  setSelectedTag={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="startDate"
              defaultValue={""}
              //   rules={{
              //     required: false,
              //     // validate: (value) => {
              //     //   if (new Date(value) < new Date()) {
              //     //     return "Start date cannot be earlier than today";
              //     //   } else if (new Date(value) > new Date(watch("endDate"))) {
              //     //     return "Start date cannot be later than End date";
              //     //   } else {
              //     //     return true;
              //     //   }
              //     // },
              //   }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateField
                  title="Start Date"
                  name="startDate"
                  date={value}
                  setDate={onChange}
                  onBlur={onBlur}
                  errors={errors}
                />
              )}
            />

            <Controller
              control={control}
              name="endDate"
              defaultValue={""}
              //   rules={{
              //     required: false,
              //     // validate: (value) => {
              //     //   if (new Date(value) < new Date()) {
              //     //     return "Start date cannot be earlier than today";
              //     //   } else if (new Date(value) > new Date(watch("endDate"))) {
              //     //     return "Start date cannot be later than End date";
              //     //   } else {
              //     //     return true;
              //     //   }
              //     // },
              //   }}
              render={({ field: { onChange, onBlur, value } }) => (
                <DateField
                  title="End Date"
                  name="endDate"
                  date={value}
                  setDate={onChange}
                  onBlur={onBlur}
                  errors={errors}
                />
              )}
            />

            <Controller
              control={control}
              name="selectedWorkers"
              defaultValue=""
              //   rules={{
              //     required: false,
              //   }}
              render={({ field: { onChange, onBlur, value } }) => (
                <MultiSelectCheckboxes
                  label="Workers"
                  name="selectedWorkers"
                  options={WORKERTYPES}
                  selectedOption={value}
                  setSelectedOption={onChange}
                  containerStyle={errors?.lastName && styles.errorInput}
                  errors={errors}
                />
              )}
            />
            <Controller
              control={control}
              name="pricePerDay"
              defaultValue=""
              //   rules={{
              //     required: false,
              //   }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputComponent
                  label="Price Per Day"
                  name="pricePerDay"
                  type="number"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter Price"
                  style={{ marginBottom: 80 }}
                  containerStyle={errors?.lastName && styles.errorInput}
                  errors={errors}
                  icon={
                    <FontAwesome
                      name="rupee"
                      size={30}
                      color={Colors.secondary}
                      style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                    />
                  }
                />
              )}
            />
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            isPrimary={false}
            title="Clear"
            onPress={handleClear}
            style={styles.clearButton}
          />
          <Button
            isPrimary={true}
            title="Apply"
            onPress={handleSubmit(handleApply)}
            style={styles.applyButton}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filerScreen: {
    backgroundColor: "#fff",
    height: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    // left: 20,
    paddingHorizontal: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
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
  errorInput: {
    borderWidth: 1,
    borderColor: "red",
    color: "red",
  },
});

export default Filters;
