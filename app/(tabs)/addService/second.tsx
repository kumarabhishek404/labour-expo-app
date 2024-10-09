import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import Colors, { darkGreen } from "@/constants/Colors";
import Step2 from "../../../assets/step2.jpg";
import LocationField from "@/components/LocationField";
import { useAtom } from "jotai";
import { AddServiceAtom, AddServiceInProcess } from "@/app/AtomStore/user";
import Animated, { SlideInDown } from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/Button";
import { toast } from "@/app/hooks/toast";
import Stepper from "./stepper";
import AddLocationAndAddress from "@/components/AddLocationAndAddress";

interface WorkDurationProps {}
const { width } = Dimensions.get("window");

const WorkDuration: React.FC<WorkDurationProps> = () => {
  const [isAddService, setIsAddService] = useAtom(AddServiceInProcess);
  const [addService, setAddService] = useAtom(AddServiceAtom);
  const [startDate, setStartDate] = useState<any>(
    new Date(addService?.startDate) ?? ""
  );
  const [endDate, setEndDate] = useState<any>(
    new Date(addService?.endDate) ?? ""
  );
  const [address, setAddress] = useState(addService?.address ?? "");
  const [location, setLocation]: any = useState(addService?.location ?? {});

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

  const handleNext = () => {
    if (startDate && endDate && address) {
      setAddService({
        startDate: startDate,
        endDate: endDate,
        address: address,
        location: location,
        ...addService,
      });
      // setIsAddService(true);
      router?.push("/(tabs)/addService/third");
    } else {
      toast.error("Please fill all the input fields");
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles?.customHeader}>
          <Text style={styles?.headerText}>Add Service</Text>
        </View>
        <Image source={Step2} style={styles.image} />
        <Stepper currentStep={2} />

        <View style={styles?.formContainer}>
          {/* <LocationField address={address} setAddress={setAddress} /> */}
          <AddLocationAndAddress
            address={address}
            setAddress={setAddress}
            location={location}
            setLocation={setLocation}
          />
          <TouchableOpacity
            style={styles?.dateField}
            onPress={() => setShowStartDatePicker(true)}
          >
            <View style={styles.dateItem}>
              <Text style={styles.itemText}>Start Date</Text>
              <View style={styles?.calendar}>
                {startDate ? (
                  <Text>{`${startDate.getDate()}/${startDate.getMonth()}/${startDate.getFullYear()}`}</Text>
                ) : (
                  <Text>dd/mm/yyyy</Text>
                )}
                <AntDesign name="calendar" size={20} color={Colors.secondary} />
              </View>
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

          <TouchableOpacity
            style={styles?.dateField}
            onPress={() => setShowEndDatePicker(true)}
          >
            <View style={styles.dateItem}>
              <Text style={styles.itemText}>End Date</Text>
              <View style={styles?.calendar}>
                {endDate ? (
                  <Text>{`${endDate.getDate()}/${endDate.getMonth()}/${endDate.getFullYear()}`}</Text>
                ) : (
                  <Text>dd/mm/yyyy</Text>
                )}
                <AntDesign name="calendar" size={20} color={Colors.secondary} />
              </View>
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
      </ScrollView>

      <Animated.View style={styles.footer} entering={SlideInDown.delay(200)}>
        <Button
          isPrimary={false}
          title="Back"
          onPress={() => {
            setIsAddService(false);
            return router.back();
          }}
        />
        <Button isPrimary={true} title="Next" onPress={handleNext} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "white",
  },
  customHeader: {
    width: "100%",
    paddingHorizontal: 20,
  },
  headerText: {
    // textAlign: 'center',
    fontWeight: "700",
    fontSize: 20,
  },
  formContainer: {
    padding: 20,
    marginBottom: 100,
  },
  image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    marginBottom: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    padding: 20,
    paddingBottom: 30,
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
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

export default WorkDuration;
